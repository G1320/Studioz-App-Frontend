import { describe, expect, it } from 'vitest';
import { getMessageSenderId, getMessageSenderName, isGuestMessage } from '../messageCue';
import type { ProjectMessage } from 'src/types';

const base: ProjectMessage = {
  _id: 'm1',
  projectId: 'p1',
  senderRole: 'customer',
  message: 'hi'
};

describe('message sender helpers', () => {
  it('uses the account for member messages', () => {
    const msg = { ...base, senderId: { _id: 'u1', name: ' Dana ' } };
    expect(getMessageSenderId(msg)).toBe('u1');
    expect(getMessageSenderName(msg)).toBe('Dana');
    expect(isGuestMessage(msg)).toBe(false);
  });

  it('keys share-link guests by link and typed name', () => {
    const msg: ProjectMessage = {
      ...base,
      senderId: null,
      senderRole: 'customer_guest',
      guestName: 'Label A&R',
      shareLinkId: 'l1'
    };
    expect(getMessageSenderId(msg)).toBe('guest:l1:Label A&R');
    expect(getMessageSenderName(msg)).toBe('Label A&R');
    expect(isGuestMessage(msg)).toBe(true);
  });

  it('returns null when there is no name to show', () => {
    expect(getMessageSenderName({ ...base, senderId: 'u2' })).toBeNull();
  });
});
