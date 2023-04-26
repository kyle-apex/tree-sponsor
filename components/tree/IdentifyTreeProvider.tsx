import { PartialTree, PartialTreeImage } from 'interfaces';
import { createContext, ReactNode, useState } from 'react';

export const IdentifyTreeContext = createContext(null);

const IdentifyTreeProvider = ({ children }: { children: ReactNode }) => {
  const [leafImage, setLeafImage] = useState<PartialTreeImage>();
  const [tree, setTree] = useState<PartialTree>({});

  return <IdentifyTreeContext.Provider value={{ leafImage, setLeafImage, tree, setTree }}>{children}</IdentifyTreeContext.Provider>;
};
export default IdentifyTreeProvider;
