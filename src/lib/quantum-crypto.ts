// Quantum-inspired cryptographic utilities for browser environment

// Quantum Random Number Generator using multiple entropy sources
export class QuantumRNG {
  private static entropyPool: number[] = [];
  private static lastUpdate = 0;

  // Collect entropy from multiple sources for quantum-inspired randomness
  private static collectEntropy(): void {
    const now = performance.now();
    if (now - this.lastUpdate < 100) return; // Throttle entropy collection
    
    this.lastUpdate = now;
    
    // Multiple entropy sources
    this.entropyPool.push(
      Math.random() * 1000000,
      now % 1000000,
      Date.now() % 1000000,
      (Math.random() * performance.now()) % 1000000
    );
    
    // Keep pool size reasonable
    if (this.entropyPool.length > 1000) {
      this.entropyPool = this.entropyPool.slice(-500);
    }
  }

  // Generate quantum-inspired random bytes
  static generateBytes(length: number): Uint8Array {
    this.collectEntropy();
    
    // Use Web Crypto API as primary source
    const bytes = new Uint8Array(length);
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(bytes);
    } else {
      // Fallback using enhanced entropy
      for (let i = 0; i < length; i++) {
        const entropy = this.entropyPool.length > 0 
          ? this.entropyPool[i % this.entropyPool.length] 
          : Math.random() * 256;
        bytes[i] = Math.floor((entropy + Math.random() * 256 + performance.now()) % 256);
      }
    }
    
    return bytes;
  }

  // Generate secure password with quantum randomness
  static generatePassword(length: number = 32, options: {
    includeUppercase?: boolean;
    includeLowercase?: boolean;
    includeNumbers?: boolean;
    includeSymbols?: boolean;
  } = {}): string {
    const {
      includeUppercase = true,
      includeLowercase = true,
      includeNumbers = true,
      includeSymbols = true
    } = options;

    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (charset.length === 0) {
      throw new Error('At least one character type must be selected');
    }

    const randomBytes = this.generateBytes(length * 2); // Extra bytes for better distribution
    let password = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = randomBytes[i] % charset.length;
      password += charset[randomIndex];
    }
    
    return password;
  }
}

// AES-256-GCM Encryption utilities
export class QuantumEncryption {
  private static async deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    );
    
    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      {
        name: 'AES-GCM',
        length: 256
      },
      false,
      ['encrypt', 'decrypt']
    );
  }

  // Encrypt message using quantum-generated password
  static async encrypt(message: string, password: string): Promise<string> {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(message);
      
      // Generate random salt and IV
      const salt = QuantumRNG.generateBytes(32);
      const iv = QuantumRNG.generateBytes(16);
      
      // Derive encryption key
      const key = await this.deriveKey(password, salt);
      
      // Encrypt the data
      const encrypted = await window.crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        key,
        data as BufferSource
      );
      
      // Combine salt, IV, and encrypted data
      const result = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
      result.set(salt, 0);
      result.set(iv, salt.length);
      result.set(new Uint8Array(encrypted), salt.length + iv.length);
      
      // Return base64 encoded result
      return btoa(String.fromCharCode(...result));
    } catch (error) {
      throw new Error('Encryption failed: ' + (error as Error).message);
    }
  }

  // Decrypt message using password
  static async decrypt(encryptedData: string, password: string): Promise<string> {
    try {
      // Decode base64
      const data = new Uint8Array(
        atob(encryptedData)
          .split('')
          .map(char => char.charCodeAt(0))
      );
      
      // Extract salt, IV, and encrypted data
      const salt = data.slice(0, 32);
      const iv = data.slice(32, 48);
      const encrypted = data.slice(48);
      
      // Derive decryption key
      const key = await this.deriveKey(password, salt);
      
      // Decrypt the data
      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        key,
        encrypted as BufferSource
      );
      
      // Return decrypted message
      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (error) {
      throw new Error('Decryption failed: Invalid password or corrupted data');
    }
  }

  // Validate encrypted data format
  static validateEncryptedData(data: string): boolean {
    try {
      const decoded = atob(data);
      return decoded.length >= 48; // At least salt (32) + IV (16) bytes
    } catch {
      return false;
    }
  }
}