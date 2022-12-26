import { useMutation, useQueryClient } from 'react-query';

export const useRemoveFromQuery = <T extends { id?: string | number }>(
  key: string | (string | Record<string, unknown>)[],
  removeFunction: (id: number) => void,
  hasRefetch?: boolean,
) => {
  const queryKey = typeof key === 'string' ? [key, undefined] : key;
  const queryClient = useQueryClient();

  function removeQueryListItem(id: number) {
    const previousList: T[] = queryClient.getQueryData(queryKey);
    const item = previousList.find(item => {
      return item.id == id;
    });

    if (!item) return;

    const indexOfItem = previousList.indexOf(item);

    const updatedList = [...previousList];
    updatedList.splice(indexOfItem, 1);
    console.log('updatedList', updatedList);
    console.log('indexOfItem', indexOfItem);

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
