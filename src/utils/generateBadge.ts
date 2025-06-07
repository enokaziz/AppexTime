import { generatePDF } from './exportToPDF';
import { Employee, BadgeDesign, BadgeFormat } from '../types/index';
import * as FileSystem from 'expo-file-system';
import { generateQRCode } from './qrCodeGenerator';
import { generateUniqueId } from './helpers';

console.log('Starting badge generation...');

export const generateBadge = async (
  employee: Employee,
  design?: BadgeDesign,
  format: BadgeFormat = 'PDF',
): Promise<string> => {
  console.log('Generating badge content...');

  // Validation des données
  if (!employee.name || !employee.firstName) {
    throw new Error('Le nom et le prénom sont requis');
  }
  if (!employee.phoneNumber) {
    throw new Error('Le numéro de téléphone est requis');
  }

  // Génération du QR code
  const qrCode = await generateQRCode(
    JSON.stringify({
      employeeId: employee.id,
      name: employee.name,
      firstName: employee.firstName,
      companyInitials: employee.companyInitials,
      timestamp: new Date().toISOString(),
    }),
  );

  // Création du contenu du badge
  const badgeContent = {
    name: employee.name,
    firstName: employee.firstName,
    phoneNumber: employee.phoneNumber,
    photo: employee.photo,
    companyInitials: employee.companyInitials,
    qrCode,
    design: design || {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      borderColor: '#000000',
      borderWidth: 2,
      borderRadius: 10,
      fontFamily: 'System',
      fontSize: 16,
    },
  };

  console.log('Badge content:', badgeContent);

  try {
    let badgeFile: string;

    switch (format) {
      case 'PDF':
        badgeFile = await generatePDF(JSON.stringify(badgeContent), 'badge');
        break;
      case 'PNG':
      case 'JPG':
      case 'SVG':
        const uniqueId = generateUniqueId('Badge_');
        const badgePath = `${
          FileSystem.documentDirectory
        }badges/${uniqueId}.${format.toLowerCase()}`;
        // Ici, vous pouvez ajouter la logique pour générer l'image dans le format souhaité
        badgeFile = badgePath;
        break;
      default:
        throw new Error('Format non supporté');
    }

    console.log('Badge generated:', badgeFile);
    return badgeFile;
  } catch (error) {
    console.error('Error generating badge:', error);
    throw error;
  }
};

console.log('Badge generation completed.');
