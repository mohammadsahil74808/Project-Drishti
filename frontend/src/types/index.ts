/**
 * SentinelX AI — Shared TypeScript Types
 * Mirrors backend Pydantic schemas. Kept in sync manually for now.
 */

// ============================================================
// AUTH / USERS
// ============================================================

export type UserRole =
  | "constable"
  | "sho"
  | "sp"
  | "commissioner"
  | "analyst";

export interface User {
  id: string;
  name: string;
  badge_no: string;
  role: UserRole;
  station_id?: string;
  station_name?: string;
  district_name?: string;
  avatar_url?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface LoginRequest {
  badge_no: string;
  password: string;
}

export interface LoginResponse extends AuthTokens {
  user: User;
}

// ============================================================
// CRIME / FIR
// ============================================================

export type CrimeType =
  | "theft"
  | "chain_snatching"
  | "burglary"
  | "assault"
  | "vehicle_theft"
  | "cybercrime"
  | "missing_person"
  | "robbery"
  | "other";

export type CaseStatus = "open" | "investigation" | "chargesheet" | "closed";

export interface FIRRecord {
  id: string;
  fir_no: string;
  station_name: string;
  district_name: string;
  crime_type: CrimeType;
  ipc_sections: string[];
  incident_datetime: string;
  reported_datetime: string;
  lat: number;
  lng: number;
  address_text: string;
  mo_description: string;
  status: CaseStatus;
  weapon_used?: string;
}

// ============================================================
// GEO / HOTSPOTS
// ============================================================

export type SeverityLevel = "low" | "medium" | "high" | "critical";

export interface Hotspot {
  id: string;
  district_id: string;
  lat: number;
  lng: number;
  radius_m: number;
  crime_density: number;
  severity: SeverityLevel;
  time_window: string;
}

export interface HeatmapPoint {
  lat: number;
  lng: number;
  weight: number;
  crime_type: CrimeType;
}

// ============================================================
// FORECASTING
// ============================================================

export interface ForecastPoint {
  date: string;
  predicted_count: number;
  lower_bound: number;
  upper_bound: number;
  actual_count?: number;
}

export interface ForecastSeries {
  district_id: string;
  crime_type: CrimeType;
  points: ForecastPoint[];
  model_version: string;
  generated_at: string;
}

// ============================================================
// RISK SCORING / EXPLAINABILITY
// ============================================================

export interface ShapFeatureContribution {
  feature: string;
  contribution: number;
  value: string | number;
}

export interface RiskScore {
  id: string;
  entity_type: "zone" | "person";
  entity_label: string;
  score: number; // 0-100
  severity: SeverityLevel;
  shap_explanation: ShapFeatureContribution[];
  computed_at: string;
}

// ============================================================
// CRIMINAL NETWORK
// ============================================================

export interface NetworkNode {
  id: string;
  label: string;
  risk_score: number;
  centrality: number;
  case_count: number;
}

export interface NetworkEdge {
  source: string;
  target: string;
  relation_type: string;
  weight: number;
}

export interface CriminalNetworkGraph {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
}

// ============================================================
// MISSING PERSONS
// ============================================================

export type MissingPersonStatus =
  | "reported"
  | "active_search"
  | "matched"
  | "closed";

export interface MissingPerson {
  id: string;
  name_hash: string;
  age: number;
  last_seen_location: string;
  last_seen_date: string;
  status: MissingPersonStatus;
}

// ============================================================
// VEHICLE CRIME
// ============================================================

export interface VehicleCrimeRecord {
  id: string;
  vehicle_type: string;
  theft_location: string;
  recovery_location?: string;
  status: "stolen" | "recovered" | "under_investigation";
  theft_date: string;
}

// ============================================================
// ALERTS
// ============================================================

export type AlertType =
  | "anomaly"
  | "forecast_spike"
  | "new_hotspot"
  | "missing_person_match";

export interface AlertItem {
  id: string;
  type: AlertType;
  message: string;
  severity: SeverityLevel;
  created_at: string;
  acknowledged: boolean;
}

// ============================================================
// AI ASSISTANT
// ============================================================

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
  chart_payload?: unknown;
}

// ============================================================
// REPORTS
// ============================================================

export type ReportType = "weekly" | "hotspot" | "case";

export interface ReportRequest {
  type: ReportType;
  district_name?: string;
  date_from?: string;
  date_to?: string;
}

export interface ReportItem {
  id: string;
  type: ReportType;
  title: string;
  generated_at: string;
  download_url: string;
}
