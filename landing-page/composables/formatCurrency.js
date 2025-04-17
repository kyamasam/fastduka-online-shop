export function formatCurrency(amount = 0) {
  return amount?.toLocaleString("en-US", {
    style: "currency",
    currency: "KES",
  });
}
