export const getURL = () => {
  const url = process?.env?.URL && process.env.URL !== '' ? process.env.URL : 'http://localhost:3000';
  return url.includes('http') ? url : `https://${url}`;
};
