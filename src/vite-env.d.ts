/* Declarações de módulo para assets de estilo processados pelo bundler. */

declare module "*.scss" {}

declare module "*.scss?inline" {
  const css: string;
  export default css;
}
