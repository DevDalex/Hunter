const escapeRegExp = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const sourceImportsDefault = (source, localName, modulePath) => new RegExp(
  `import\\s+${escapeRegExp(localName)}\\s+from\\s+['\"]${escapeRegExp(modulePath)}['\"]\\s*;?`,
).test(source);

export const sourceRendersRouteWith = (source, routeId, componentName) => new RegExp(
  `route\\.id\\s*===\\s*['\"]${escapeRegExp(routeId)}['\"][\\s\\S]{0,320}<${escapeRegExp(componentName)}\\b`,
).test(source);

export const declarationIncludesLiteral = (source, declarationName, literal) => {
  const match = source.match(new RegExp(`const\\s+${escapeRegExp(declarationName)}\\s*=([\\s\\S]*?);`));
  if (!match) return false;
  return new RegExp(`['\"]${escapeRegExp(literal)}['\"]`).test(match[1]);
};

export const sourceContainsAll = (source, values) => values.every((value) => source.includes(value));
