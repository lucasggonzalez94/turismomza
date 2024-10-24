export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'review';
  message: string;
  read: boolean;
  creation_date: Date;
  user: User;
}

export interface User {
  id: string;
  name: string;
}
