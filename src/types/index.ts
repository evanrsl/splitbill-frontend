// src/types/index.ts
export interface OCRItem {
  id: string; // A unique ID generated on the client (e.g., UUID)
  description: string;
  price: number;
}

export interface Member {
  id: string; // A unique ID generated on the client
  name: string;
}

// The main state slice for the bill
export interface BillState {
  imageFile: File | null;
  imageUrl: string | null;
  ocrProcessingStatus: "idle" | "pending" | "success" | "error";
  items: OCRItem[];
  members: Member[];
  // Maps an item ID to a member ID. `null` means unassigned.
  assignments: Record<string, string | null>;
}

// A derived data structure for the final summary (calculated on-the-fly)
export interface MemberTotal {
  memberId: string;
  memberName: string;
  totalOwed: number;
  assignedItems: OCRItem[];
}

// API Response types
export interface OCRResponse {
  items: Array<{
    description: string;
    price: number;
  }>;
}

export interface APIErrorResponse {
  error: string;
  details?: string;
}
