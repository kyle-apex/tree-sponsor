import { useMutation, useQueryClient } from 'react-query';

export const useAddToQuery = <T extends { id?: number | string }>(
  key: string,
  addFunction: (newObject: Partial<T>) => Promise<T>,
  hasRefetch?: boolean,
) => {
  const queryKey = [key, undefined];
  const queryClient = useQueryClient();

  function addQueryListItem(newItem: Partial<T>) {
    const previousList: T[] = queryClient.getQueryData(queryKey);
    const updatedList = [...previousList, newItem];

    queryClient.setQueryData(queryKey, updatedList);

    return () => queryClient.setQueryData(queryKey, previousList);
  }

  const { mutate, isLoading } = useMutation(
    async (newObject: Partial<T>) => {
      return await addFunction(newObject);
    },
    {
      onMutate: addQueryListItem,

      onError: (_error, _addedValue, rollback) => {
        //console.log('rollback');
        rollback();
      },

      onSettled: (_data, _error, addedValue) => {
        queryClient.removeQueries([queryKey, addedValue.id]);
        if (hasRefetch) queryClient.refetchQueries(queryKey);
      },
      onSuccess: (_data, variables) => {
        queryClient.setQueryData([queryKey], variables);
      },
    },
  );

  return { add: mutate, isLoading };
};
