import * as pdfjs from "pdfjs-dist/build/pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker?worker";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

export default pdfjs;
