import { Box, Typography } from '@mui/material';
import { PartialUser } from 'interfaces';
import UserAvatar from './sponsor/UserAvatar';

interface UserAvatarsRowWithLabelProps {
  users: PartialUser[];
  label: string;
  baseColor: string;
  maxDisplayedAvatars?: number;
}

const UserAvatarsRowWithLabel = ({ users, label, baseColor, maxDisplayedAvatars = 12 }: UserAvatarsRowWithLabelProps) => {
  // Convert baseColor to RGB and create a semi-transparent version
  const rgbaBackground = `${baseColor}33`; // 20% opacity
  const avatarSize = 40;

  // Calculate dynamic overlap based on number of users
  // More users = more overlap to prevent overflow
  const getOverlapAmount = (userCount: number) => {
    // Use the displayed count for overlap calculation
    const displayedCount = Math.min(userCount, maxDisplayedAvatars);

    if (displayedCount <= 3) return { xs: 20, sm: 20, md: 20 }; // minimal overlap for few users
    if (displayedCount <= 5) return { xs: 25, sm: 25, md: 20 }; // medium overlap
    if (displayedCount <= 10) return { xs: 30, sm: 28, md: 25 }; // increased overlap for more users

    // For large numbers of users, increase overlap significantly
    // The more users, the more overlap to prevent overflow
    const baseOverlap = {
      xs: 20 + Math.floor(displayedCount / 3) * 2, // Increase by 2px for every 3 users
      sm: 20 + Math.floor(displayedCount / 4) * 2, // Increase by 2px for every 4 users
      md: 20 + Math.floor(displayedCount / 5) * 2, // Increase by 2px for every 5 users
    };

    return {
      xs: Math.min(38, baseOverlap.xs), // Cap at 38px overlap on mobile
      sm: Math.min(35, baseOverlap.sm), // Cap at 35px overlap on tablet
      md: Math.min(32, baseOverlap.md), // Cap at 32px overlap on desktop
    };
  };

  const overlapAmount = getOverlapAmount(users.length);

  // Handle pluralization of label
  const displayLabel =
    users.length === 1
      ? label === 'Friends and Allies'
        ? 'Friend and Ally'
        : label.endsWith('s')
        ? label.slice(0, -1)
        : label
      : label === 'Friend and Ally'
      ? 'Friends and Allies'
      : label;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: rgbaBackground,
        borderRadius: 1,
        py: 1,
        px: 2,
        mb: 1,
        minHeight: avatarSize + 16, // avatar size + padding
        justifyContent: 'space-between', // Add this to push content to edges
      }}
    >
      {/* Avatars container with responsive overlap */}
      <Box
        sx={{
          display: 'flex',
          position: 'relative',
          minWidth:
            users.length > 0
              ? {
                  xs: avatarSize + (Math.min(users.length, maxDisplayedAvatars) - 1) * (avatarSize - overlapAmount.xs),
                  sm: avatarSize + (Math.min(users.length, maxDisplayedAvatars) - 1) * (avatarSize - overlapAmount.sm),
                  md: avatarSize + (Math.min(users.length, maxDisplayedAvatars) - 1) * (avatarSize - overlapAmount.md),
                }
              : avatarSize,
          height: avatarSize, // Set explicit height
          alignItems: 'center', // Center avatars vertically
        }}
      >
        {users.slice(0, maxDisplayedAvatars).map((user, index) => (
          <Box
            key={user.id}
            sx={{
              position: 'absolute',
              left: {
                xs: index * (avatarSize - overlapAmount.xs),
                sm: index * (avatarSize - overlapAmount.sm),
                md: index * (avatarSize - overlapAmount.md),
              },
              zIndex: index,
              top: '50%', // Center vertically
              transform: 'translateY(-50%)', // Center vertically
            }}
          >
            <UserAvatar
              name={user.displayName || user.name || '?'}
              image={user.image}
              size={avatarSize}
              sx={{ bgcolor: baseColor }}
              data-testid={`user-avatar-${user.id}`}
            />
          </Box>
        ))}
      </Box>

      {/* Label and count */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography
          variant='body1'
          sx={{
            fontWeight: 500,
            whiteSpace: 'nowrap',
            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
          }}
        >
          {users.length} {displayLabel}
        </Typography>
      </Box>
    </Box>
  );
};

export default UserAvatarsRowWithLabel;
