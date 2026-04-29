export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  image?: string | null;
  isNew?: boolean;
}

export interface Chat {
  id: number;
  title: string;
  messages: ChatMessage[];
  model: string;
}

export interface AppState {
  chats: Chat[];
  activeId: number | null;
  isTyping: boolean;
  currentImage: string | null;
  theme: 'dark' | 'light';
  personality: 'formal' | 'fun' | 'toxic';
  currentlySpeakingIdx: number | null;
}

export interface ModelGroup {
  label: string;
  models: string[];
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  pulseSpeed: number;
  pulseOffset: number;
}
