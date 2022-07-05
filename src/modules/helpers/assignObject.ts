import { AnyObject } from '@wspro/ets-client';

/**
 * Заполняет свойства объекта данными другого объекта
 */
export function assignObject<T extends Object>(obj: T, values: AnyObject): T {
  Object.keys(values).forEach((prop) => {
    if (obj.hasOwnProperty(prop)) {
      (obj as unknown as AnyObject)[prop] = values[prop];
    }
  });

  return obj;
}
