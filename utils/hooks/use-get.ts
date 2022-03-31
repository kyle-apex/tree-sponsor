/* eslint-disable no-async-promise-executor */
import { QueryObserverResult, useQuery } from 'react-query';
import axios from 'axios';
import parseResponseDateStrings from 'utils/api/parse-response-date-strings';

export const useGet = <T>(
  path: string,
  key?: string | string[],
  params?: Record<string, unknown>,
  options?: { refetchOnWindowFocus: boolean },
): QueryObserverResult<T> => {
  if (!path) {
    throw new Error('Path is required');
  }

  const fetcher = () => {
    const source = axios.CancelToken.source();

    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await axios.get(path, {
          // Pass the source token to your request
          cancelToken: source.token,
          params: params,
        });
        parseResponseDateStrings(result.data);
        resolve(result.data);
      } catch (err) {
        reject(err);
      }
    });

    // Cancel the requesst if React Query calls the `promise.cancel` method
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    promise['cancel'] = () => {
      source.cancel('Query was cancelled by React Query');
    };

    return promise;
  };
  const queryKey = typeof key === 'string' ? [key, params] : key;
  return useQuery(queryKey, fetcher, options || { refetchOnWindowFocus: false });
};
