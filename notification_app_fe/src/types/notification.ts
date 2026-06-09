export interface Notification {
  ID: string;
  Type: 'Placement' | 'Result' | 'Event' | string;
  Message: string;
  Timestamp: string; // "YYYY-MM-DD HH:mm:ss"
  priorityScore?: number;
}

export type NotificationTypeFilter = 'All' | 'Placement' | 'Result' | 'Event';
export type TopNLimit = 10 | 15 | 20;
