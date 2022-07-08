import { AnyObject } from '@wspro/ets-client';

/**
 * Заполняет свойства объекта данными другого объекта
 */
export function assignObject<T>(obj: T, values: AnyObject): T {
  Object.keys(values).forEach((prop) => {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      (obj as unknown as AnyObject)[prop] = values[prop];
    }
  });

  return obj;
}
