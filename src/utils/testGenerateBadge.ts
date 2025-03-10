import { generateBadge } from './generateBadge';
import { Employee } from '../types/index';

console.log('Starting badge generation...');

const employee: Employee = {
  name: 'Dupont',
  firstName: 'Jean',
  phoneNumber: '0612345678',
  photo: 'https://example.com/photo.jpg',
  id: 'JD123456',
  companyInitials: 'AB',
  qrCodeUrl: '',
  uniqueId: ''
};

generateBadge(employee)
  .then((badgePDF) => {
    console.log('Badge PDF generated:', badgePDF);
  })
  .catch((error) => {
    console.error('Generate badge error:', error);
  })
  .finally(() => {
    console.log('Badge generation completed.');
  });
