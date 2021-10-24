function isDate(value: string) {
  return /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+/.test(value);
}

function parseObjectDateStrings(item: Record<string, unknown>) {
  if (item && typeof item === 'object') {
    for (const key in item) {
      const value = item[key];
      if (typeof value === 'string' && isDate(value)) item[key] = new Date(value);
    }
  }
}

function parseResponseDateStrings(
  listOrObject: Record<string, unknown>[] | Record<string, unknown>,
): Record<string, unknown>[] | Record<string, unknown> {
  if (listOrObject instanceof Array) {
    const list = listOrObject;
    for (const item of list || []) {
      parseObjectDateStrings(item);
    }
    return list;
  } else {
    parseObjectDateStrings(listOrObject);
    return listOrObject;
  }
}
export default parseResponseDateStrings;
