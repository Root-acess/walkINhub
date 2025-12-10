// src/types.d.ts

declare module "pdfjs-dist/build/pdf" {
  // This tells TypeScript to treat the imported module as a generic object
  const pdfjs: any;
  export = pdfjs;
}