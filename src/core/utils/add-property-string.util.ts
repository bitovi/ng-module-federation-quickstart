import { objectPattern } from '../patterns';

export function addPropertyToObjectString(object: string, newProperty: string): string {
  const newObject = `{${[
    ...object
      .match(objectPattern)[0]
      .replace(/[\n\t]/g, '')
      .slice(1, -1)
      .split(','),
    newProperty,
  ]
    .filter((value) => value.length > 0)
    .join(',\n')}}`;

  return newObject;
}
