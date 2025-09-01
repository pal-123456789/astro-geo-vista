import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Mail, 
  Lock, 
  User, 
  Rocket,
  AlertTriangle,
  CheckCircle,
  Globe2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      let result;
      if (mode === 'signup') {
        result = await signUp(email, password, fullName);
        if (!result.error) {
          setMessage({
            type: 'success',
            text: 'Account created! Please check your email for verification.'
          });
        }
      } else {
        result = await signIn(email, password);
        if (!result.error) {
          navigate('/');
        }
      }

      if (result.error) {
        setMessage({
          type: 'error',
          text: result.error.message || 'Authentication failed'
        });
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'An unexpected error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-space-blue/10 via-background to-space-purple/10">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-space-blue/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-space-purple/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary/20 rounded-full">
              <Globe2 className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-gradient">TerraPulse</h1>
          </div>
          <p className="text-muted-foreground">
            NASA Anomaly Detection & Prediction System
          </p>
        </motion.div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass cosmic-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-space-green" />
                {mode === 'signin' ? 'Welcome Back' : 'Join TerraPulse'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {message && (
                <Alert className={message.type === 'error' ? 'border-destructive' : 'border-space-green'}>
                  {message.type === 'error' ? (
                    <AlertTriangle className="h-4 w-4" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>{message.text}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      required={mode === 'signup'}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    minLength={6}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Rocket className="w-4 h-4 mr-2" />
                    </motion.div>
                  ) : null}
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                </Button>
              </form>

              <Separator />

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}
                </p>
                <Button
                  variant="link"
                  onClick={() => {
                    setMode(mode === 'signin' ? 'signup' : 'signin');
                    setMessage(null);
                  }}
                  className="p-0 h-auto font-medium"
                >
                  {mode === 'signin' ? 'Sign up here' : 'Sign in here'}
                </Button>
              </div>

              {/* Features Preview */}
              <div className="space-y-3 pt-4 border-t">
                <h4 className="text-sm font-medium">Platform Features:</h4>
                <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-space-green rounded-full"></div>
                    Real-time NASA data monitoring
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-space-orange rounded-full"></div>
                    Critical anomaly alerts
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-space-blue rounded-full"></div>
                    Interactive global visualization
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;