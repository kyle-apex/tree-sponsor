import axios from 'axios';
import parseResponseDateStrings from './parse-response-date-strings';

const parsedGet = async <T>(path: string): Promise<T> => {
  if (!path) return;

  if (!path.includes('api/')) {
    if (path.startsWith('/')) path = '/api' + path;
    else path = '/api/' + path;
  }

  const results = await axios.get(path);

  parseResponseDateStrings(results.data);

  return results.data;
};

export default parsedGet;
