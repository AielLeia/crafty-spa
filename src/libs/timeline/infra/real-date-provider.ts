import { DateProvider } from '@/libs/timeline/models/date-provider.ts';

export class RealDateProvider implements DateProvider {
  getNow(): Date {
    return new Date();
  }
}
