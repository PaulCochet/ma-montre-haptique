
export enum AppState {
  IDLE = 'IDLE',
  DETECTING = 'DETECTING',
  ALERT = 'ALERT',
  ACTIVE = 'ACTIVE'
}

export interface ActivityData {
  type: string;
  confidence: number;
  message: string;
}
