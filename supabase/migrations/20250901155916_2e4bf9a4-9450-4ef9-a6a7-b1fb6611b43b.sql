-- Create user authentication and profiles enhancements
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS alert_preferences jsonb DEFAULT '{"critical": true, "moderate": true, "low": false, "sms": false, "email": true, "push": true}'::jsonb,
ADD COLUMN IF NOT EXISTS dashboard_config jsonb DEFAULT '{"theme": "dark", "auto_refresh": 30, "favorite_locations": []}'::jsonb,
ADD COLUMN IF NOT EXISTS subscription_tier text DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'premium', 'enterprise'));

-- Create anomaly detection tables
CREATE TABLE IF NOT EXISTS public.anomaly_detections (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  anomaly_type text NOT NULL CHECK (anomaly_type IN ('solar_flare', 'magnetic_storm', 'asteroid_approach', 'space_debris', 'satellite_malfunction', 'cosmic_radiation', 'earth_observation_anomaly')),
  severity text NOT NULL CHECK (severity IN ('critical', 'high', 'moderate', 'low')),
  confidence_score numeric(3,2) NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
  location point,
  latitude numeric,
  longitude numeric,
  altitude numeric,
  detection_time timestamp with time zone NOT NULL DEFAULT now(),
  predicted_impact_time timestamp with time zone,
  duration_estimate interval,
  nasa_source text NOT NULL,
  raw_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  analysis_results jsonb NOT NULL DEFAULT '{}'::jsonb,
  mitigation_suggestions jsonb DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'false_positive', 'monitoring')),
  affected_regions text[],
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create real-time data feeds table
CREATE TABLE IF NOT EXISTS public.real_time_feeds (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  feed_type text NOT NULL CHECK (feed_type IN ('neo', 'solar_wind', 'magnetometer', 'goes_xray', 'ace_mag', 'dscovr_mag')),
  data_source text NOT NULL,
  timestamp timestamp with time zone NOT NULL,
  raw_data jsonb NOT NULL,
  processed_data jsonb DEFAULT '{}'::jsonb,
  anomaly_score numeric(3,2) DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create user notifications table
CREATE TABLE IF NOT EXISTS public.user_notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  anomaly_id uuid REFERENCES public.anomaly_detections(id) ON DELETE SET NULL,
  notification_type text NOT NULL CHECK (notification_type IN ('email', 'push', 'sms', 'dashboard')),
  title text NOT NULL,
  message text NOT NULL,
  priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('critical', 'high', 'normal', 'low')),
  sent_at timestamp with time zone,
  read_at timestamp with time zone,
  delivery_status text DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'sent', 'delivered', 'failed')),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.anomaly_detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_time_feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for anomaly_detections (public read, admin write)
CREATE POLICY "Anomaly detections are viewable by everyone" 
  ON public.anomaly_detections FOR SELECT 
  USING (true);

CREATE POLICY "Only admins can insert anomaly detections" 
  ON public.anomaly_detections FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Only admins can update anomaly detections" 
  ON public.anomaly_detections FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- Create RLS policies for real_time_feeds (public read)
CREATE POLICY "Real-time feeds are viewable by everyone" 
  ON public.real_time_feeds FOR SELECT 
  USING (true);

-- Create RLS policies for user_notifications (user-specific)
CREATE POLICY "Users can view their own notifications" 
  ON public.user_notifications FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
  ON public.user_notifications FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_anomaly_detections_type_severity ON public.anomaly_detections(anomaly_type, severity);
CREATE INDEX IF NOT EXISTS idx_anomaly_detections_location ON public.anomaly_detections USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_anomaly_detections_time ON public.anomaly_detections(detection_time DESC);
CREATE INDEX IF NOT EXISTS idx_real_time_feeds_type_time ON public.real_time_feeds(feed_type, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_read ON public.user_notifications(user_id, read_at);

-- Create triggers for updated_at
CREATE TRIGGER update_anomaly_detections_updated_at
  BEFORE UPDATE ON public.anomaly_detections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for live updates
ALTER TABLE public.anomaly_detections REPLICA IDENTITY FULL;
ALTER TABLE public.real_time_feeds REPLICA IDENTITY FULL;
ALTER TABLE public.user_notifications REPLICA IDENTITY FULL;

-- Add tables to realtime publication
INSERT INTO supabase_realtime.publication (
  name, tables
) VALUES (
  'anomaly_realtime', 
  ARRAY['anomaly_detections', 'real_time_feeds', 'user_notifications']
) ON CONFLICT (name) DO UPDATE SET 
  tables = EXCLUDED.tables;