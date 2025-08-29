"use client";

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { QuantumEncryption } from '@/lib/quantum-crypto';
import { copyToClipboard } from '@/lib/crypto-utils';

// Simple toast alternative
const toast = {
  success: (title: string, options?: { description?: string }) => {
    console.log(`✅ ${title}${options?.description ? `: ${options.description}` : ''}`);
  },
  error: (title: string, options?: { description?: string }) => {
    console.error(`❌ ${title}${options?.description ? `: ${options.description}` : ''}`);
  }
};

interface EncryptionBlockProps {
  generatedPassword?: string;
}

export default function EncryptionBlock({ generatedPassword }: EncryptionBlockProps) {
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [encryptedData, setEncryptedData] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [encryptionTime, setEncryptionTime] = useState<number | null>(null);

  // Update password when generated password changes
  useState(() => {
    if (generatedPassword) {
      setPassword(generatedPassword);
    }
  });

  const handleEncrypt = useCallback(async () => {
    if (!message.trim() || !password.trim()) {
      toast.error('Missing required fields', {
        description: 'Please provide both message and password'
      });
      return;
    }

    setIsEncrypting(true);
    const startTime = performance.now();

    try {
      const encrypted = await QuantumEncryption.encrypt(message, password);
      const endTime = performance.now();
      
      setEncryptedData(encrypted);
      setEncryptionTime(endTime - startTime);
      
      toast.success('Message encrypted successfully!', {
        description: `Encryption completed in ${Math.round(endTime - startTime)}ms`
      });
    } catch (error) {
      toast.error('Encryption failed', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsEncrypting(false);
    }
  }, [message, password]);

  const handleCopyEncrypted = async () => {
    if (!encryptedData) return;
    
    const success = await copyToClipboard(encryptedData);
    if (success) {
      toast.success('Encrypted data copied to clipboard!');
    } else {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleClearAll = () => {
    setMessage('');
    setEncryptedData('');
    setEncryptionTime(null);
    toast.success('All fields cleared');
  };

  const getDataSize = (data: string): string => {
    const bytes = new Blob([data]).size;
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gray-900/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-2">
          🔒 Message Encryption
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Password Input */}
        <div className="space-y-2">
          <Label htmlFor="encryption-password" className="text-gray-200">
            Encryption Password
          </Label>
          <div className="relative">
            <Input
              id="encryption-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter or use generated password..."
              className="bg-gray-800 border-gray-600 text-gray-200 pr-20"
            />
            {generatedPassword && (
              <Button
                onClick={() => setPassword(generatedPassword)}
                size="sm"
                className="absolute right-1 top-1 bg-purple-600 hover:bg-purple-700 text-white text-xs"
              >
                Use Generated
              </Button>
            )}
          </div>
          {password && (
            <div className="text-xs text-gray-400">
              Password length: {password.length} characters
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="space-y-2">
          <Label htmlFor="message-input" className="text-gray-200">
            Message to Encrypt
          </Label>
          <Textarea
            id="message-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message here..."
            className="bg-gray-800 border-gray-600 text-gray-200 min-h-32 resize-y"
            rows={4}
          />
          {message && (
            <div className="text-xs text-gray-400 flex justify-between">
              <span>Characters: {message.length}</span>
              <span>Size: {getDataSize(message)}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleEncrypt}
            disabled={isEncrypting || !message.trim() || !password.trim()}
            className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-medium transition-all duration-300 disabled:opacity-50"
          >
            {isEncrypting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Encrypting...
              </div>
            ) : (
              '🔐 Encrypt Message'
            )}
          </Button>
          
          <Button
            onClick={handleClearAll}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            🗑️ Clear All
          </Button>
        </div>

        {/* Encryption Result */}
        {encryptedData && (
          <>
            <Separator className="bg-gray-700" />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-gray-200 font-medium">Encrypted Data</Label>
                <div className="flex items-center gap-2">
                  {encryptionTime && (
                    <Badge variant="outline" className="border-green-500 text-green-400">
                      {Math.round(encryptionTime)}ms
                    </Badge>
                  )}
                  <Badge variant="outline" className="border-blue-500 text-blue-400">
                    {getDataSize(encryptedData)}
                  </Badge>
                </div>
              </div>
              
              <div className="relative">
                <Textarea
                  value={encryptedData}
                  readOnly
                  className="bg-gray-800 border-gray-600 text-gray-200 font-mono text-sm min-h-32 resize-y"
                  rows={4}
                />
                <Button
                  onClick={handleCopyEncrypted}
                  size="sm"
                  className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  📋 Copy
                </Button>
              </div>
              
              <div className="text-xs text-gray-400 space-y-1">
                <div>✅ AES-256-GCM encryption with PBKDF2 key derivation</div>
                <div>🔒 Salt and IV included for secure decryption</div>
                <div>📦 Base64 encoded for safe transport</div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}