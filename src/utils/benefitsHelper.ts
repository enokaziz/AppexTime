export const calculateTotalBenefits = (benefits: any[]) => {
  return benefits.reduce((total, benefit) => total + benefit.amount, 0);
};

export const formatBenefit = (benefit: any) => {
  return `${benefit.name}: $${benefit.amount.toFixed(2)}`;
};
