import { generatePDF } from '../utils/exportToPDF';
import { Employee } from '../types/index';

console.log('Starting badge generation...');

export const generateBadge = async (employee: Employee) => {
  console.log('Generating badge content...');
  const badgeContent = `Nom: ${employee.name}\nPrénom: ${employee.firstName}\nTéléphone: ${employee.phoneNumber}\nPhoto: ${employee.photo}\nInitials de l'entreprise: ${employee.companyInitials}`;
  console.log('Badge content:', badgeContent);

  console.log('Generating PDF...');
  try {
    const badgePDF = await generatePDF(badgeContent, 'badge');
    console.log('PDF generated:', badgePDF);
    return badgePDF;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

console.log('Badge generation completed.');
