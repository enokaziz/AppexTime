import QRCode from 'react-native-qrcode-svg';
import * as FileSystem from 'expo-file-system';
import { generateUniqueId } from './helpers';

console.log('Starting QR code generation...');

export const generateQRCode = async (id: string): Promise<string> => {
  console.log('Generating QR code...');
  const qrCode = new QRCode({
    value: id,
    size: 200,
    color: '#000',
    backgroundColor: '#fff',
  });

  const uniqueId = generateUniqueId('QRCode_');
  const qrCodePath = `${FileSystem.documentDirectory}qrcodes/${uniqueId}.svg`;

  console.log('Converting QR code to data URL...');
  const qrCodeImage = await new Promise<string>((resolve, reject) => {
    qrCode.toDataURL((dataUrl: string) => {
      resolve(dataUrl);
    });
  });

  console.log('Writing QR code to file...');
  try {
    await FileSystem.writeAsStringAsync(qrCodePath, qrCodeImage, { encoding: FileSystem.EncodingType.Base64 });
    console.log('QR code generated:', qrCodePath);
    return qrCodePath;
  } catch (error) {
    console.error('Error writing QR code to file:', error);
    throw error;
  }
};

export const generateQRCodeImage = async (id: string): Promise<string> => {
  console.log('Generating QR code image...');
  const qrCode = new QRCode({
    value: id,
    size: 200,
    color: '#000',
    backgroundColor: '#fff',
  });

  const uniqueId = generateUniqueId('QRCode_');
  const qrCodePath = `${FileSystem.documentDirectory}qrcodes/${uniqueId}.png`;

  console.log('Converting QR code to data URL...');
  const qrCodeImage = await new Promise<string>((resolve, reject) => {
    qrCode.toDataURL((dataUrl: string) => {
      resolve(dataUrl);
    });
  });

  console.log('Writing QR code to file...');
  try {
    await FileSystem.writeAsStringAsync(qrCodePath, qrCodeImage, { encoding: FileSystem.EncodingType.Base64 });
    console.log('QR code image generated:', qrCodePath);
    return qrCodePath;
  } catch (error) {
    console.error('Error writing QR code image to file:', error);
    throw error;
  }
};

console.log('QR code generation completed.');
