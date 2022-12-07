import { Calendar } from '../databases/calendars.entity';
import { Til } from '../databases/tils.entity';
import { IteratorType } from '../types';

export const map = (cb, iter: IteratorType): string[] => {
  const result = [];
  for (const it of iter) {
    result.push(cb(it));
  }
  return result;
};

export const returnDate = async (data: Calendar[] | Til[]) => {
  const parsingData = map(
    (p: Date) => p.toISOString().replace(/T/, ' '),
    map((p: Calendar) => p.createdAt, data),
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
