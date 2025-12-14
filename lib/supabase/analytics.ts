import { createClient } from "./client"
import type { HazardDetection } from "@/lib/types"

const supabase = createClient()

async function getUserId(): Promise<string | null> {
  try {
    const { data, error } = await supabase.auth.getUser()
    if (error) {
      // Suppress "Auth session missing!" error which is expected for anon users
      if (!error.message.includes("Auth session missing")) {
        console.error("Supabase getUser error", error)
      }
      return null
    }
    return data.user?.id ?? null
  } catch (err) {
    return null
  }
}

export async function logDrowsinessEvent(args: {
  alertnessScore: number
  ear: number
  blinkFrequency: number
  triggeredAlert: boolean
  sessionId: string | null
}) {
  const userId = await getUserId()
  if (!userId) return

  const { error } = await supabase.from("drowsiness_events").insert({
    user_id: userId,
    organization_id: null,
    alertness_score: args.alertnessScore,
    eye_aspect_ratio: args.ear,
    blink_frequency: args.blinkFrequency,
    triggered_alert: args.triggeredAlert,
    alert_type: null,
    emergency_contact: null,
    session_id: args.sessionId,
  })

  if (error) console.error("logDrowsinessEvent error", error)
}

export async function logHazardEvents(hazards: HazardDetection[], sessionId: string | null) {
  if (!hazards.length) return

  const userId = await getUserId()
  if (!userId) return

  const rows = hazards.map((h) => ({
    user_id: userId,
    organization_id: null,
    object_class: h.objectClass,
    confidence: h.confidence,
    severity_level: h.severity,
    bbox: h.bbox,
    frame_source: "webcam",
    frame_url: null,
    location_lat: null,
    location_lng: null,
    highway_name: null,
    session_id: sessionId,
  }))

  const { error } = await supabase.from("hazard_detections").insert(rows)
  if (error) console.error("logHazardEvents error", error)
}

// ---------------- VASE session lifecycle ----------------

export async function startVaseSession(): Promise<string | null> {
  const userId = await getUserId()
  if (!userId) return null

  const { data, error } = await supabase
    .from("vase_sessions")
    .insert({
      user_id: userId,
      organization_id: null,
      start_time: new Date().toISOString(),
      total_alerts: 0,
      hazards_detected: 0,
      emergency_contact_notified: false,
    })
    .select("id")
    .single()

  if (error) {
    console.error("startVaseSession error", error)
    return null
  }

  return data?.id ?? null
}

export async function endVaseSession(args: {
  sessionId: string
  startTime: Date | null
  totalAlerts: number
  averageAlertness: number | null
  hazardsDetected: number
  emergencyContactNotified: boolean
}) {
  if (!args.sessionId) return

  const end = new Date()
  const durationSeconds = args.startTime ? Math.round((end.getTime() - args.startTime.getTime()) / 1000) : null

  const { error } = await supabase
    .from("vase_sessions")
    .update({
      end_time: end.toISOString(),
      duration_seconds: durationSeconds,
      total_alerts: args.totalAlerts,
      average_alertness: args.averageAlertness,
      hazards_detected: args.hazardsDetected,
      emergency_contact_notified: args.emergencyContactNotified,
    })
    .eq("id", args.sessionId)

  if (error) console.error("endVaseSession error", error)
}

// Log a high-level VASE alert into the alerts table so it appears in Recent Alerts.
export async function logVaseAlert(args: {
  sessionId: string | null
  severity: "critical" | "high" | "medium" | "low"
  title: string
  description: string | null
}) {
  try {
    if (!supabase) {
      console.warn('Supabase client not initialized');
      return;
    }

    // Only log in production or if explicitly enabled in development
    if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_ENABLE_ANALYTICS_LOGGING) {
      console.log('VASE Alert (not logged in development):', args.title);
      return;
    }

    const { error } = await supabase
      .from("alerts")
      .insert({
        detection_id: null,
        camera_id: null,
        organization_id: null,
        severity: args.severity,
        status: "active",
        title: args.title,
        description: args.description,
        session_id: args.sessionId,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Failed to log VASE alert:', {
        error,
        alertData: args,
        timestamp: new Date().toISOString()
      });
    } else {
      console.log('VASE alert logged successfully:', args.title);
    }
  } catch (err) {
    console.error('Unexpected error in logVaseAlert:', {
      error: err,
      alertData: args,
      timestamp: new Date().toISOString()
    });
  }
}


// ---------------- Emergency Contact Persistence ----------------

export async function saveEmergencyContact(email: string) {
  const userId = await getUserId();
  if (!userId) {
    console.warn("Cannot save contact: No user logged in");
    return null;
  }

  // Upsert into emergency_contacts table
  // Assuming table structure matches interface roughly or user provided it
  // We try to update if exists for this user, or insert.
  // Since we don't have exact PK knowledge, we assume user_id is unique or we use a query to find existing.

  // Strategy: Delete old, Insert new (simplest for single contact enforcement)
  // Or better: UPSERT based on user_id if that's a constraint.

  // Let's try explicit upsert logic if we had a constraint, but here we'll just try to INSERT and handle error?
  // User said "hook it wuth supabase databse we are using before".

  // We will look for an existing contact first.
  const { data: existing } = await supabase
    .from("emergency_contacts")
    .select("id")
    .eq("user_id", userId)
    .limit(1)
    .single();

  let error;

  if (existing) {
    const res = await supabase
      .from("emergency_contacts")
      .update({
        name: "VASE Emergency Contact",
        phone: email, // MAPPING EMAIL TO PHONE COLUMN (Schema adaptation)
        updated_at: new Date().toISOString()
      })
      .eq("id", existing.id);
    error = res.error;
  } else {
    const res = await supabase
      .from("emergency_contacts")
      .insert({
        user_id: userId,
        name: "VASE Emergency Contact",
        phone: email, // MAPPING EMAIL TO PHONE COLUMN
        is_primary: true,
        notify_on_hazard: true,
        notify_on_drowsiness: true
      });
    error = res.error;
  }

  if (error) {
    console.error("saveEmergencyContact error details:", JSON.stringify(error, null, 2));
    throw new Error(`Supabase Error: ${error.message || JSON.stringify(error)}`);
  }
  return true;
}

export async function getEmergencyContact() {
  const userId = await getUserId();
  if (!userId) return null;

  const { data, error } = await supabase
    .from("emergency_contacts")
    .select("*")
    .eq("user_id", userId)
    .limit(1)
    .single();

  if (error) {
    // Ignore "Row not found" errors
    if (error.code !== 'PGRST116') {
      console.error("getEmergencyContact error", error);
    }
    return null;
  }

  // Retrieve email from phone column
  return (data as any).phone || null;
}
