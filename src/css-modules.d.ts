/**
 * TypeScript declaration for CSS Modules
 * Matches both *.module.css and component folder styles.css
 */
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*/styles.css' {
  const classes: { [key: string]: string };
  export default classes;
}
