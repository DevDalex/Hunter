const escapeRegExp = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const sourceImportsDefault = (source, localName, modulePath) => {
  const escapedName = escapeRegExp(localName);
  const escapedPath = escapeRegExp(modulePath);
  const defaultImport = new RegExp(
    `import\\s+${escapedName}\\s+from\\s+['"]${escapedPath}['"]\\s*;?`,
  );
  const namedImport = new RegExp(
    `import\\s*\\{[\\s\\S]*?\\b${escapedName}\\b[\\s\\S]*?\\}\\s*from\\s*['"]${escapedPath}['"]\\s*;?`,
  );
  return defaultImport.test(source) || namedImport.test(source);
};

export const sourceRendersRouteWith = (source, routeId, componentName) => new RegExp(
  `route\\.id\\s*===\\s*['"]${escapeRegExp(routeId)}['"](?:(?!route\\.id\\s*===)[\\s\\S])*?<${escapeRegExp(componentName)}\\b`,
).test(source);

export const declarationIncludesLiteral = (source, declarationName, literal) => {
  const match = source.match(new RegExp(`const\\s+${escapeRegExp(declarationName)}\\s*=([\\s\\S]*?);`));
  if (!match) return false;
  return new RegExp(`['"]${escapeRegExp(literal)}['"]`).test(match[1]);
};

export const sourceContainsAll = (source, values) => values.every((value) => source.includes(value));