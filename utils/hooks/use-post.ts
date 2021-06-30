/* eslint-disable no-async-promise-executor */
import { useMutation } from 'react-query';
import axios from 'axios';

export const usePost = (path: string, key?: string, params?: Record<string, unknown>) => {
  if (!path) {
    throw new Error('Path is required');
  }

  const mutation = () => {
    console.log('mutated?');

    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await axios.post(path, params);
        resolve(result.data);
      } catch (err) {
        reject(err);
      }
    });

    return promise;
  };

  return useMutation([key, params], mutation);
};
