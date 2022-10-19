export const count_true = (arr: (boolean | null)[]) => {
  return arr
    .map((x) => (x ? (1 as number) : (0 as number)))
    .reduce((prev, curr) => (prev + curr) as number);
};
