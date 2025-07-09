import PDFParser from "pdf2json";
import Tesseract from "tesseract.js";
import fs from "fs";
import path from "path";
import { fromBuffer } from "pdf2pic";
import { tmpdir } from "os";
import { v4 as uuid } from "uuid";

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const text = await parsePDFWithPdf2json(buffer);
  if (text && text.trim().length > 20) return text;

  console.warn("⚠️ Falling back to OCR (Tesseract.js)");
  return await extractTextWithOCR(buffer);
}

function parsePDFWithPdf2json(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", err => reject(err.parserError));
    //eslint-disable-next-line
    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
      const pages = pdfData?.formImage?.Pages || [];
      const text = pages
      //eslint-disable-next-line
        .map((page: any) =>
            //eslint-disable-next-line
          page.Texts?.map((t: any) => {
            try {
              return decodeURIComponent(t.R[0].T);
            } catch {
              return "";
            }
          }).join(" ")
        )
        .join("\n");

      resolve(text || "");
    });

    pdfParser.parseBuffer(buffer);
  });
}

async function extractTextWithOCR(buffer: Buffer): Promise<string> {
  // Save PDF to disk
  const tempPDFPath = path.join(tmpdir(), `${uuid()}.pdf`);
  fs.writeFileSync(tempPDFPath, buffer);

  // Convert first page to image
  const converter = fromBuffer(buffer, {
    density: 200,
    savePath: tmpdir(),
    format: "png",
    width: 1200,
    height: 1600,
  });

  const imageResult = await converter(1);
  const imagePath = imageResult.path;

  if (!imagePath) throw new Error("Image generation failed for OCR.");

  const result = await Tesseract.recognize(imagePath, "eng");
  return result.data.text || "";
}
