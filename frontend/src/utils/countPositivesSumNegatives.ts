export function countPositivesSumNegatives(input: number[] | null): number[] {
  if (!input || input.length === 0) {
    return [0, 0];
  }

  const positiveCount = input.filter((a: number) => a > 0).length;
  const sumOfNegatives = input
    .filter((d: number) => d < 0)
    .reduce((e: number, f: number) => e + f, 0);

  return [positiveCount, sumOfNegatives];
}
