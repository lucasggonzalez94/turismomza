export interface INotification {
  id: string;
  userId: string;
  type: 'like' | 'review';
  message: string;
  read: boolean;
  creationDate: Date;
  user: IUserNotification;
  triggeredBy: IUserNotification;
}

interface IUserNotification {
  id: string;
  name: string;
}
