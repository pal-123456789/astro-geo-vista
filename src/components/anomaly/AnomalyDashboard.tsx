import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  Shield, 
  Activity, 
  Satellite,
  Globe2,
  Zap,
  Target,
  Bell,
  TrendingUp,
  Clock,
  MapPin,
  BarChart3,
  Users,
  Share2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  FacebookShareButton, 
  TwitterShareButton, 
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon
} from 'react-share';

interface AnomalyData {
  id: string;
  anomaly_type: string;
  severity: string;
  confidence_score: number;
  detection_time: string;
  predicted_impact_time?: string;
  nasa_source: string;
  analysis_results: any;
  status: string;
  affected_regions?: string[];
}

interface RealTimeData {
  id: string;
  feed_type: string;
  timestamp: string;
  anomaly_score: number;
  processed_data: any;
}

const AnomalyDashboard = () => {
  const [anomalies, setAnomalies] = useState<AnomalyData[]>([]);
  const [realTimeData, setRealTimeData] = useState<RealTimeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();
  const { toast } = useToast();

  const shareUrl = window.location.href;
  const shareTitle = "TerraPulse - NASA Anomaly Detection System";
  const shareDescription = "Real-time monitoring of space anomalies and Earth observation data to protect humanity.";

  useEffect(() => {
    fetchAnomalies();
    fetchRealTimeData();
    setupRealTimeSubscription();
  }, []);

  const fetchAnomalies = async () => {
    try {
      const { data, error } = await supabase
        .from('anomaly_detections')
        .select('*')
        .eq('status', 'active')
        .order('detection_time', { ascending: false })
        .limit(10);

      if (error) throw error;
      setAnomalies(data || []);
    } catch (error) {
      console.error('Error fetching anomalies:', error);
      toast({
        title: "Data Fetch Error",
        description: "Unable to load anomaly data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRealTimeData = async () => {
    try {
      const { data, error } = await supabase
        .from('real_time_feeds')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(20);

      if (error) throw error;
      setRealTimeData(data || []);
    } catch (error) {
      console.error('Error fetching real-time data:', error);
    }
  };

  const setupRealTimeSubscription = () => {
    const channel = supabase
      .channel('anomaly-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'anomaly_detections'
        },
        (payload) => {
          const newAnomaly = payload.new as AnomalyData;
          setAnomalies(prev => [newAnomaly, ...prev.slice(0, 9)]);
          
          if (newAnomaly.severity === 'critical') {
            toast({
              title: "🚨 Critical Anomaly Detected!",
              description: `${newAnomaly.anomaly_type} detected with ${Math.round(newAnomaly.confidence_score * 100)}% confidence`,
              variant: "destructive"
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'real_time_feeds'
        },
        (payload) => {
          const newData = payload.new as RealTimeData;
          setRealTimeData(prev => [newData, ...prev.slice(0, 19)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'moderate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getAnomalyIcon = (type: string) => {
    switch (type) {
      case 'solar_flare': return <Zap className="w-4 h-4" />;
      case 'magnetic_storm': return <Activity className="w-4 h-4" />;
      case 'asteroid_approach': return <Target className="w-4 h-4" />;
      case 'space_debris': return <Satellite className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const criticalAnomalies = anomalies.filter(a => a.severity === 'critical').length;
  const highAnomalies = anomalies.filter(a => a.severity === 'high').length;
  const activeFeeds = realTimeData.length;
  const avgConfidence = anomalies.length > 0 
    ? Math.round(anomalies.reduce((sum, a) => sum + a.confidence_score, 0) / anomalies.length * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-gradient flex items-center gap-3">
            <Shield className="w-10 h-10 text-space-green" />
            TerraPulse
          </h1>
          <p className="text-muted-foreground mt-2">
            Real-time NASA anomaly detection protecting humanity
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Social Sharing */}
          <div className="flex gap-2">
            <FacebookShareButton url={shareUrl} hashtag="#TerraPulse">
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <TwitterShareButton url={shareUrl} title={shareTitle}>
              <TwitterIcon size={32} round />
            </TwitterShareButton>
            <LinkedinShareButton url={shareUrl} title={shareTitle} summary={shareDescription}>
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>
            <WhatsappShareButton url={shareUrl} title={shareTitle}>
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
          </div>
          
          <Badge variant="secondary" className="animate-pulse-glow">
            <Activity className="w-4 h-4 mr-2" />
            Live Monitoring
          </Badge>
        </div>
      </motion.div>

      {/* Critical Alert Banner */}
      <AnimatePresence>
        {criticalAnomalies > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Alert className="border-red-500/50 bg-red-500/10">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-400">
                <strong>{criticalAnomalies} Critical Anomal{criticalAnomalies === 1 ? 'y' : 'ies'} Detected!</strong>
                {' '}Immediate attention required for potential threat assessment.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass cosmic-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critical</p>
                  <p className="text-3xl font-bold text-red-400">{criticalAnomalies}</p>
                </div>
                <div className="p-3 bg-red-500/20 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass cosmic-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">High Priority</p>
                  <p className="text-3xl font-bold text-orange-400">{highAnomalies}</p>
                </div>
                <div className="p-3 bg-orange-500/20 rounded-full">
                  <TrendingUp className="w-6 h-6 text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass cosmic-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Feeds</p>
                  <p className="text-3xl font-bold text-space-green">{activeFeeds}</p>
                </div>
                <div className="p-3 bg-space-green/20 rounded-full">
                  <Activity className="w-6 h-6 text-space-green" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass cosmic-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Confidence</p>
                  <p className="text-3xl font-bold text-space-blue">{avgConfidence}%</p>
                </div>
                <div className="p-3 bg-space-blue/20 rounded-full">
                  <BarChart3 className="w-6 h-6 text-space-blue" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="glass">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Globe2 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="anomalies" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Anomalies
          </TabsTrigger>
          <TabsTrigger value="realtime" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Real-time Data
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Anomalies */}
            <Card className="glass cosmic-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-space-orange" />
                  Recent Anomalies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {anomalies.slice(0, 5).map((anomaly, index) => (
                    <motion.div
                      key={anomaly.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-card/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-full">
                          {getAnomalyIcon(anomaly.anomaly_type)}
                        </div>
                        <div>
                          <p className="font-medium">{anomaly.anomaly_type.replace('_', ' ')}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(anomaly.detection_time).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge className={getSeverityColor(anomaly.severity)}>
                        {anomaly.severity}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Data Sources Status */}
            <Card className="glass cosmic-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Satellite className="w-5 h-5 text-space-blue" />
                  Data Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['NEO Feed', 'Solar Wind', 'Magnetometer', 'GOES X-Ray', 'ACE Mag'].map((source, index) => (
                    <motion.div
                      key={source}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-space-green rounded-full animate-pulse"></div>
                        <span className="text-sm">{source}</span>
                      </div>
                      <Badge variant="secondary">Online</Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="anomalies">
          <Card className="glass cosmic-glow">
            <CardHeader>
              <CardTitle>Detected Anomalies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {anomalies.map((anomaly, index) => (
                  <motion.div
                    key={anomaly.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border rounded-lg space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getAnomalyIcon(anomaly.anomaly_type)}
                        <h4 className="font-semibold">{anomaly.anomaly_type.replace('_', ' ')}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getSeverityColor(anomaly.severity)}>
                          {anomaly.severity}
                        </Badge>
                        <Badge variant="outline">
                          {Math.round(anomaly.confidence_score * 100)}% confidence
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {new Date(anomaly.detection_time).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Satellite className="w-4 h-4" />
                        {anomaly.nasa_source}
                      </div>
                    </div>
                    {anomaly.affected_regions && anomaly.affected_regions.length > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Affected regions:</span>
                        <span>{anomaly.affected_regions.join(', ')}</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="realtime">
          <Card className="glass cosmic-glow">
            <CardHeader>
              <CardTitle>Real-time Data Feeds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {realTimeData.map((data, index) => (
                  <motion.div
                    key={data.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 bg-card/30 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-space-green rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">{data.feed_type.toUpperCase()}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(data.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Score: {data.anomaly_score.toFixed(2)}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass cosmic-glow">
              <CardHeader>
                <CardTitle>Detection Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Analytics dashboard coming soon</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass cosmic-glow">
              <CardHeader>
                <CardTitle>Global Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Globe2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Interactive map visualization coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnomalyDashboard;