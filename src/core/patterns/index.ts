export const remotesPattern = /remotes[:\s\{\tA-Za-z0-9\'\"\/\n.@,]{1,}\}/;

export const environmentPattern = /^[A-Z]+[\n\s\t\=\"\'\:A-Z\{]+\}/gim;

export const routesPattern = /const routes[\{\}A-Za-z\'\",\(\)\:\@\.\=\>\-\_\/\n\s\t\[0-9]{1,}\]/;

export const objectPattern = /\{[\{\}A-Za-z\'\",\(\)\:\@\.\=\>\-\_\/\n\s\t\[0-9]{1,}\}/;
