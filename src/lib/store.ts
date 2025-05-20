import { create } from 'zustand';

// Define the Webinar interface
export interface Webinar {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'scheduled' | 'live' | 'ended';
  hostId: string;
  hostName?: string; // Name of the host for the webinar
  createdAt: Date;
  agentId?: string; // Optional field for the selected AI agent
}

// Define the store types
interface AppState {
  // User state
  isAuthenticated: boolean;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  
  // Webinar state
  currentWebinar: Webinar | null;
  webinarList: Webinar[];
  
  // User actions
  setAuth: (isAuthenticated: boolean) => void;
  setUser: (user: AppState['user']) => void;
  logout: () => void;
  
  // Webinar actions
  setCurrentWebinar: (webinar: Webinar) => void;
  clearCurrentWebinar: () => void;
  setWebinarList: (list: Webinar[]) => void;
  addWebinar: (webinar: Webinar) => void;
  updateWebinar: (webinar: Webinar) => void;
  removeWebinar: (id: string) => void;
}

// Create the store
export const useAppStore = create<AppState>((set) => ({
  // Initial state - User
  isAuthenticated: false,
  user: null,
  
  // Initial state - Webinar
  currentWebinar: null,
  webinarList: [],
  
  // User actions
  setAuth: (isAuthenticated) => set({ isAuthenticated }),
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ isAuthenticated: false, user: null }),
  
  // Webinar actions
  setCurrentWebinar: (webinar) => set({ currentWebinar: webinar }),
  clearCurrentWebinar: () => set({ currentWebinar: null }),
  setWebinarList: (list) => set({ webinarList: list }),
  addWebinar: (webinar) => set((state) => ({ 
    webinarList: [...state.webinarList, webinar] 
  })),
  updateWebinar: (webinar) => set((state) => ({ 
    webinarList: state.webinarList.map(w => 
      w.id === webinar.id ? webinar : w
    ),
    currentWebinar: state.currentWebinar?.id === webinar.id ? webinar : state.currentWebinar
  })),
  removeWebinar: (id) => set((state) => ({ 
    webinarList: state.webinarList.filter(w => w.id !== id),
    currentWebinar: state.currentWebinar?.id === id ? null : state.currentWebinar
  })),
})); 