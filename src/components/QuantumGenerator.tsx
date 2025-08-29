"use client";

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { QuantumRNG } from '@/lib/quantum-crypto';
import { copyToClipboard, validatePasswordStrength } from '@/lib/crypto-utils';
// Simple toast alternative
const toast = {
  success: (title: string, options?: { description?: string }) => {
    console.log(`✅ ${title}${options?.description ? `: ${options.description}` : ''}`);
  },
  error: (title: string, options?: { description?: string }) => {
    console.error(`❌ ${title}${options?.description ? `: ${options.description}` : ''}`);
  }
};

interface QuantumGeneratorProps {
  onPasswordGenerated?: (password: string) => void;
}

export default function QuantumGenerator({ onPasswordGenerated }: QuantumGeneratorProps) {
  const [password, setPassword] = useState('');
  const [passwordLength, setPasswordLength] = useState(32);
  const [options, setOptions] = useState({
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [generationHistory, setGenerationHistory] = useState<string[]>([]);

  const generatePassword = useCallback(async () => {
    setIsGenerating(true);
    
    try {
      // Add some visual delay for the quantum effect
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newPassword = QuantumRNG.generatePassword(passwordLength, options);
      setPassword(newPassword);
      
      // Add to history
      setGenerationHistory(prev => [newPassword, ...prev.slice(0, 4)]);
      
      // Callback for parent component
      if (onPasswordGenerated) {
        onPasswordGenerated(newPassword);
      }
      
      toast.success('Quantum password generated!', {
        description: 'Your secure password is ready to use.',
      });
    } catch (error) {
      toast.error('Generation failed', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      setIsGenerating(false);
    }
  }, [passwordLength, options, onPasswordGenerated]);

  const handleCopy = async () => {
    if (!password) return;
    
    const success = await copyToClipboard(password);
    if (success) {
      toast.success('Copied to clipboard!');
    } else {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleOptionChange = (option: keyof typeof options) => {
    setOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const passwordStrength = password ? validatePasswordStrength(password) : null;

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
      case 'very-strong': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gray-900/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
          ⚛️ Quantum Password Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Password Length */}
        <div className="space-y-2">
          <Label htmlFor="password-length" className="text-gray-200">
            Password Length: {passwordLength} characters
          </Label>
          <Input
            id="password-length"
            type="range"
            min="8"
            max="128"
            value={passwordLength}
            onChange={(e) => setPasswordLength(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Character Options */}
        <div className="space-y-3">
          <Label className="text-gray-200 font-medium">Character Types</Label>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(options).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={key}
                  checked={value}
                  onCheckedChange={() => handleOptionChange(key as keyof typeof options)}
                />
                <Label htmlFor={key} className="text-sm text-gray-300">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-gray-700" />

        {/* Generate Button */}
        <Button
          onClick={generatePassword}
          disabled={isGenerating || Object.values(options).every(v => !v)}
          className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all duration-300 disabled:opacity-50"
        >
          {isGenerating ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating Quantum Password...
            </div>
          ) : (
            '🔮 Generate Quantum Password'
          )}
        </Button>

        {/* Password Display */}
        {password && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-gray-200">Generated Password</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-200"
                >
                  {showPassword ? '🙈 Hide' : '👁️ Show'}
                </Button>
              </div>
              <div className="relative">
                <Input
                  value={showPassword ? password : '•'.repeat(password.length)}
                  readOnly
                  className="bg-gray-800 border-gray-600 text-gray-200 font-mono text-sm pr-20"
                />
                <Button
                  onClick={handleCopy}
                  size="sm"
                  className="absolute right-1 top-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  📋 Copy
                </Button>
              </div>
            </div>

            {/* Password Strength */}
            {passwordStrength && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-200 text-sm">Password Strength</Label>
                  <Badge 
                    className={`${getStrengthColor(passwordStrength.strength)} text-white`}
                  >
                    {passwordStrength.strength.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength.strength)}`}
                    style={{ width: `${(passwordStrength.score / 7) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400">
                  Score: {passwordStrength.score}/7 • Length: {password.length} chars
                </div>
              </div>
            )}
          </div>
        )}

        {/* Generation History */}
        {generationHistory.length > 0 && (
          <div className="space-y-2">
            <Label className="text-gray-200 text-sm">Recent Generations</Label>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {generationHistory.map((historyPassword, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-800 rounded text-xs"
                >
                  <span className="text-gray-400 font-mono truncate flex-1 mr-2">
                    {showPassword ? historyPassword : '•'.repeat(historyPassword.length)}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(historyPassword)}
                    className="text-gray-400 hover:text-gray-200 p-1 h-auto"
                  >
                    📋
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}