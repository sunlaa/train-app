import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
  standalone: true,
})
export class DuarationPipe implements PipeTransform {
  transform(value: number): string {
    let ms = value;

    const msInMinute = 60000;
    const msInHour = 3600000;
    const msInDay = 86400000;

    const days = Math.floor(ms / msInDay);
    ms %= msInDay;

    const hours = Math.floor(ms / msInHour);
    ms %= msInHour;

    const minutes = Math.floor(ms / msInMinute);

    let result = '';
    if (days > 0) {
      result += `${days}d `;
    }
    result += `${hours}h `;
    result += `${minutes}m`;

    return result.trim();
  }
}
