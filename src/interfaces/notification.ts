export interface INotification {
  id: string;
  userId: string;
  type: 'like' | 'review';
  message: string;
  read: boolean;
  creationDate: Date;
  user: IUser;
  triggeredBy: IUser;
}

export interface IUser {
  id: string;
  name: string;
}
