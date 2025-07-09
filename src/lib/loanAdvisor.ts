// src/lib/loanAdvisor.ts

export interface EMIInfo {
  amount: number;
  interestRate: number;
  durationMonths: number;
}

export const BANK_OFFERS = [
  { provider: "HDFC Flexi Loan", interestRate: 11.5, durationMonths: 24 },
  { provider: "Bajaj Finserv", interestRate: 12.0, durationMonths: 18 },
  { provider: "Cred Refinance", interestRate: 10.8, durationMonths: 36 },
];


export interface LoanOffer {
  provider: string;
  interestRate: number;
  durationMonths: number;
}

export interface Recommendation {
  originalAmount: number;
  originalEMI: number;
  newEMI: number;
  newProvider: string;
  savingsPerMonth: number;
  savingsTotal: number;
}

export function calculateEMI(p: number, r: number, n: number): number {
  const monthlyRate = r / (12 * 100);
  return Math.round((p * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1));
}

export function compareLoanOffers(
  currentLoan: EMIInfo,
  offers: LoanOffer[]
): Recommendation[] {
  const currentEMI = calculateEMI(currentLoan.amount, currentLoan.interestRate, currentLoan.durationMonths);

  return offers.map((offer) => {
    const newEMI = calculateEMI(currentLoan.amount, offer.interestRate, offer.durationMonths);
    const savingsPerMonth = currentEMI - newEMI;
    const savingsTotal = savingsPerMonth * offer.durationMonths;

    return {
      originalAmount: currentLoan.amount,
      originalEMI: currentEMI,
      newEMI,
      newProvider: offer.provider,
      savingsPerMonth,
      savingsTotal,
    };
  }).filter(r => r.savingsPerMonth > 0);
}
