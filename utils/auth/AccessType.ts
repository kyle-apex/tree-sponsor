export type AccessType =
  | 'isAdmin'
  | 'hasAuthManagement'
  | 'isReviewer'
  | 'isTreeReviewer'
  | 'hasEventManagement'
  | 'hasMemberManagement'
  | 'hasShirtManagement'
  | 'hasRedirectManagement';
export enum AccessTypes {
  isAdmin,
  hasAuthManagement,
  isReviewer,
  isTreeReviewer,
  hasEventManagement,
  hasMemberManagement,
  hasShirtManagement,
  hasRedirectManagement,
}
