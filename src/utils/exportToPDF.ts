import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as FileSystem from 'expo-file-system';

export const generatePDF = async (content: string, filename: string) => {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const pages = pdfDoc.addPage();
  const { width, height } = pages.getSize();
  const lines = content.split('\n');

  let y = height - 50;
  for (const line of lines) {
    pages.drawText(line, {
      x: 50,
      y,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });
    y -= 20;
  }

  const pdfBytes = await pdfDoc.save();
  const pdfBase64 = Buffer.from(pdfBytes).toString('base64');

  const filePath = `${FileSystem.documentDirectory}${filename}.pdf`;
  try {
    await FileSystem.writeAsStringAsync(filePath, pdfBase64, { encoding: FileSystem.EncodingType.Base64 });
    console.log('PDF saved to:', filePath);
    return filePath;
  } catch (error) {
    console.error('Error writing PDF file:', error);
    throw error;
  }
};
