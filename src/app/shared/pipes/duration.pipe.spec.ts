import { DurationPipe } from './duration.pipe';

describe('DurationPipe', () => {
  let pipe: DurationPipe;

  beforeEach(() => {
    pipe = new DurationPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform milliseconds to "dhm" format', () => {
    // 2 days, 3 hours, 25 minutes
    const result = pipe.transform(
      2 * 86400000 + 3 * 3600000 + 25 * 60000,
      'dhm',
    );
    expect(result).toBe('2d 3h 25m');
  });

  it('should transform milliseconds to "hm" format', () => {
    // 5 hours, 10 minutes
    const result = pipe.transform(5 * 3600000 + 10 * 60000, 'hm');
    expect(result).toBe('5h 10m');
  });

  it('should transform milliseconds to "m" format', () => {
    // 120 minutes
    const result = pipe.transform(120 * 60000, 'm');
    expect(result).toBe('120m');
  });

  it('should handle zero value correctly', () => {
    const result = pipe.transform(0, 'dhm');
    expect(result).toBe('0m');
  });
});
