-- Seed demo organization and data for testing
-- This creates a demo organization with sample cameras, detections, and alerts

-- Insert demo organization
INSERT INTO organizations (id, name, slug) 
VALUES ('00000000-0000-0000-0000-000000000001', 'Highway Safety Demo', 'demo')
ON CONFLICT (slug) DO NOTHING;

-- Insert demo cameras
INSERT INTO cameras (id, organization_id, name, location, latitude, longitude, status, highway, mile_marker) VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Camera Alpha-1', 'I-90 Westbound - Snoqualmie Pass', 47.4284, -121.4160, 'online', 'I-90', '52.3'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Camera Beta-2', 'I-90 Eastbound - Hyak', 47.3934, -121.3769, 'online', 'I-90', '54.8'),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Camera Gamma-3', 'US-2 Stevens Pass', 47.7453, -121.0890, 'online', 'US-2', '64.2'),
  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Camera Delta-4', 'I-5 Northbound - Tacoma', 47.2529, -122.4443, 'maintenance', 'I-5', '132.1'),
  ('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'Camera Echo-5', 'SR-520 Bridge', 47.6388, -122.2378, 'online', 'SR-520', '3.4'),
  ('10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 'Camera Foxtrot-6', 'I-405 Bellevue', 47.6101, -122.1875, 'offline', 'I-405', '12.7')
ON CONFLICT (id) DO NOTHING;

-- Insert sample detections (last 24 hours)
INSERT INTO detections (id, camera_id, organization_id, detection_type, confidence, detected_at) VALUES
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'deer', 0.94, NOW() - INTERVAL '2 hours'),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'deer', 0.87, NOW() - INTERVAL '4 hours'),
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'elk', 0.91, NOW() - INTERVAL '6 hours'),
  ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'debris', 0.78, NOW() - INTERVAL '8 hours'),
  ('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'deer', 0.96, NOW() - INTERVAL '30 minutes'),
  ('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'coyote', 0.82, NOW() - INTERVAL '12 hours'),
  ('20000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'bear', 0.89, NOW() - INTERVAL '18 hours'),
  ('20000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'vehicle_stopped', 0.95, NOW() - INTERVAL '1 hour')
ON CONFLICT (id) DO NOTHING;

-- Insert sample alerts
INSERT INTO alerts (id, detection_id, camera_id, organization_id, severity, status, title, description, created_at) VALUES
  ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'critical', 'active', 'Large Deer Detected on SR-520', 'High confidence deer detection near mile marker 3.4. Immediate attention recommended.', NOW() - INTERVAL '30 minutes'),
  ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'high', 'acknowledged', 'Deer Activity - Snoqualmie Pass', 'Multiple deer sightings in the past hour. Warning signs activated.', NOW() - INTERVAL '2 hours'),
  ('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'high', 'resolved', 'Elk Herd Crossing I-90', 'Elk herd of approximately 4 animals crossed safely.', NOW() - INTERVAL '6 hours'),
  ('30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'medium', 'active', 'Road Debris Detected', 'Object detected on roadway. Maintenance dispatch recommended.', NOW() - INTERVAL '8 hours'),
  ('30000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'low', 'active', 'Stopped Vehicle Alert', 'Vehicle appears to be stopped on shoulder.', NOW() - INTERVAL '1 hour')
ON CONFLICT (id) DO NOTHING;
