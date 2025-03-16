import { sortUsersByRole, getRoleHeirarchyIndex } from 'utils/user/sort-users-by-role';
import { PartialUser } from 'interfaces';

describe('sortUsersByRole', () => {
  it('should sort users by role hierarchy', () => {
    const users: PartialUser[] = [
      { id: 1, name: 'User1', roles: [{ name: 'Supporter' }] },
      { id: 2, name: 'User2', roles: [{ name: 'Staff' }] },
      { id: 3, name: 'User3', roles: [{ name: 'Ambassador' }] },
      { id: 4, name: 'User4', roles: [{ name: 'Core Team' }] },
      { id: 5, name: 'User5', roles: [{ name: 'Exec Team' }] },
      { id: 6, name: 'User6', roles: [{ name: 'Organizer' }] },
    ];
    sortUsersByRole(users);
    expect(users.map(user => user.name)).toEqual(['User6', 'User5', 'User4', 'User2', 'User3', 'User1']);
  });

  it('should sort users by referred users length', () => {
    const users: PartialUser[] = [
      { id: 1, name: 'User1', roles: [{ name: 'Supporter' }], referredUsers: [{ id: 1 }, { id: 2 }] },
      { id: 2, name: 'User2', roles: [{ name: 'Supporter' }] },
    ];
    sortUsersByRole(users);
    expect(users.map(user => user.name)).toEqual(['User1', 'User2']);
  });

  it('should sort users by roles length', () => {
    const users: PartialUser[] = [
      { id: 1, name: 'User1', roles: [{ name: 'Supporter' }, { name: 'Staff' }] },
      { id: 2, name: 'User2', roles: [{ name: 'Supporter' }] },
    ];
    sortUsersByRole(users);
    expect(users.map(user => user.name)).toEqual(['User1', 'User2']);
  });

  it('should sort users by subscriptions length', () => {
    const users: PartialUser[] = [
      { id: 1, name: 'User1', roles: [{ name: 'Supporter' }], subscriptions: [{ id: 1 }, { id: 2 }] },
      { id: 2, name: 'User2', roles: [{ name: 'Supporter' }] },
    ];
    sortUsersByRole(users);
    expect(users.map(user => user.name)).toEqual(['User1', 'User2']);
  });

  it('should sort users by name', () => {
    const users: PartialUser[] = [
      { id: 1, name: 'User2', roles: [{ name: 'Supporter' }] },
      { id: 2, name: 'User1', roles: [{ name: 'Supporter' }] },
    ];
    sortUsersByRole(users);
    expect(users.map(user => user.name)).toEqual(['User1', 'User2']);
  });

  it('should handle ambassador role correctly', () => {
    const users: PartialUser[] = [
      { id: 1, name: 'User1', roles: [], referredUsers: [{ id: 1 }] },
      { id: 2, name: 'User2', roles: [] },
    ];
    sortUsersByRole(users);
    expect(users.map(user => user.name)).toEqual(['User1', 'User2']);
    expect(getRoleHeirarchyIndex(users[0])).toBe(2); // Ambassador index
    expect(getRoleHeirarchyIndex(users[1])).toBe(-1); // No role index
  });
});
