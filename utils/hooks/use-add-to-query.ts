import { useMutation, useQueryClient } from 'react-query';

export const useAddToQuery = (key: string, addFunction: (newObject: any) => Promise<any>, hasRefetch?: boolean) => {
  const queryKey = [key, undefined];
  const queryClient = useQueryClient();

  function addQueryListItem(newItem: any) {
    const previousList: any[] = queryClient.getQueryData(queryKey);
    const updatedList = [...previousList, newItem];

    queryClient.setQueryData(queryKey, updatedList);

    return () => queryClient.setQueryData(queryKey, previousList);
  }

  const { mutate, isLoading } = useMutation(
    async (newObject: any) => {
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
