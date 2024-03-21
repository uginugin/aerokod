export const formatToSplitedDigitWithComma = (str: string, afterCommaAmount: number = 0) => {
  // Разделение строки на целую и дробную части по запятой.
  const parts = str.replace(/(,.*),/, '$1').split(',');

  if (parts[1]) {
    parts[1] = parts[1].slice(0, afterCommaAmount);
  }

  // Форматирование только целой части числа с разделением каждых трех цифр пробелами.
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  // разрешаем оставлять запятую в input'е
  return {
    text: afterCommaAmount ? parts.join(',') : parts[0],
    numeric: parts[1]
      ? Number(parts.join(',').replaceAll(' ', '').replace(',', '.'))
      : Number(parts[0].replaceAll(' ', '')),
  };
};
