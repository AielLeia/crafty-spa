import {
  StatebuilderProvider,
  stateBuilderProvider,
} from '@/libs/state-builder.ts';

export const createAuthFixture = ({
  builderProvider = stateBuilderProvider(),
}: {
  builderProvider: StatebuilderProvider;
}) => {
  return {
    givenAuthenticatedUserIs(authUser: string) {
      builderProvider.setState((builder) => builder.withAuthUser(authUser));
    },
  };
};

export type AuthFixture = ReturnType<typeof createAuthFixture>;
