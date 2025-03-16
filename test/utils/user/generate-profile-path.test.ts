import { generateProfilePath } from 'utils/user/generate-profile-path';
import { PartialUser } from 'interfaces';

describe('generateProfilePath', () => {
  it('should generate a profile path from user name', () => {
    const user: PartialUser = {
      name: 'John Doe',
      email: 'john.doe@example.com',
    };

    const result = generateProfilePath(user);

    expect(result).toBe('john-doe');
  });

  it('should generate a profile path from email if name is not provided', () => {
    const user: PartialUser = {
      email: 'jane.smith@example.com',
    };

    const result = generateProfilePath(user);

    expect(result).toBe('jane-smith');
  });

  it('should replace periods with hyphens', () => {
    const user: PartialUser = {
      name: 'Dr. Jane Smith',
      email: 'jane.smith@example.com',
    };

    const result = generateProfilePath(user);

    expect(result).toBe('dr--jane-smith');
  });

  it('should convert the profile path to lowercase', () => {
    const user: PartialUser = {
      name: 'JOHN DOE',
      email: 'john.doe@example.com',
    };

    const result = generateProfilePath(user);

    expect(result).toBe('john-doe');
  });

  it('should handle complex names with multiple spaces and periods', () => {
    const user: PartialUser = {
      name: 'J. Robert Smith Jr.',
      email: 'robert.smith@example.com',
    };

    const result = generateProfilePath(user);

    expect(result).toBe('j--robert-smith-jr-');
  });

  it('should handle email addresses with dots and special characters', () => {
    const user: PartialUser = {
      email: 'robert.j.smith+work@example.com',
    };

    const result = generateProfilePath(user);

    expect(result).toBe('robert-j-smith+work');
  });
});
