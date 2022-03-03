export function parseToObject(object: string): { [key: string]: any } {
  const finalObj = {};
  const nameRegex = /[A-Za-z0-9\_\-]{1,}:/;

  const values: string[] = object.split(',').filter((value) => value.length > 0);

  for (let value of values) {
    if (!value.match(nameRegex)) {
      continue;
    }

    const propName: string = value.match(nameRegex)[0];
    value = value.replace(propName, '').replace(/[\'\"]/g, '');

    finalObj[propName.replace(/:/g, '')] = value;
  }

  return finalObj;
}
