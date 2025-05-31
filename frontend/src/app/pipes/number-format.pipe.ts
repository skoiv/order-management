import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat',
  standalone: true,
})
export class NumberFormatPipe implements PipeTransform {
  transform(value: string | number): string {
    if (value === null || value === undefined || value === '') {
      return '';
    }

    // Convert to string and ensure we're using dot as decimal separator
    const numStr = value.toString().replace(',', '.');
    const num = parseFloat(numStr);

    if (isNaN(num)) {
      return '';
    }

    // Format with 2 decimal places
    const parts = num.toFixed(2).split('.');

    // Add thousand separators (spaces)
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    // Join with comma as decimal separator
    return parts.join(',');
  }
}
