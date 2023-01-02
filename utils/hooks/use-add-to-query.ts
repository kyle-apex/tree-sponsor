import { useMutation, useQueryClient } from 'react-query';

export const useAddToQuery = <T extends { id?: number | string }>(
  key: string | (string | Record<string, unknown>)[],
  addFunction: (newObject: Partial<T>) => Promise<T>,
  hasRefetch?: boolean,
) => {
  const queryKey = typeof key === 'string' ? [key, undefined] : key;
  const queryClient = useQueryClient();

  function addQueryListItem(newItem: Partial<T>) {
    //console.log('adding item', newItem);
    const previousList: T[] = queryClient.getQueryData(queryKey);
    const updatedList = [...previousList, newItem];

    queryClient.setQueryData(queryKey, updatedList);

    return () => queryClient.setQueryData(queryKey, previousList);
  }

  const { mutate, isLoading } = useMutation(
    async (newObject: Partial<T>) => {
      //console.log('before add function', newObject);
      const result = await addFunction(newObject);
      newObject.id = result.id;
      return result;
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
