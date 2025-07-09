export function parseTextToTransactions(text: string) {
  const lines = text.split("\n").filter((line) => line.trim() !== "");
  const transactions = [];

  for (const line of lines) {
    const dateMatch = line.match(/\d{2}[-/]\d{2}[-/]\d{4}/);
    const amountMatch = line.match(/[\d,]+\.\d{2}/);
    if (dateMatch && amountMatch) {
      transactions.push({
        date: dateMatch[0],
        amount: parseFloat(amountMatch[0].replace(/,/g, "")),
        narration: line.replace(dateMatch[0], "").replace(amountMatch[0], "").trim(),
      });
    }
  }

  return transactions;
}
