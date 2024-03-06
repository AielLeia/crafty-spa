import { DateProvider } from '@/libs/timeline/models/date-provider.ts';

export class StubDateProvider implements DateProvider {
  now!: Date;

  getNow(): Date {
    return this.now;
  }
}
