import { Calendar } from '../databases/calendars.entity';

export const map = (cb, iter: string[] | Calendar[]): string[] => {
  const result = [];
  for (const it of iter) {
    result.push(cb(it));
  }
  return result;
};

export const returnDate = async (data: Calendar[]): Promise<Calendar[]> => {
  const parsingData = map(
    (p: Date) => p.toISOString().replace(/T/, ' ').split('.')[0],
    map(
      (p: Calendar) => p.createdAt,
      data.filter((p) => p.createdAt),
    ),
  );
  const result = [];
  for (let i = 0; i < data.length; i++) {
    result.push({
      ...data[i],
      createdAt: parsingData[i],
    });
  }
  return result;
};
