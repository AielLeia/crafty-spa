import {
  MessageGateway,
  PostMessageBody,
} from '@/libs/timeline/models/message.gateway.ts';

export class FakeMessageGateway implements MessageGateway {
  lastPostedMessage!: PostMessageBody;

  postMessage(messageBody: PostMessageBody): Promise<void> {
    this.lastPostedMessage = messageBody;

    return Promise.resolve();
  }
}
