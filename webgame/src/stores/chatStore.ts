import { create } from 'zustand'

export interface ChatMessage {
  id: string
  sender: string
  message: string
  timestamp: string
  avatar?: string
  isOwn: boolean
}

export interface RoomCredentials {
  roomName: string
  clientName: string
}

export interface ChatState {
  // Connection state
  ws: WebSocket | null
  isConnected: boolean
  isConnecting: boolean
  connectionError: string | null
  
  // Room state
  currentRoom: string | null
  roomCredentials: RoomCredentials | null
  
  // Messages
  messages: ChatMessage[]
  
  // Actions
  setWebSocket: (ws: WebSocket | null) => void
  setConnectionState: (isConnected: boolean, isConnecting: boolean, error?: string | null) => void
  setRoom: (roomName: string, credentials: RoomCredentials) => void
  addMessage: (message: ChatMessage) => void
  clearMessages: () => void
  disconnect: () => void
}

export const useChatStore = create<ChatState>((set, get) => ({
  // Initial state
  ws: null,
  isConnected: false,
  isConnecting: false,
  connectionError: null,
  currentRoom: null,
  roomCredentials: null,
  messages: [],

  // Actions
  setWebSocket: (ws) => set({ ws }),
  
  setConnectionState: (isConnected, isConnecting, error = null) => 
    set({ isConnected, isConnecting, connectionError: error }),
  
  setRoom: (roomName, credentials) => 
    set({ currentRoom: roomName, roomCredentials: credentials }),
  
  addMessage: (message) => 
    set((state) => ({ messages: [...state.messages, message] })),
  
  clearMessages: () => set({ messages: [] }),
  
  disconnect: () => {
    const { ws } = get()
    if (ws) {
      ws.close()
    }
    set({
      ws: null,
      isConnected: false,
      isConnecting: false,
      connectionError: null,
      currentRoom: null,
      roomCredentials: null,
      messages: []
    })
  }
}))