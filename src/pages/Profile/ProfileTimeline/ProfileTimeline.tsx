import { useParams } from 'react-router-dom';

import { Timeline } from '@/components/Timeline.tsx';

export const ProfileTimeline = () => {
  const params = useParams();
  const userId = params.userId as string;

  return <Timeline userId={userId} />;
};
