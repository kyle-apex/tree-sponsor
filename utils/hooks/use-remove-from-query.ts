import { useMutation, useQueryClient } from 'react-query';

export const useRemoveFromQuery = (key: string, removeFunction: (id: number) => Promise<any>, hasRefetch?: boolean) => {
  const queryKey = [key, undefined];
  const queryClient = useQueryClient();

  function removeQueryListItem(id: number) {
    const previousList: any[] = queryClient.getQueryData(queryKey);
    const indexOfItem = previousList.find(item => {
      return item.id == id;
    });

    if (indexOfItem === -1) return;

    const updatedList = [...previousList];
    updatedList.splice(indexOfItem, 1);

    queryClient.setQueryData(queryKey, updatedList);

    return () => queryClient.setQueryData(queryKey, previousList);
  }

  const { mutate, isLoading } = useMutation(
    async (idToRemove: number) => {
      return await removeFunction(idToRemove);
    },
    {
      onMutate: removeQueryListItem,

      onError: (error, _editedValue, rollback) => {
        //console.log('rollback');
        rollback();
        console.log('_error', error);
      },

      onSettled: (_data, _error, removedId) => {
        queryClient.removeQueries([queryKey, removedId]);
        if (hasRefetch) queryClient.refetchQueries(queryKey);
      },
      onSuccess: (_data, variables) => {
        queryClient.setQueryData([queryKey], variables);
      },
    },
  );

  return { remove: mutate, isLoading };
};
