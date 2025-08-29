"use client";

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { QuantumEncryption } from '@/lib/quantum-crypto';
import { copyToClipboard, debounce } from '@/lib/crypto-utils';

// Simple toast alternative
const toast = {
  success: (title: string, options?: { description?: string }) => {
    console.log(`✅ ${title}${options?.description ? `: ${options.description}` : ''}`);
  },
  error: (title: string, options?: { description?: string }) => {
    console.error(`❌ ${title}${options?.description ? `: ${options.description}` : ''}`);
  }
};

export default function DecryptionBlock() {
  const [password, setPassword] = useState('');
  const [encryptedData, setEncryptedData] = useState('');
  const [decryptedMessage, setDecryptedMessage] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptionTime, setDecryptionTime] = useState<number | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [autoDecryptEnabled, setAutoDecryptEnabled] = useState(true);

  // Debounced decryption for real-time updates
  const debouncedDecrypt = useCallback(
    debounce(async (pwd: string, data: string) => {
      if (!pwd.trim() || !data.trim()) {
        setDecryptedMessage('');
        setDecryptionTime(null);
        setValidationError(null);
        return;
      }

      // Validate encrypted data format
      if (!QuantumEncryption.validateEncryptedData(data)) {
        setValidationError('Invalid encrypted data format');
        setDecryptedMessage('');
        return;
      }

      setIsDecrypting(true);
      setValidationError(null);
      const startTime = performance.now();

      try {
        const decrypted = await QuantumEncryption.decrypt(data, pwd);
        const endTime = performance.now();
        
        setDecryptedMessage(decrypted);
        setDecryptionTime(endTime - startTime);
        setValidationError(null);
      } catch (error) {
        setValidationError(error instanceof Error ? error.message : 'Decryption failed');
        setDecryptedMessage('');
        setDecryptionTime(null);
      } finally {
        setIsDecrypting(false);
      }
    }, 500),
    []
  );

  // Auto-decrypt when inputs change
  useEffect(() => {
    if (autoDecryptEnabled) {
      debouncedDecrypt(password, encryptedData);
    }
  }, [password, encryptedData, autoDecryptEnabled, debouncedDecrypt]);

  const handleManualDecrypt = useCallback(async () => {
    if (!password.trim() || !encryptedData.trim()) {
      toast.error('Missing required fields', {
        description: 'Please provide both password and encrypted data'
      });
      return;
    }

    setIsDecrypting(true);
    setValidationError(null);
    const startTime = performance.now();

    try {
      const decrypted = await QuantumEncryption.decrypt(encryptedData, password);
      const endTime = performance.now();
      
      setDecryptedMessage(decrypted);
      setDecryptionTime(endTime - startTime);
      
      toast.success('Message decrypted successfully!', {
        description: `Decryption completed in ${Math.round(endTime - startTime)}ms`
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Decryption failed';
      setValidationError(errorMessage);
      setDecryptedMessage('');
      setDecryptionTime(null);
      
      toast.error('Decryption failed', {
        description: errorMessage
      });
    } finally {
      setIsDecrypting(false);
    }
  }, [password, encryptedData]);

  const handleCopyDecrypted = async () => {
    if (!decryptedMessage) return;
    
    const success = await copyToClipboard(decryptedMessage);
    if (success) {
      toast.success('Decrypted message copied to clipboard!');
    } else {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleClearAll = () => {
    setPassword('');
    setEncryptedData('');
    setDecryptedMessage('');
    setDecryptionTime(null);
    setValidationError(null);
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
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent flex items-center gap-2">
          🔓 Message Decryption
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Auto-decrypt Toggle */}
        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700">
          <div>
            <Label className="text-gray-200 font-medium">Real-time Decryption</Label>
            <p className="text-xs text-gray-400">Automatically decrypt as you type</p>
          </div>
          <Button
            variant={autoDecryptEnabled ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoDecryptEnabled(!autoDecryptEnabled)}
            className={autoDecryptEnabled 
              ? "bg-green-600 hover:bg-green-700 text-white" 
              : "border-gray-600 text-gray-300 hover:bg-gray-800"
            }
          >
            {autoDecryptEnabled ? '⚡ ON' : '⏸️ OFF'}
          </Button>
        </div>

        {/* Password Block */}
        <div className="space-y-2">
          <Label htmlFor="decryption-password" className="text-gray-200 font-medium">
            🔑 Password Block
          </Label>
          <Input
            id="decryption-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter the password used for encryption..."
            className="bg-gray-800 border-gray-600 text-gray-200 font-mono"
          />
          {password && (
            <div className="text-xs text-gray-400">
              Password length: {password.length} characters
            </div>
          )}
        </div>

        {/* Encrypted Data Block */}
        <div className="space-y-2">
          <Label htmlFor="encrypted-input" className="text-gray-200 font-medium">
            📦 Encrypted Data Block
          </Label>
          <Textarea
            id="encrypted-input"
            value={encryptedData}
            onChange={(e) => setEncryptedData(e.target.value)}
            placeholder="Paste your encrypted message here..."
            className="bg-gray-800 border-gray-600 text-gray-200 font-mono text-sm min-h-32 resize-y"
            rows={4}
          />
          {encryptedData && (
            <div className="text-xs text-gray-400 flex justify-between">
              <span>Characters: {encryptedData.length}</span>
              <span>Size: {getDataSize(encryptedData)}</span>
            </div>
          )}
        </div>

        {/* Validation Error */}
        {validationError && (
          <Alert className="border-red-500/50 bg-red-500/10">
            <AlertDescription className="text-red-300">
              ⚠️ {validationError}
            </AlertDescription>
          </Alert>
        )}

        {/* Manual Decrypt Button */}
        {!autoDecryptEnabled && (
          <Button
            onClick={handleManualDecrypt}
            disabled={isDecrypting || !password.trim() || !encryptedData.trim()}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-medium transition-all duration-300 disabled:opacity-50"
          >
            {isDecrypting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Decrypting...
              </div>
            ) : (
              '🔓 Decrypt Message'
            )}
          </Button>
        )}

        {/* Clear Button */}
        <Button
          onClick={handleClearAll}
          variant="outline"
          className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
        >
          🗑️ Clear All Fields
        </Button>

        {/* Decryption Result */}
        {(decryptedMessage || isDecrypting) && (
          <>
            <Separator className="bg-gray-700" />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-gray-200 font-medium">
                  {isDecrypting ? 'Decrypting...' : '📄 Decrypted Message'}
                </Label>
                <div className="flex items-center gap-2">
                  {decryptionTime && (
                    <Badge variant="outline" className="border-green-500 text-green-400">
                      {Math.round(decryptionTime)}ms
                    </Badge>
                  )}
                  {decryptedMessage && (
                    <Badge variant="outline" className="border-blue-500 text-blue-400">
                      {getDataSize(decryptedMessage)}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="relative">
                {isDecrypting ? (
                  <div className="flex items-center justify-center p-8 bg-gray-800 border border-gray-600 rounded">
                    <div className="flex items-center gap-3 text-gray-300">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      Processing quantum decryption...
                    </div>
                  </div>
                ) : (
                  <Textarea
                    value={decryptedMessage}
                    readOnly
                    className="bg-gray-800 border-gray-600 text-gray-200 min-h-32 resize-y"
                    rows={4}
                  />
                )}
                
                {decryptedMessage && (
                  <Button
                    onClick={handleCopyDecrypted}
                    size="sm"
                    className="absolute top-2 right-2 bg-green-600 hover:bg-green-700 text-white"
                  >
                    📋 Copy
                  </Button>
                )}
              </div>
              
              {decryptedMessage && (
                <div className="text-xs text-gray-400 space-y-1">
                  <div>✅ Message successfully decrypted</div>
                  <div>🔓 AES-256-GCM decryption completed</div>
                  <div>📝 Original message restored</div>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}