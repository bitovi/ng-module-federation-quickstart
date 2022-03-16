/**
 * Casing
 */
export function toCamelCase(str: string): string {
  return str.replace(/-./g, (x) => x.toUpperCase()[1]);
}

export function kebabCaseToCapitalCase(str: string): string {
  let arr = str.split('-');
  let capital = arr.map((item, index) =>
    index ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase() : item.toLowerCase()
  );
  // ^-- change here.
  let capitalString = capital.join('');
  return capitalString.substr(0, 1).toUpperCase() + capitalString.substr(1);
}

export function kebabCaseToCamelCase(str: string): string {
  const capitalCaseString = kebabCaseToCapitalCase(str);
  return capitalCaseString.substr(0, 1).toLowerCase() + capitalCaseString.substr(1);
}

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
