export function formatPrice(
  value: number,
  options?: {
    currency?: string;
    showSymbol?: boolean;
  }
): string {
  const { currency = "uzs", showSymbol = true } = options ?? {};

  const formatted = value
    .toFixed(0)
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  return showSymbol ? `${formatted} ${currency}` : formatted;
}