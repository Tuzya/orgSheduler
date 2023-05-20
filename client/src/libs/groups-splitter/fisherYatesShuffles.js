export default function fisherYatesShuffle(initPermutation) {
  const permutation = [...initPermutation];
  const n = permutation.length;
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [permutation[i], permutation[j]] = [permutation[j], permutation[i]];
  }
  return permutation;
}
