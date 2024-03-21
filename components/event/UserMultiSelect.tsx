import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DeleteIconButton from 'components/DeleteIconButton';
import SplitRow from 'components/layout/SplitRow';
import UserDisplay from 'components/sponsor/UserDisplay';
import UserSelector from 'components/UserSelector';
import { PartialUser } from 'interfaces';
import { useState, useEffect } from 'react';

const UserMultiSelect = ({
  label = 'Users',
  users,
  onAdd,
  onDelete,
  deleteDialogPropertyName = 'user',
  onUpdated,
}: {
  label?: string;
  users: PartialUser[];
  onAdd?: (userId: number) => Promise<void>;
  onDelete?: (userId: number) => Promise<void>;
  deleteDialogPropertyName?: string;
  onUpdated?: (users: PartialUser[]) => void;
}) => {
  const [userList, setUserList] = useState<PartialUser[]>(users);
  const [isLoading, setIsLoading] = useState(false);
  const handleSelection = async (user: PartialUser) => {
    setIsLoading(true);
    let newList;
    if (!userList) newList = [user];
    else newList = [...userList, user];
    setUserList(newList);
    if (onUpdated) onUpdated(newList);
    if (onAdd) await onAdd(user.id);
    setIsLoading(false);
  };
  const handleDelete = async (userId: number) => {
    setIsLoading(true);
    setUserList(list => {
      let newList: PartialUser[];
      if (!list) newList = [];
      else newList = list.filter(user => user.id != userId);
      if (onUpdated) onUpdated(newList);
      return newList;
    });
    if (onDelete) await onDelete(userId);
    setIsLoading(false);
  };

  useEffect(() => {
    console.log('settin gusers', users);
    setUserList(currentList => {
      return !currentList ? users : currentList;
    });
  }, [users]);

  return (
    <>
      <Typography variant='h2' color='secondary'>
        Organizers
      </Typography>
      {userList?.length > 0 && (
        <Box mb={1}>
          {userList?.map(user => {
            return (
              <SplitRow mb={1.5} key={user.id}>
                <UserDisplay user={user}></UserDisplay>
                <DeleteIconButton
                  itemType={deleteDialogPropertyName}
                  title='Remove Organizer?'
                  onDelete={async () => handleDelete(user.id)}
                ></DeleteIconButton>
              </SplitRow>
            );
          })}
        </Box>
      )}
      <UserSelector sx={{ mt: 1 }} label={label} isLoading={isLoading} onSelect={handleSelection}></UserSelector>
    </>
  );
};
export default UserMultiSelect;
