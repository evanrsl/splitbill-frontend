// src/store/billStore.ts
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { BillState, OCRItem, Member, MemberTotal } from "@/types";

interface BillActions {
  setImageFile: (file: File | null) => void;
  setImageUrl: (url: string | null) => void;
  setOcrProcessingStatus: (status: BillState["ocrProcessingStatus"]) => void;
  setItems: (items: OCRItem[]) => void;
  addItem: (description: string, price: number) => void;
  updateItem: (id: string, updates: Partial<OCRItem>) => void;
  deleteItem: (id: string) => void;
  addMember: (name: string) => void;
  deleteMember: (id: string) => void;
  assignItem: (itemId: string, memberId: string | null) => void;
  getMemberTotals: () => MemberTotal[];
  resetBill: () => void;
}

const initialState: BillState = {
  imageFile: null,
  imageUrl: null,
  ocrProcessingStatus: "idle",
  items: [],
  members: [],
  assignments: {},
};

export const useBillStore = create<BillState & BillActions>((set, get) => ({
  ...initialState,

  setImageFile: (file) => set({ imageFile: file }),

  setImageUrl: (url) => set({ imageUrl: url }),

  setOcrProcessingStatus: (status) => set({ ocrProcessingStatus: status }),

  setItems: (items) => set({ items }),

  addItem: (description, price) => {
    const newItem: OCRItem = {
      id: uuidv4(),
      description,
      price,
    };
    set((state) => ({ items: [...state.items, newItem] }));
  },

  updateItem: (id, updates) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
  },

  deleteItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
      assignments: Object.fromEntries(
        Object.entries(state.assignments).filter(([itemId]) => itemId !== id)
      ),
    }));
  },

  addMember: (name) => {
    const newMember: Member = {
      id: uuidv4(),
      name,
    };
    set((state) => ({ members: [...state.members, newMember] }));
  },

  deleteMember: (id) => {
    set((state) => ({
      members: state.members.filter((member) => member.id !== id),
      assignments: Object.fromEntries(
        Object.entries(state.assignments).filter(
          ([_, memberId]) => memberId !== id
        )
      ),
    }));
  },

  assignItem: (itemId, memberId) => {
    set((state) => ({
      assignments: {
        ...state.assignments,
        [itemId]: memberId,
      },
    }));
  },

  getMemberTotals: () => {
    const { items, members, assignments } = get();

    return members.map((member) => {
      const assignedItems = items.filter(
        (item) => assignments[item.id] === member.id
      );

      const totalOwed = assignedItems.reduce(
        (sum, item) => sum + item.price,
        0
      );

      return {
        memberId: member.id,
        memberName: member.name,
        totalOwed,
        assignedItems,
      };
    });
  },

  resetBill: () => set(initialState),
}));
