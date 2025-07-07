export interface OCRItem {
  id: string;
  description: string;
  price: number;
}

export interface Member {
  id: string;
  name: string;
}

export interface BillState {
  imageFile: File | null;
  imageUrl: string | null;
  ocrProcessingStatus: 'idle' | 'pending' | 'success' | 'error';
  items: OCRItem[];
  members: Member[];
  assignments: Record<string, string | null>;
  currentStep: number;
  error: string | null;
}

export interface MemberTotal {
  memberId: string;
  memberName: string;
  totalOwed: number;
  assignedItems: OCRItem[];
}