function isDate(value: any) {
  return typeof value === 'string' && /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+/.test(value);
}

function parseResponseDateStrings(list: any[]): any[] {
  for (const item of list || []) {
    if (item && typeof item === 'object') {
      for (const key in item) {
        const value = item[key];
        if (isDate(item[key])) item[key] = new Date(value);
      }
    }
  }
  return list;
}
export default parseResponseDateStrings;
