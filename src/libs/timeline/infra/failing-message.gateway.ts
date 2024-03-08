import { MessageGateway } from '@/libs/timeline/models/message.gateway.ts';

export class FailingMessageGateway implements MessageGateway {
  willFailWithMessageError: string;

  constructor(errorMessage: string) {
    this.willFailWithMessageError = errorMessage;
  }

  postMessage(): Promise<void> {
    return Promise.reject(this.willFailWithMessageError);
  }
}
