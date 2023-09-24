// Price Formatter utility function
export const formatPrice = (price: string) => {
  return Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
  }).format(parseInt(price, 10));
};
