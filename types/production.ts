import { Production } from "./mongodbSchema";

export interface ProductionWithStatus extends Production {
  status: "In Production" | "Pre-Production" | "Development" | "Completed";
}
