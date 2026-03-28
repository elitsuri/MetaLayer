import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

export interface Entity {
  id: string;
  name: string;
  type: string;
  properties?: any;
}

export interface Relationship {
  id: string;
  source: string;
  target: string;
  type: string;
  weight: number;
}

export interface System {
  system_id: string;
  name: string;
  type: string;
}

export interface GlobalState {
  systems: System[];
  nodes: Entity[];
  links: Relationship[];
  risks: any[];
  insights: any[];
}

interface MetaStore {
  state: GlobalState;
  socket: Socket | null;
  loading: boolean;
  init: () => void;
  runSimulation: (targetNode: string) => Promise<any>;
}

export const useMetaStore = create<MetaStore>((set, get) => ({
  state: {
    systems: [],
    nodes: [],
    links: [],
    risks: [],
    insights: [],
  },
  socket: null,
  loading: true,
  init: () => {
    const socket = io();
    
    socket.on('init', (data: GlobalState) => {
      set({ state: data, loading: false });
    });

    socket.on('update', (data: GlobalState) => {
      set({ state: data });
    });

    set({ socket });
  },
  runSimulation: async (targetNode: string) => {
    const response = await fetch('/api/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetNode }),
    });
    return response.json();
  },
}));
