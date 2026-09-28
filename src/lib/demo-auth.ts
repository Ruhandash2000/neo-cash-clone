import type { Role } from "./neo-cash-store";

export type DemoAccountRole = Role | "demo_controller";

export interface DemoAccount {
  id: string;
  userId: string;
  email: string;
  fullName: string;
  role: DemoAccountRole;
  institutionId: string;
  institutionName: string;
  isDemoUser: true;
}

const institutionId = "d4b486a6-b9bb-4a2d-bdd1-e3a5a1908001";

/** Demo identity seed metadata. Credentials are stored only in Supabase Auth. */
export const DEMO_ACCOUNTS: readonly DemoAccount[] = [
  { id: "b1e102c9-97b3-4a85-b2fe-d3fa7d43a001", userId: "DEMO-CTRL-001", email: "demo@newyorkasia.ai", fullName: "NewCash AI Demo Controller", role: "demo_controller", institutionId, institutionName: "Dhaka City College", isDemoUser: true },
  { id: "b1e102c9-97b3-4a85-b2fe-d3fa7d43a101", userId: "STD-FARIYA-001", email: "fariya@neocash.ai", fullName: "Fariya", role: "student", institutionId, institutionName: "Dhaka City College", isDemoUser: true },
  { id: "b1e102c9-97b3-4a85-b2fe-d3fa7d43a102", userId: "STD-ROHAN-001", email: "rohan@neocash.ai", fullName: "Rohan", role: "student", institutionId, institutionName: "Dhaka City College", isDemoUser: true },
  { id: "b1e102c9-97b3-4a85-b2fe-d3fa7d43a103", userId: "STD-FARHAN-001", email: "farhan@neocash.ai", fullName: "Farhan", role: "student", institutionId, institutionName: "Dhaka City College", isDemoUser: true },
  { id: "b1e102c9-97b3-4a85-b2fe-d3fa7d43a104", userId: "STD-SEHARI-001", email: "sehari@neocash.ai", fullName: "Sehari", role: "student", institutionId, institutionName: "Dhaka City College", isDemoUser: true },
  { id: "b1e102c9-97b3-4a85-b2fe-d3fa7d43a105", userId: "STD-TAJIM-001", email: "tajim@neocash.ai", fullName: "Tajim", role: "student", institutionId, institutionName: "Dhaka City College", isDemoUser: true },
  { id: "b1e102c9-97b3-4a85-b2fe-d3fa7d43a106", userId: "STD-NUSRAT-001", email: "nusrat@neocash.ai", fullName: "Nusrat", role: "student", institutionId, institutionName: "Dhaka City College", isDemoUser: true },
  { id: "b1e102c9-97b3-4a85-b2fe-d3fa7d43a107", userId: "STD-ANIKA-001", email: "anika@neocash.ai", fullName: "Anika", role: "student", institutionId, institutionName: "Dhaka City College", isDemoUser: true },
  { id: "b1e102c9-97b3-4a85-b2fe-d3fa7d43a201", userId: "ADM-RAFAT-001", email: "rafat@neocash.ai", fullName: "Rafat", role: "admin", institutionId, institutionName: "Dhaka City College", isDemoUser: true },
  { id: "b1e102c9-97b3-4a85-b2fe-d3fa7d43a202", userId: "ADM-SAYED-001", email: "sayed@neocash.ai", fullName: "Dr. Sayed", role: "admin", institutionId, institutionName: "Dhaka City College", isDemoUser: true },
  { id: "b1e102c9-97b3-4a85-b2fe-d3fa7d43a301", userId: "HEAD-KAMAL-001", email: "kamal@neocash.ai", fullName: "MD Kamal", role: "head", institutionId, institutionName: "Dhaka City College", isDemoUser: true },
];

/** Demo-only passwords used exclusively to exchange the controller session for
 * a real Supabase Auth session. They are never persisted to the database. */
export const DEMO_ACCOUNT_PASSWORDS: Readonly<Record<string, string>> = {
  "b1e102c9-97b3-4a85-b2fe-d3fa7d43a101": "Fariya@2026",
  "b1e102c9-97b3-4a85-b2fe-d3fa7d43a102": "Rohan@2026",
  "b1e102c9-97b3-4a85-b2fe-d3fa7d43a103": "Farhan@2026",
  "b1e102c9-97b3-4a85-b2fe-d3fa7d43a104": "Sehari@2026",
  "b1e102c9-97b3-4a85-b2fe-d3fa7d43a105": "Tajim@2026",
  "b1e102c9-97b3-4a85-b2fe-d3fa7d43a106": "Nusrat@2026",
  "b1e102c9-97b3-4a85-b2fe-d3fa7d43a107": "Anika@2026",
  "b1e102c9-97b3-4a85-b2fe-d3fa7d43a201": "Rafat@2026",
  "b1e102c9-97b3-4a85-b2fe-d3fa7d43a202": "Sayed@2026",
  "b1e102c9-97b3-4a85-b2fe-d3fa7d43a301": "Kamal@2026",
};
