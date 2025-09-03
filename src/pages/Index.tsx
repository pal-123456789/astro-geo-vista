import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import MobileApp from './MobileApp';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { 
  Globe2, 
  Shield, 
  Activity, 
  Zap, 
  Users,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-space-blue/10 via-background to-space-purple/10">
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

      <div className="relative z-10 p-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 space-y-8"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-4 bg-primary/20 rounded-full">
              <Globe2 className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-6xl font-bold text-gradient">TerraPulse</h1>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              NASA Anomaly Detection & Prediction System
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Protecting humanity through real-time monitoring of space anomalies, 
              solar events, and Earth observation data using advanced AI algorithms.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="w-full sm:w-auto"
              onClick={() => window.location.href = '/auth'}
            >
              <Shield className="w-5 h-5 mr-2" />
              Join TerraPulse
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <Activity className="w-5 h-5 mr-2" />
              View Live Demo
            </Button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 py-16"
        >
          <Card className="glass cosmic-glow">
            <CardContent className="p-6 text-center space-y-4">
              <div className="p-3 bg-space-green/20 rounded-full w-fit mx-auto">
                <Zap className="w-8 h-8 text-space-green" />
              </div>
              <h3 className="text-xl font-bold">Real-time Detection</h3>
              <p className="text-muted-foreground">
                Continuous monitoring of NASA data feeds for anomalies in solar activity, 
                magnetic storms, and near-Earth objects.
              </p>
            </CardContent>
          </Card>

          <Card className="glass cosmic-glow">
            <CardContent className="p-6 text-center space-y-4">
              <div className="p-3 bg-space-orange/20 rounded-full w-fit mx-auto">
                <Shield className="w-8 h-8 text-space-orange" />
              </div>
              <h3 className="text-xl font-bold">Critical Alerts</h3>
              <p className="text-muted-foreground">
                Instant notifications for critical events that could impact 
                satellite operations, power grids, or human safety.
              </p>
            </CardContent>
          </Card>

          <Card className="glass cosmic-glow">
            <CardContent className="p-6 text-center space-y-4">
              <div className="p-3 bg-space-blue/20 rounded-full w-fit mx-auto">
                <Activity className="w-8 h-8 text-space-blue" />
              </div>
              <h3 className="text-xl font-bold">Predictive Analysis</h3>
              <p className="text-muted-foreground">
                Advanced algorithms predict potential impacts and provide 
                mitigation strategies for detected anomalies.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto py-16 text-center space-y-8"
        >
          <h2 className="text-3xl font-bold">Why TerraPulse Matters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {[
              "Early warning system for space weather events",
              "Protection of critical infrastructure",
              "Support for mission planning and operations",
              "Scientific research and collaboration",
              "Public safety and awareness",
              "Global community engagement"
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-space-green flex-shrink-0" />
                <span>{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="max-w-2xl mx-auto text-center py-16 space-y-6"
        >
          <h2 className="text-3xl font-bold">Ready to Help Protect Humanity?</h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of researchers, scientists, and citizens monitoring our planet 
            and space environment in real-time.
          </p>
          <Button 
            size="lg" 
            className="w-full sm:w-auto"
            onClick={() => window.location.href = '/auth'}
          >
            <Users className="w-5 h-5 mr-2" />
            Get Started Now
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

const Index = () => {
  const { user } = useAuth();

  if (user) {
    return (
      <ProtectedRoute>
        <MobileApp />
      </ProtectedRoute>
    );
  }

  return <LandingPage />;
};

export default Index;
