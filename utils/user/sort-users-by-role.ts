import { PartialUser } from 'interfaces';

const roleHeirarchy = ['Supporter', 'Staff', 'Ambassador', 'Exec Team', 'Organizer'];
export function getRoleHeirarchyIndex(user: PartialUser) {
  const roles = user.roles;
  // Ambassador is a dynamic role based on whether you've referred a member
  if (user.referredUsers?.length && !roles.find(role => role.name === 'Ambassador')) roles.push({ name: 'Ambassador' });
  let index = -1;
  roles.forEach(role => {
    const roleIndex = roleHeirarchy.indexOf(role.name);
    if (roleIndex > index) index = roleIndex;
  });
  return index;
}

export function sortUsersByRole(users: PartialUser[]) {
  users.sort((a, b) => {
    if (getRoleHeirarchyIndex(a) > getRoleHeirarchyIndex(b)) return -1;
    else if (getRoleHeirarchyIndex(b) > getRoleHeirarchyIndex(a)) return 1;
    if (a.roles?.length > b.roles?.length) return -1;
    if (b.roles?.length > a.roles?.length) return 1;
    if (a.subscriptions?.length > b.subscriptions?.length) return -1;
    if (b.subscriptions?.length > a.subscriptions?.length) return 1;
    return a.name < b.name ? -1 : 1;
  });
}
