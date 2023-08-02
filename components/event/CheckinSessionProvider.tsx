import { createContext, ReactNode } from 'react';
import useLocalStorage from 'utils/hooks/use-local-storage';

export const CheckinSessionContext = createContext(null);

const CheckinSessionProvider = ({ children }: { children: ReactNode }) => {
  const [sessionId, setSessionId] = useLocalStorage('checkinSessionId', '');

  return <CheckinSessionContext.Provider value={{ sessionId, setSessionId }}>{children}</CheckinSessionContext.Provider>;
};
export default CheckinSessionProvider;
