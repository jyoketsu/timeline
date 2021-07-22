export default interface TimeLevel {
  name: string;
  dateUnit: 'year' | 'month' | 'day' | 'hour';
  amount: number;
}
