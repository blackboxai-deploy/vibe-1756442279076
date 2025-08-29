"use client";

import DecryptionBlock from '@/components/DecryptionBlock';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DecryptorPage() {
  return (
    <div className="min-h-screen space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
          Quantum Decryptor
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Decrypt your encrypted messages by manually entering the password and encrypted data
        </p>
        
        {/* Navigation Helper */}
        <div className="flex justify-center mt-6">
          <Link href="/encryptor">
            <Button variant="outline" className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white">
              🔒 Go to Encryptor
            </Button>
          </Link>
        </div>
      </div>

      {/* Decryption Section */}
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-200 mb-2">
            Decrypt Your Message
          </h2>
          <p className="text-gray-400">
            Enter the password and encrypted data to reveal the original message
          </p>
        </div>
        
        <DecryptionBlock />
      </div>

      {/* Instructions */}
      <div className="max-w-4xl mx-auto bg-gray-900/30 border border-gray-700 rounded-lg p-6 backdrop-blur-sm">
        <h3 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
          📋 How to Decrypt
        </h3>
        <div className="space-y-3 text-gray-300 text-sm">
          <div className="flex items-start gap-3">
            <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
            <p><strong>Enter Password:</strong> Input the exact password that was used for encryption in the password block</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
            <p><strong>Paste Encrypted Data:</strong> Copy and paste the encrypted message into the encrypted data block</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
            <p><strong>Real-time Decryption:</strong> With real-time mode enabled, decryption happens automatically as you type</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
            <p><strong>Manual Mode:</strong> Toggle off real-time mode if you prefer to decrypt manually with the button</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">5</span>
            <p><strong>Copy Result:</strong> Once decrypted, copy the original message for use</p>
          </div>
        </div>
      </div>

      {/* Example Format */}
      <div className="max-w-4xl mx-auto bg-gray-900/30 border border-gray-700 rounded-lg p-6 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
          📄 Expected Data Formats
        </h3>
        <div className="space-y-4 text-gray-300 text-sm">
          <div>
            <h4 className="text-orange-300 font-medium mb-2">Password Format:</h4>
            <div className="bg-gray-800 p-3 rounded border border-gray-600 font-mono text-xs">
              <span className="text-gray-400">Example:</span> <span className="text-orange-300">Kx9$mP2vQ#nR8wE@</span>
            </div>
          </div>
          
          <div>
            <h4 className="text-red-300 font-medium mb-2">Encrypted Data Format:</h4>
            <div className="bg-gray-800 p-3 rounded border border-gray-600 font-mono text-xs break-all">
              <span className="text-gray-400">Example:</span> <span className="text-red-300">eyJzYWx0IjoiYWJjZGVmZ2hpams...VyY3J5cHRlZERhdGEifQ==</span>
            </div>
            <p className="text-gray-400 text-xs mt-1">Base64-encoded string containing salt, IV, and encrypted data</p>
          </div>
        </div>
      </div>

      {/* Error Troubleshooting */}
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-red-300 mb-3 flex items-center gap-2">
          ⚠️ Troubleshooting
        </h3>
        <div className="space-y-2 text-red-200 text-sm">
          <p><strong>Invalid encrypted data format:</strong> Ensure the encrypted data is complete and not truncated</p>
          <p><strong>Decryption failed:</strong> Verify the password is exactly the same as used for encryption</p>
          <p><strong>No output:</strong> Check that both password and encrypted data fields are filled</p>
          <p><strong>Corrupted data:</strong> The encrypted data may have been modified - try copying again</p>
        </div>
      </div>

      {/* Security Reminder */}
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-lg p-6 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-blue-300 mb-3 flex items-center gap-2">
          🔒 Security Reminder
        </h3>
        <div className="space-y-2 text-blue-200 text-sm">
          <p>• All decryption is performed locally - your data never leaves your browser</p>
          <p>• Passwords are case-sensitive and must match exactly</p>
          <p>• Clear the fields after decryption to avoid leaving sensitive data in memory</p>
          <p>• This decryptor only works with data encrypted using this quantum encryption tool</p>
        </div>
      </div>
    </div>
  );
}