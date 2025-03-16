import axios from 'axios';
import parsedGet from 'utils/api/parsed-get';
import parseResponseDateStrings from 'utils/api/parse-response-date-strings';

// Mock axios and parseResponseDateStrings
jest.mock('axios');
jest.mock('utils/api/parse-response-date-strings');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedParseResponseDateStrings = parseResponseDateStrings as jest.MockedFunction<typeof parseResponseDateStrings>;

describe('parsedGet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Setup mocked axios.get to return a default response
    mockedAxios.get.mockResolvedValue({ data: { test: 'data' } });
    // Setup mocked parseResponseDateStrings to return the input
    mockedParseResponseDateStrings.mockImplementation(data => data);
  });

  it('should return undefined if path is empty', async () => {
    const result = await parsedGet('');
    expect(result).toBeUndefined();
    expect(mockedAxios.get).not.toHaveBeenCalled();
    expect(mockedParseResponseDateStrings).not.toHaveBeenCalled();
  });

  it('should prepend /api to path without leading slash', async () => {
    await parsedGet('test-path');
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/test-path');
    expect(mockedParseResponseDateStrings).toHaveBeenCalledWith({ test: 'data' });
  });

  it('should prepend /api to path with leading slash', async () => {
    await parsedGet('/test-path');
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/test-path');
    expect(mockedParseResponseDateStrings).toHaveBeenCalledWith({ test: 'data' });
  });

  it('should not modify path that already includes api/', async () => {
    await parsedGet('api/test-path');
    expect(mockedAxios.get).toHaveBeenCalledWith('api/test-path');
    expect(mockedParseResponseDateStrings).toHaveBeenCalledWith({ test: 'data' });
  });

  it('should not modify path that already includes /api/', async () => {
    await parsedGet('/api/test-path');
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/test-path');
    expect(mockedParseResponseDateStrings).toHaveBeenCalledWith({ test: 'data' });
  });

  it('should not modify path that includes http', async () => {
    await parsedGet('http://example.com/test-path');
    expect(mockedAxios.get).toHaveBeenCalledWith('http://example.com/test-path');
    expect(mockedParseResponseDateStrings).toHaveBeenCalledWith({ test: 'data' });
  });

  it('should not modify path that includes https', async () => {
    await parsedGet('https://example.com/test-path');
    expect(mockedAxios.get).toHaveBeenCalledWith('https://example.com/test-path');
    expect(mockedParseResponseDateStrings).toHaveBeenCalledWith({ test: 'data' });
  });

  it('should call parseResponseDateStrings with the response data', async () => {
    const mockData = { test: 'data', date: '2023-01-01T00:00:00.000Z' };
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    const result = await parsedGet('/test-path');

    expect(mockedParseResponseDateStrings).toHaveBeenCalledWith(mockData);
    expect(result).toBe(mockData);
  });

  it('should return the response data directly, not the result of parseResponseDateStrings', async () => {
    const mockData = { test: 'data' };
    const parsedData = { test: 'parsed data' };

    mockedAxios.get.mockResolvedValueOnce({ data: mockData });
    // Even though parseResponseDateStrings returns a different value, the original data is returned
    mockedParseResponseDateStrings.mockImplementationOnce(() => parsedData);

    const result = await parsedGet('/test-path');

    // The original data should be returned, not the parsed data
    expect(result).toBe(mockData);
    // But parseResponseDateStrings should still be called
    expect(mockedParseResponseDateStrings).toHaveBeenCalledWith(mockData);
  });
});
