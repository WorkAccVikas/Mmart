import type { BROKERS } from "../constants/constants";

export interface ILookupItem {
  code: string;
  name: string;
}

// ============================================================= BROKER =============================================
export type TBrokerRegistry = typeof BROKERS;

export type TBrokerID = keyof TBrokerRegistry;

export type TBrokerConfig = TBrokerRegistry[TBrokerID];

export type TBrokerCode = TBrokerConfig["code"];

export type TBrokerName = TBrokerConfig["name"];

// ============================================================= BROKER SEGMENT =============================================
export type TBrokerSegment = "B2B" | "B2C" | "NTB";

// ============================================================= STAGE =============================================
export type TStage = "DEV" | "PRE_PROD" | "PROD";

// ============================================================= LEVEL =============================================
export type TLevel = "FRONTEND" | "BACKEND";

// =============================================================   =============================================
// =============================================================   =============================================
