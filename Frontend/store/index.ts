import { create } from 'zustand';
import { createProfileSlice, ProfileSlice } from './profileSlice';
import { createResumeSlice, ResumeSlice } from './resumeSlice';
import { createExtensionSlice, ExtensionSlice } from './extensionSlice';

export type StoreState = ProfileSlice & ResumeSlice & ExtensionSlice;

export const useResumeStore = create<StoreState>()((...a) => ({
  ...createProfileSlice(...a),
  ...createResumeSlice(...a),
  ...createExtensionSlice(...a),
}));
