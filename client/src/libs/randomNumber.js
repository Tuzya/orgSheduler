export const GenerateRandomNumbers = (max) => {
  let orderNumbers = new Set();
  for (let i = 1; orderNumbers.size < max; i++)
    orderNumbers.add(Math.floor(Math.random() * max + 1));
  return [...orderNumbers];
};
