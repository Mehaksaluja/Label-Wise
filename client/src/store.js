import { create } from 'zustand';
import axios from 'axios';

export const useAppStore = create((set) => ({
  // State
  plan: null, // This will now store only the planData object
  planCreatedAt: null, // New state to hold the creation date for accurate day tracking
  progressData: { progress: [], weight: [] },
  isLoading: true,
  error: null,

  // Actions
  fetchData: async () => {
    set({ isLoading: true, error: null });
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      set({ isLoading: false, error: 'You must be logged in.' });
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const [planResponse, progressResponse] = await Promise.all([
        axios.get('http://localhost:5001/api/plan', config),
        axios.get('http://localhost:5001/api/progress/dashboard', config),
      ]);
      set({
        plan: planResponse.data.planData, // Store just the plan data object
        planCreatedAt: planResponse.data.createdAt, // Store the creation date separately
        progressData: progressResponse.data,
        isLoading: false,
      });
    } catch (err) {
      set({
        isLoading: false,
        error: 'Could not fetch your dashboard data. Please complete onboarding.',
      });
    }
  },

  // This action now correctly updates only the plan data, leaving other state untouched
  updatePlan: (newPlanData) => set({ plan: newPlanData }),
}));