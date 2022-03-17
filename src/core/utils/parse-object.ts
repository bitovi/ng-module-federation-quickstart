export function parseToObject(object: string): any {
  let finalObj = eval(`(() => { return ${object.replace(/[\n\s\t]/g, '')}})()`);

  return finalObj;
}

export function parseToStringObject(object: string) {
  const nameRegex = /[A-Za-z0-9\_\-]{1,}:/;
  let finalObj = {};

  if (object[0] === '{' && object[object.length - 1] === '}') {
    object = object.substring(1);
    object = object.slice(0, -1);
  }

  const values: string[] = object
    .replace(/[\n\s\t]/g, '')
    .trim()
    .split(',')
    .filter((value) => value.length > 0);

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
