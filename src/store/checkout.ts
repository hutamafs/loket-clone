import { create } from "zustand";

interface CheckoutState {
  quantity: number;
  setQuantity: (q: number) => void;
  attendee?: {
    name: string;
    email: string;
    phone: string;
    dob: string;
    gender?: string;
    idNumber: string;
  };
  setAttendee: (a: CheckoutState["attendee"]) => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  quantity: 0,
  setQuantity: (q) => set({ quantity: q }),
  setAttendee: (a) => set({ attendee: a }),
}));
