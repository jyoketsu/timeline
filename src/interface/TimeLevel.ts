export default interface TimeLevel {
  name: string;
  dateUnit: 'year' | 'month' | 'day' | 'hour';
  amount: number;
  // 能被keyDate个dateUnit整除，则为keyDate
  keyDate: number;
}
