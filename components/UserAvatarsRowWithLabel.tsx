import { Box, Typography } from '@mui/material';
import { PartialUser } from 'interfaces';
import UserAvatar from './sponsor/UserAvatar';

interface UserAvatarsRowWithLabelProps {
  users: PartialUser[];
  label: string;
  baseColor: string;
}

const UserAvatarsRowWithLabel = ({ users, label, baseColor }: UserAvatarsRowWithLabelProps) => {
  // Convert baseColor to RGB and create a semi-transparent version
  const rgbaBackground = `${baseColor}33`; // 20% opacity
  const avatarSize = 40;

  // Calculate dynamic overlap based on number of users
  // More users = more overlap to prevent overflow
  const getOverlapAmount = (userCount: number) => {
    if (userCount <= 3) return { xs: 20, sm: 20, md: 20 }; // minimal overlap for few users
    if (userCount <= 5) return { xs: 25, sm: 25, md: 20 }; // medium overlap
    // For more users, increase overlap to prevent overflow
    return {
      xs: Math.min(35, 20 + (userCount - 3) * 3), // max 35px overlap on mobile
      sm: Math.min(30, 20 + (userCount - 3) * 2.5), // max 30px overlap on tablet
      md: Math.min(25, 20 + (userCount - 3) * 2), // max 25px overlap on desktop
    };
  };

  const overlapAmount = getOverlapAmount(users.length);

  // Handle pluralization of label
  const displayLabel = users.length === 1 && label.endsWith('s') ? label.slice(0, -1) : label;

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
                  xs: avatarSize + (users.length - 1) * (avatarSize - overlapAmount.xs),
                  sm: avatarSize + (users.length - 1) * (avatarSize - overlapAmount.sm),
                  md: avatarSize + (users.length - 1) * (avatarSize - overlapAmount.md),
                }
              : avatarSize,
          height: avatarSize, // Set explicit height
          alignItems: 'center', // Center avatars vertically
        }}
      >
        {users.map((user, index) => (
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
            <UserAvatar name={user.displayName || user.name || '?'} image='' size={avatarSize} sx={{ bgcolor: baseColor }} />
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
