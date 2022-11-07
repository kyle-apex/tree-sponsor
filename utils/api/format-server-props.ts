import { Decimal } from '@prisma/client/runtime';

export default function formatServerProps(object: any) {
  if (!object) return;
  if (object instanceof Array) {
    for (const obj of object) {
      formatServerProps(obj);
    }
  } else if (object && typeof object == 'object' && !(object instanceof Date) && !(object instanceof Decimal)) {
    console.log('object', object);
    for (const property in object) {
      const value = object[property];
      if (typeof value == 'object' && value) {
        if (value instanceof Date) object[property] = value.toJSON();
        else if (value instanceof Decimal) object[property] = Number(value);
        else formatServerProps(value);
      }
    }
  }
}
