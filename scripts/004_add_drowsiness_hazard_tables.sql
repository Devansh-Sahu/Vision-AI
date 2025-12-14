-- Vision-AI Extended Schema
-- Adds drowsiness events and hazard detections tables

-- Drowsiness Events table (for driver alertness monitoring)
CREATE TABLE IF NOT EXISTS drowsiness_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  alertness_score DECIMAL(5, 2) NOT NULL CHECK (alertness_score >= 0 AND alertness_score <= 100),
  eye_aspect_ratio DECIMAL(5, 4),
  blink_frequency INTEGER,
  triggered_alert BOOLEAN DEFAULT false,
  alert_type TEXT CHECK (alert_type IN ('visual', 'audio', 'sms', 'call')),
  emergency_contact TEXT,
  session_id UUID,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hazard Detections table (expanded detection types for India roads)
CREATE TABLE IF NOT EXISTS hazard_detections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  object_class TEXT NOT NULL CHECK (object_class IN (
    'cow', 'dog', 'buffalo', 'goat', 'deer', 'elephant', 'camel',
    'pothole', 'fallen_tree', 'debris', 'landslide',
    'broken_vehicle', 'road_barrier', 'construction',
    'pedestrian', 'cyclist', 'wrong_way_vehicle',
    'black_spot', 'flooding', 'oil_spill', 'other'
  )),
  confidence DECIMAL(5, 4) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  severity_level TEXT NOT NULL CHECK (severity_level IN ('critical', 'high', 'medium', 'low')),
  bbox JSONB, -- {x, y, width, height}
  frame_source TEXT CHECK (frame_source IN ('upload', 'webcam', 'dashcam', 'rtsp')),
  frame_url TEXT,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  highway_name TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Emergency Contacts table
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  relationship TEXT,
  is_primary BOOLEAN DEFAULT false,
  notify_on_drowsiness BOOLEAN DEFAULT true,
  notify_on_hazard BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE drowsiness_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE hazard_detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for drowsiness_events
CREATE POLICY "Users can view their own drowsiness events" ON drowsiness_events
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own drowsiness events" ON drowsiness_events
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS Policies for hazard_detections
CREATE POLICY "Users can view their own hazard detections" ON hazard_detections
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own hazard detections" ON hazard_detections
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS Policies for emergency_contacts
CREATE POLICY "Users can manage their own emergency contacts" ON emergency_contacts
  FOR ALL USING (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_drowsiness_timestamp ON drowsiness_events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_drowsiness_alertness ON drowsiness_events(alertness_score);
CREATE INDEX IF NOT EXISTS idx_drowsiness_user ON drowsiness_events(user_id);

CREATE INDEX IF NOT EXISTS idx_hazard_timestamp ON hazard_detections(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_hazard_class_severity ON hazard_detections(object_class, severity_level);
CREATE INDEX IF NOT EXISTS idx_hazard_user ON hazard_detections(user_id);

CREATE INDEX IF NOT EXISTS idx_emergency_user ON emergency_contacts(user_id);
