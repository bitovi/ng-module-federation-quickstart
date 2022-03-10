export function parseToString(object: any, addComma = false, level = 0): string {
  let finalString = '{\n';

  const objectKeys: string[] = Object.keys(object);

  for (const key of objectKeys) {
    const spaces = ' '.repeat(level * 2 + 1);
    if (key.match(/\-/g)) {
      finalString += `${spaces}'${key}': `;
    } else {
      finalString += `${spaces}${key}: `;
    }

    if (typeof object[key] === 'object' && object[key] !== null) {
      finalString += parseToString(object[key], true, level + 1);

      continue;
    }

    if (
      typeof object[key] === 'string' &&
      !object[key].match(/"|'/) &&
      isNaN(object[key]) &&
      object[key] !== null &&
      object[key] !== undefined &&
      typeof object[key] !== 'boolean'
    ) {
      finalString += `${object[key]},\n`;
    } else {
      finalString += `${object[key]},\n`;
    }
  }

  const spaces = ' '.repeat(level > 0 ? level * 2 - 1 : 0);
  finalString += `${spaces}}`;

  if (addComma) {
    finalString += ',\n';
  }

  return finalString;
}
