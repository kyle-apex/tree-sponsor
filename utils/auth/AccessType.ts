export type AccessType =
  | 'isAdmin'
  | 'hasAuthManagement'
  | 'isReviewer'
  | 'isTreeReviewer'
  | 'hasEventManagement'
  | 'hasMemberManagement'
  | 'hasShirtManagement'
  | 'hasFormManagement'
  | 'hasRedirectManagement';
export enum AccessTypes {
  isAdmin,
  hasAuthManagement,
  isReviewer,
  isTreeReviewer,
  hasEventManagement,
  hasMemberManagement,
  hasShirtManagement,
  hasFormManagement,
  hasRedirectManagement,
}
