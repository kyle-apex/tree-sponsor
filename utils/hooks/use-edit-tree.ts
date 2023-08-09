import axios from 'axios';
import { useRouter } from 'next/router';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { QueryKey } from 'react-query';
import { useUpdateQueryById } from './use-update-query-by-id';

export default function useEditTree(
  apiKey: QueryKey,
  onComplete?: () => void,
): {
  handleUpdateById: (id: number, attributes: Record<string, unknown>, callback?: () => void) => Promise<void>;
  handleDelete: (treeId: number) => void;
  handleDeleteImage: (uuid: string) => Promise<void>;
} {
  const updateTree = async (id: number, attributes: Record<string, unknown>) => {
    const sessionId = apiKey?.length > 1 ? (apiKey[1] as string) : '';
    await axios.patch('/api/trees/' + id + '?sessionId=' + encodeURIComponent(sessionId), attributes);
  };

  const { updateById } = useUpdateQueryById(apiKey, updateTree, false, 500);

  const handleUpdateById = async (id: number, attributes: Record<string, unknown>, callback?: () => void) => {
    const pictureUrl: string = attributes.pictureUrl as string;

    if (pictureUrl && !pictureUrl.startsWith('https://')) {
      await updateById(id, attributes, () => {
        if (onComplete) onComplete();
      });
    } else await updateById(id, attributes, callback);
  };

  const handleDeleteImage = async (uuid: string) => {
    await axios.delete('/api/treeImages/' + uuid);
    if (onComplete) onComplete();
  };

  async function handleDelete(treeId: number) {
    await axios.delete('/api/trees/' + treeId);
    if (onComplete) onComplete();
  }

  return { handleUpdateById, handleDelete, handleDeleteImage };
}
