import { useMutation, useQueryClient } from 'react-query';

export const useUpdateQueryById = <T extends { id?: string | number }>(
  key: string | string[],
  updateFunction: (id: number, attributes: Record<string, unknown>) => Promise<void>,
  hasRefetch?: boolean,
  debounceMilliseconds?: number,
) => {
  const queryKey = typeof key === 'string' ? [key, undefined] : key;
  const queryClient = useQueryClient();
  let debounceHandle: NodeJS.Timeout;

  function updateQueryListItem(updatedItem: any) {
    //console.log('queryKey', queryKey);
    const previousList: T[] = queryClient.getQueryData<T[]>(queryKey);
    //console.log('previousList', previousList);
    const updatedList = [...previousList];
    const index = updatedList.findIndex(eachValue => eachValue.id === updatedItem.id);
    //console.log('updatedItem', updatedItem);
    if (index !== -1) {
      updatedList[index] = {
        ...updatedList[index],
        ...updatedItem,
      };
      //console.log('updatedList[index]', updatedList[index]);
      queryClient.setQueryData(queryKey, updatedList);
    }

    // return a rollback function
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
    if (debounceMilliseconds) {
      if (debounceHandle) clearTimeout(debounceHandle);
      debounceHandle = setTimeout(() => {
        mutate({ id: id, attributes: attributes });
      }, debounceMilliseconds);
    } else mutate({ id: id, attributes: attributes });
  };

  return { updateById, isLoading };
};
