export const getPageNumbers = (
  current: number,
  total: number,
): (number | 'ellipsis')[] => {
  const out: (number | 'ellipsis')[] = [];
  const maxVisible = 5;

  if (total <= maxVisible + 2) {
    for (let i = 1; i <= total; i++) out.push(i);
    return out;
  }

  const addRange = (from: number, to: number) => {
    for (let i = from; i <= to; i++) out.push(i);
  };

  const showLeft = Math.max(2, current - 1);
  const showRight = Math.min(total - 1, current + 1);

  out.push(1);
  if (showLeft > 2) out.push('ellipsis');
  addRange(showLeft, showRight);
  if (showRight < total - 1) out.push('ellipsis');
  out.push(total);

  return out;
};

export const handlePrevious = (current: number, cb: (p: number) => void) =>
  current > 1 && cb(current - 1);

export const handleNext = (
  current: number,
  total: number,
  cb: (p: number) => void,
) => current < total && cb(current + 1);
