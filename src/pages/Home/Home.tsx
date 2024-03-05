import { selectAuthUser } from '@/libs/auth/reducer.ts';
import { useSelector } from 'react-redux';

import { Timeline } from '@/components/Timeline.tsx';
import { TimelineDivider } from '@/components/TimelineDivider.tsx';

export const Home = () => {
  const authUser = useSelector(selectAuthUser);

  return (
    <>
      <TimelineDivider text="For you" />
      <Timeline userId={authUser} />
    </>
  );
};
