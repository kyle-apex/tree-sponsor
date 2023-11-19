export type AccessType =
  | 'isAdmin'
  | 'hasAuthManagement'
  | 'isReviewer'
  | 'isTreeReviewer'
  | 'hasEventManagement'
  | 'hasMemberManagement'
  | 'hasShirtManagement';
export enum AccessTypes {
  isAdmin,
  hasAuthManagement,
  isReviewer,
  isTreeReviewer,
  hasEventManagement,
  hasMemberManagement,
  hasShirtManagement,
}
