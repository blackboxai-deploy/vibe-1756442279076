"use client";

import { useState } from 'react';
import QuantumGenerator from '@/components/QuantumGenerator';
import EncryptionBlock from '@/components/EncryptionBlock';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function EncryptorPage() {
  const [generatedPassword, setGeneratedPassword] = useState<string>('');

  const handlePasswordGenerated = (password: string) => {
    setGeneratedPassword(password);
  };

  return (
    <div className="min-h-screen space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
          Quantum Encryptor
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Generate quantum-secure passwords and encrypt your messages with military-grade AES-256-GCM encryption
        </p>
        
        {/* Navigation Helper */}
        <div className="flex justify-center mt-6">
          <Link href="/decryptor">
            <Button variant="outline" className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white">
              🔓 Go to Decryptor
            </Button>
          </Link>
        </div>
      </div>

      {/* Password Generator Section */}
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-200 mb-2">
            Step 1: Generate Quantum Password
          </h2>
          <p className="text-gray-400">
            Create a cryptographically secure password using quantum-inspired randomness
          </p>
        </div>
        
        <QuantumGenerator onPasswordGenerated={handlePasswordGenerated} />
      </div>

      {/* Encryption Section */}
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-200 mb-2">
            Step 2: Encrypt Your Message
          </h2>
          <p className="text-gray-400">
            Use the generated password to encrypt your sensitive data
          </p>
        </div>
        
        <EncryptionBlock generatedPassword={generatedPassword} />
      </div>

      {/* Instructions */}
      <div className="max-w-4xl mx-auto bg-gray-900/30 border border-gray-700 rounded-lg p-6 backdrop-blur-sm">
        <h3 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
          📋 How to Use
        </h3>
        <div className="space-y-3 text-gray-300 text-sm">
          <div className="flex items-start gap-3">
            <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
            <p>Generate a quantum password using the customizable options above</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
            <p>Copy the generated password - you'll need it for decryption later</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
            <p>Enter your message in the encryption block and encrypt it using the password</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
            <p>Copy the encrypted data and share it safely - remember to share the password separately!</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">5</span>
            <p>Use the decryptor page to decrypt messages by manually entering the password and encrypted data</p>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-lg p-6 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-blue-300 mb-3 flex items-center gap-2">
          🛡️ Security Notice
        </h3>
        <div className="space-y-2 text-blue-200 text-sm">
          <p>• All encryption is performed locally in your browser - no data is sent to servers</p>
          <p>• Store your passwords securely - lost passwords cannot recover encrypted data</p>
          <p>• Share passwords and encrypted data through separate, secure channels</p>
          <p>• This tool uses military-grade AES-256-GCM encryption with quantum-inspired key generation</p>
        </div>
      </div>
    </div>
  );
}