import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
  standalone: true,
})
export class DurationPipe implements PipeTransform {
  transform(value: number, format: 'dhm' | 'hm' | 'm' = 'dhm'): string {
    const msInMinute = 60000;
    const msInHour = 3600000;
    const msInDay = 86400000;

    const days = Math.floor(value / msInDay);
    const hours = Math.floor((value % msInDay) / msInHour);
    const minutes = Math.floor((value % msInHour) / msInMinute);

    let result = '';

    switch (format) {
      case 'dhm': {
        if (days > 0) {
          result += `${days}d `;
        }
        if (days > 0 || hours > 0) {
          result += `${hours}h `;
        }
        if (days > 0 || hours > 0 || minutes > 0) {
          result += `${minutes}m`;
        }
        break;
      }
      case 'hm': {
        const totalHours = Math.floor(value / msInHour);
        const remainingMinutes = Math.floor((value % msInHour) / msInMinute);

        if (totalHours > 0) {
          result += `${totalHours}h `;
        }
        if (totalHours > 0 || remainingMinutes > 0) {
          result += `${remainingMinutes}m`;
        }
        break;
      }

      case 'm': {
        const totalMinutes = Math.floor(value / msInMinute);
        result = `${totalMinutes}m`;
        break;
      }
      default:
        result = 'Invalid format';
        break;
    }

    return result.trim();
  }
}
