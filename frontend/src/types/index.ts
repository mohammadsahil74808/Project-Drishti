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
  badgeNo: string;
  role: UserRole;
  stationId?: string;
  stationName?: string;
  districtName?: string;
  avatarUrl?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  badgeNo: string;
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
  firNo: string;
  stationName: string;
  districtName: string;
  crimeType: CrimeType;
  ipcSections: string[];
  incidentDatetime: string;
  reportedDatetime: string;
  lat: number;
  lng: number;
  addressText: string;
  moDescription: string;
  status: CaseStatus;
  weaponUsed?: string;
}

// ============================================================
// GEO / HOTSPOTS
// ============================================================

export type SeverityLevel = "low" | "medium" | "high" | "critical";

export interface Hotspot {
  id: string;
  districtName: string;
  lat: number;
  lng: number;
  radiusM: number;
  crimeDensity: number;
  severity: SeverityLevel;
  timeWindow: string;
}

export interface HeatmapPoint {
  lat: number;
  lng: number;
  weight: number;
  crimeType: CrimeType;
}

// ============================================================
// FORECASTING
// ============================================================

export interface ForecastPoint {
  date: string;
  predictedCount: number;
  lowerBound: number;
  upperBound: number;
  actualCount?: number;
}

export interface ForecastSeries {
  districtName: string;
  crimeType: CrimeType;
  points: ForecastPoint[];
  modelVersion: string;
  generatedAt: string;
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
  entityType: "zone" | "person";
  entityLabel: string;
  score: number; // 0-100
  severity: SeverityLevel;
  shapExplanation: ShapFeatureContribution[];
  computedAt: string;
}

// ============================================================
// CRIMINAL NETWORK
// ============================================================

export interface NetworkNode {
  id: string;
  label: string;
  riskScore: number;
  centrality: number;
  caseCount: number;
}

export interface NetworkEdge {
  source: string;
  target: string;
  relationType: string;
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
  nameHash: string;
  age: number;
  lastSeenLocation: string;
  lastSeenDate: string;
  status: MissingPersonStatus;
}

// ============================================================
// VEHICLE CRIME
// ============================================================

export interface VehicleCrimeRecord {
  id: string;
  vehicleType: string;
  theftLocation: string;
  recoveryLocation?: string;
  status: "stolen" | "recovered" | "under_investigation";
  theftDate: string;
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
  createdAt: string;
  acknowledged: boolean;
}

// ============================================================
// AI ASSISTANT
// ============================================================

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  chartPayload?: unknown;
}

// ============================================================
// REPORTS
// ============================================================

export type ReportType = "weekly" | "hotspot" | "case";

export interface ReportRequest {
  type: ReportType;
  districtName?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ReportItem {
  id: string;
  type: ReportType;
  title: string;
  generatedAt: string;
  downloadUrl: string;
}
