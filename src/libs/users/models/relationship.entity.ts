import { createEntityAdapter } from '@reduxjs/toolkit';

export type Relationship = {
  user: string;
  follow: string;
};

export const relationshipAdapter = createEntityAdapter<Relationship, string>({
  selectId: (r: Relationship) => `${r.user}->${r.follow}`,
});
