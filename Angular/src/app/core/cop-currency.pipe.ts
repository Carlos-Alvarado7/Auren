import { Pipe, PipeTransform } from '@angular/core';
import { formatCop } from './format-cop.util';

@Pipe({
  name: 'copCurrency',
  standalone: true
})
export class CopCurrencyPipe implements PipeTransform {
  transform(value: number): string {
    return formatCop(value);
  }
}

