import { PartialUser } from 'interfaces';

const roleHeirarchy = ['Member', 'Core Team', 'Staff', 'Exec Team', 'Organizer'];
export function getRoleHeirarchyIndex(roles: any[]) {
  let index = -1;
  roles.forEach(role => {
    const roleIndex = roleHeirarchy.indexOf(role.name);
    if (roleIndex > index) index = roleIndex;
  });
  return index;
}

export function sortUsersByRole(users: PartialUser[]) {
  users.sort((a, b) => {
    if (getRoleHeirarchyIndex(a.roles) > getRoleHeirarchyIndex(b.roles)) return -1;
    else if (getRoleHeirarchyIndex(b.roles) > getRoleHeirarchyIndex(a.roles)) return 1;
    if (a.roles?.length > b.roles?.length) return -1;
    if (b.roles?.length > a.roles?.length) return 1;
    if (a.subscriptions?.length > b.subscriptions?.length) return -1;
    if (b.subscriptions?.length > a.subscriptions?.length) return 1;
    return a.name < b.name ? -1 : 1;
  });
}
