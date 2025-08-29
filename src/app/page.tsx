import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  return (
    <div className="min-h-screen -mt-8 flex flex-col items-center justify-center space-y-8 px-4">
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-4xl">
        <div className="space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/25">
            <span className="text-4xl">⚛️</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            QuantumCrypt
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Advanced quantum-inspired encryption and decryption platform with secure password generation
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center gap-2">
                🔮 Quantum RNG
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm">
                Generate cryptographically secure passwords using quantum-inspired random number generation
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm hover:border-green-500/50 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                🔒 AES-256 Encryption
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm">
                Military-grade AES-256-GCM encryption with PBKDF2 key derivation for maximum security
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm hover:border-orange-500/50 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-orange-400 flex items-center gap-2">
                🔓 Real-time Decryption
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm">
                Instant decryption with real-time validation and comprehensive error handling
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Security Badges */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <Badge variant="outline" className="border-blue-500 text-blue-400 px-3 py-1">
            🔒 Client-Side Only
          </Badge>
          <Badge variant="outline" className="border-green-500 text-green-400 px-3 py-1">
            🛡️ No Data Transmission
          </Badge>
          <Badge variant="outline" className="border-purple-500 text-purple-400 px-3 py-1">
            ⚛️ Quantum-Inspired
          </Badge>
          <Badge variant="outline" className="border-cyan-500 text-cyan-400 px-3 py-1">
            🚀 Real-time Processing
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Link href="/encryptor">
            <Button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-medium px-8 py-3 text-lg transition-all duration-300 shadow-lg shadow-green-500/25 hover:shadow-green-500/40">
              🔒 Start Encrypting
            </Button>
          </Link>
          
          <Link href="/decryptor">
            <Button variant="outline" className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white font-medium px-8 py-3 text-lg transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40">
              🔓 Decrypt Messages
            </Button>
          </Link>
        </div>
      </div>

      {/* Technical Specs */}
      <div className="max-w-4xl w-full mt-16">
        <Card className="bg-gray-900/30 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-gray-200 flex items-center justify-center gap-2">
              🔧 Technical Specifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Encryption Algorithm:</span>
                  <span className="text-blue-400 font-mono">AES-256-GCM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Key Derivation:</span>
                  <span className="text-green-400 font-mono">PBKDF2 (100K iterations)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Random Generator:</span>
                  <span className="text-purple-400 font-mono">Quantum-Inspired PRNG</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Data Encoding:</span>
                  <span className="text-cyan-400 font-mono">Base64</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Security Level:</span>
                  <span className="text-orange-400 font-mono">Military Grade</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Processing:</span>
                  <span className="text-red-400 font-mono">Client-Side Only</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-500 text-sm mt-16 pb-8">
        <p>🔒 All encryption and decryption operations are performed locally in your browser.</p>
        <p>⚛️ No data is transmitted to external servers. Your privacy is guaranteed.</p>
      </div>
    </div>
  );
}