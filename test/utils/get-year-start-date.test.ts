import getYearStartDate from 'utils/get-year-start-date';

describe('getYearStartDate', () => {
  // Store the original Date constructor
  const OriginalDate = global.Date;

  beforeEach(() => {
    // Mock the current date to a fixed value
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2023-05-15T12:00:00Z'));
  });

  afterEach(() => {
    // Restore the original timer implementation
    jest.useRealTimers();
  });

  it('should return a date object', () => {
    const result = getYearStartDate(2023);
    expect(result).toBeInstanceOf(Date);
  });

  it('should return December 31st of the previous year when given a year', () => {
    // Test with the current year
    const result = getYearStartDate(2023);

    // Based on the current implementation, setting date to 0 gives the last day of the previous month
    // So for year 2023, month 0 (January), date 0 should be December 31, 2022
    expect(result.getFullYear()).toBe(2022);
    expect(result.getMonth()).toBe(11); // December (0-based index)
    expect(result.getDate()).toBe(31);
  });

  it('should return the correct date for different years', () => {
    // Test with a past year
    const result1 = getYearStartDate(2020);
    expect(result1.getFullYear()).toBe(2019);
    expect(result1.getMonth()).toBe(11); // December
    expect(result1.getDate()).toBe(31);

    // Test with a future year
    const result2 = getYearStartDate(2025);
    expect(result2.getFullYear()).toBe(2024);
    expect(result2.getMonth()).toBe(11); // December
    expect(result2.getDate()).toBe(31);
  });

  it('should handle leap years correctly', () => {
    // Test with a leap year
    const result1 = getYearStartDate(2024); // 2024 is a leap year
    expect(result1.getFullYear()).toBe(2023);
    expect(result1.getMonth()).toBe(11); // December
    expect(result1.getDate()).toBe(31);

    // Test with a non-leap year
    const result2 = getYearStartDate(2023); // 2023 is not a leap year
    expect(result2.getFullYear()).toBe(2022);
    expect(result2.getMonth()).toBe(11); // December
    expect(result2.getDate()).toBe(31);
  });

  it('should preserve the time components from the current date', () => {
    // The function creates a new Date() without parameters, which inherits the current time
    const currentDate = new Date();
    const result = getYearStartDate(2023);

    // Time components should match the current time when the function was called
    expect(result.getHours()).toBe(currentDate.getHours());
    expect(result.getMinutes()).toBe(currentDate.getMinutes());
    expect(result.getSeconds()).toBe(currentDate.getSeconds());
  });

  // Note: There appears to be a potential issue with the implementation.
  // Setting date to 0 gives the last day of the previous month (December 31 of previous year),
  // not January 1 of the specified year. If the intention is to get January 1,
  // the implementation should set date to 1, not 0.
});
