import { ValueTransformer } from 'typeorm';
import Big from 'big.js';

export class BigTransformer implements ValueTransformer {
  to(value: Big): string {
    return value.toString();
  }
  from(value: string): Big {
    return new Big(value);
  }
} 