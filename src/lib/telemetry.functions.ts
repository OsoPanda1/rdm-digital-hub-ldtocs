export async function getTelemetryPulses(): Promise<Array<{ id: string; federation: string; pulse_type: string; value: number; created_at: string }>> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server")
    const { data, error } = await supabaseAdmin
      .from("telemetry_pulses")
      .select("id, federation, pulse_type, value, created_at")
      .order("created_at", { ascending: false })
      .limit(50)
    if (error) return []
    return data ?? []
  } catch {
    return []
  }
}
