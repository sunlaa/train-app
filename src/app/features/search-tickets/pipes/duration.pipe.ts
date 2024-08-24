import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
  standalone: true,
})
export class DurationPipe implements PipeTransform {
  transform(value: number, onlyMin: boolean = false): string {
    let ms = value;

    const msInMinute = 60000;
    const msInHour = 3600000;
    const msInDay = 86400000;

    const days = Math.floor(ms / msInDay);
    ms %= msInDay;

    const hours = Math.floor(ms / msInHour);
    ms %= msInHour;

    const minutes = Math.floor(ms / msInMinute);

    if (onlyMin) {
      const totalMinutes = Math.floor(value / msInMinute);
      return `${totalMinutes} min`;
    }

    let result = '';
    if (days > 0) {
      result += `${days}d `;
    }
    if (days > 0 || hours > 0) {
      result += `${hours}h `;
    }
    result += `${minutes}m`;

    return result.trim();
  }
}
