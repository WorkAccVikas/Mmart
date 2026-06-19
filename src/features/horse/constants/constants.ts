import type { ILookupItem } from "../types/Basic";

export const BROKERS = {
  AU: {
    code: "AU",
    name: "AU BANK",
  },
  HERO: {
    code: "HERO",
    name: "HERO Insurance",
  },
  KARO: {
    code: "KARO",
    name: "KARO Insurance",
  },
  BAJAJ: {
    code: "BAJAJ",
    name: "BAJAJ Insurance",
  },
  JAINAM: {
    code: "JAINAM",
    name: "JAINAM Insurance",
  },
  EDME: {
    code: "EDME",
    name: "EDME Insurance",
  },
  ACE: {
    code: "ACE",
    name: "ACE Insurance",
  },
  IPPB: {
    code: "IPPB",
    name: "IPPB Insurance",
  },
  KMD : {
    code: "KMD",
    name: "KM Dastur Insurance",
  }

} as const satisfies Record<string, ILookupItem>;
