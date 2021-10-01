function isDate(value: any) {
  return typeof value === 'string' && /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+/.test(value);
}

function parseObjectDateStrings(item: any) {
  if (item && typeof item === 'object') {
    for (const key in item) {
      const value = item[key];
      if (isDate(item[key])) item[key] = new Date(value);
    }
  }
}

function parseResponseDateStrings(listOrObject: any[] | any): any[] | any {
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
