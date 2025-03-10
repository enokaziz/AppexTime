export const generateUniqueId = (prefix: string): string => {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 10000);
    return `${prefix}_${timestamp}_${random}`;
};

import QRCode from 'qrcode'; // Assurez-vous d'avoir installé la bibliothèque qrcode

export const generateQRCode = async (text: string): Promise<string> => {
    try {
        const url = await QRCode.toDataURL(text);
        return url;
    } catch (error) {
        console.error('Erreur lors de la génération du code QR:', error);
        throw new Error('Erreur lors de la génération du code QR');
    }
}
