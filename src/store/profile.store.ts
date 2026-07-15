import { create } from "zustand";
import type { User } from "@/entities/user";

interface CurrentProfileState {
  profile: User | null;
  starsBalance: number;
  defaultDonateAmount: number;
  setProfile: (profile: User) => void;
  setStarsBalance: (balance: number) => void;
  setDefaultDonateAmount: (amount: number) => void;
  clearAll: () => void;
}

export const useCurrentProfileStore = create<CurrentProfileState>()((set) => ({
  profile: null,
  starsBalance: 0,
  defaultDonateAmount: 5,
  setProfile: (profile) => set({ profile }),
  setStarsBalance: (starsBalance) => set({ starsBalance }),
  setDefaultDonateAmount: (defaultDonateAmount) => set({ defaultDonateAmount }),
  clearAll: () => set({ profile: null, starsBalance: 0, defaultDonateAmount: 5 }),
}));

interface ProfileState {
  profile: User | null;
  setProfile: (profile: User) => void;
  clearAll: () => void;
}

export const useProfileStore = create<ProfileState>()((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  clearAll: () => set({ profile: null }),
}));

interface ProfileCacheState {
  cache: Record<string, User>;
  set: (username: string, profile: User) => void;
  get: (username: string) => User | undefined;
  clear: () => void;
}

export const useProfileCacheStore = create<ProfileCacheState>()((set, get) => ({
  cache: {},
  set: (username, profile) => set((s) => ({ cache: { ...s.cache, [username]: profile } })),
  get: (username) => get().cache[username],
  clear: () => set({ cache: {} }),
}));
