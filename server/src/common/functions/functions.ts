import { Calendar } from '../databases/calendars.entity';
import { Post } from '../databases/posts.entity';

export const map = (cb, iter: string[] | Calendar[]): string[] => {
  const result = [];
  for (const it of iter) {
    result.push(cb(it));
  }
  return result;
};

export const returnDate = async (data: Calendar[]): Promise<Calendar[]> => {
  const parsingData = map(
    (p: Date) => p.toISOString().replace(/T/, ' '),
    map(
      (p: Calendar) => p.createdAt,
      data.filter((p) => p.createdAt),
    ),
  );
  const result = [];

  for (let i = 0; i < data.length; i++) {
    const tempDate = new Date(parsingData[i]);
    result.push({
      ...data[i],
      createdAt: new Date(tempDate.setHours(tempDate.getHours() + 9))
        .toISOString()
        .replace(/T/, ' '),
    });
  }
  return result;
};
