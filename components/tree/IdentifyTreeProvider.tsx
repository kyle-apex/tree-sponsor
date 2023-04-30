import { PartialTree, PartialTreeImage } from 'interfaces';
import { createContext, ReactNode, useState } from 'react';

export const IdentifyTreeContext = createContext(null);

const IdentifyTreeProvider = ({ children }: { children: ReactNode }) => {
  const [leafImage, setLeafImage] = useState<PartialTreeImage>({ isLeaf: true });
  const [tree, setTree] = useState<PartialTree>({});

  const reset = () => {
    setLeafImage({ isLeaf: true });
    setTree({});
  };

  return <IdentifyTreeContext.Provider value={{ leafImage, setLeafImage, tree, setTree, reset }}>{children}</IdentifyTreeContext.Provider>;
};
export default IdentifyTreeProvider;
