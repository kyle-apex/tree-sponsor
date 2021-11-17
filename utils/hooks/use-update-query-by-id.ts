import { useMutation, useQueryClient } from 'react-query';

export const useUpdateQueryById = <T extends { id?: string | number }>(
  key: string,
  updateFunction: (id: number, attributes: Record<string, unknown>) => Promise<void>,
  hasRefetch?: boolean,
) => {
  const queryKey = [key, undefined];
  const queryClient = useQueryClient();

  function updateQueryListItem(updatedItem: any) {
    const previousList: T[] = queryClient.getQueryData<T[]>(queryKey);
    const updatedList = [...previousList];
    const index = updatedList.findIndex(eachValue => eachValue.id === updatedItem.id);

    if (index !== -1) {
      updatedList[index] = {
        ...updatedList[index],
        ...updatedItem,
      };
      queryClient.setQueryData(queryKey, updatedList);
    }

    return () => queryClient.setQueryData(queryKey, previousList);
  }

  const { mutate, isLoading } = useMutation(
    async (inputs: { id: number; attributes: Record<string, unknown> }) => {
      await updateFunction(inputs.id, inputs.attributes);
    },
    {
      onMutate: updateQueryListItem,

      onError: (_error, _editedValue, rollback) => {
        //console.log('rollback');
        rollback();
      },

      onSettled: (_data, _error, editedValue) => {
        queryClient.removeQueries([queryKey, editedValue.id]);
        if (hasRefetch) queryClient.refetchQueries(queryKey);
      },
      onSuccess: (_data, variables) => {
        queryClient.setQueryData([queryKey, { id: variables.id }], variables);
      },
    },
  );

  const updateById = (id: number, attributes: Record<string, unknown>) => {
    mutate({ id: id, attributes: attributes });
  };

  return { updateById, isLoading };
};
