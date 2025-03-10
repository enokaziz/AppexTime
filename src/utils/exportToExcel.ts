import ExcelJS from 'exceljs';

export const exportToExcel = async (data: any[], filename: string) => {
  // Créer un nouveau classeur
  const workbook = new ExcelJS.Workbook();
  // Ajouter une nouvelle feuille de calcul
  const worksheet = workbook.addWorksheet('Sheet1');

  // Ajouter les en-têtes de colonnes
  if (data.length > 0) {
    worksheet.columns = Object.keys(data[0]).map(key => ({ header: key, key }));
  }

  // Ajouter les données
  data.forEach(item => {
    worksheet.addRow(item);
  });

  // Écrire le fichier Excel
  await workbook.xlsx.writeFile(`${filename}.xlsx`);
};