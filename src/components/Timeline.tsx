import { exhaustiveGuard } from '@/libs/common/utils/exhaustive-guard.ts';
import {
  ProfileTimelineViewModelType,
  selectProfileTimelineViewModel,
} from '@/pages/Profile/ProfileTimeline/profile-timeline.viewmodel.ts';
import { Text } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { useSelector } from 'react-redux';

import { PostList } from '@/components/PostList.tsx';

type TimelineProps = {
  userId: string;
};

export const Timeline = ({ userId }: TimelineProps) => {
  const viewModel = useSelector(
    selectProfileTimelineViewModel({
      userId,
      getNow: () => new Date().toISOString(),
    })
  );

  const timelineNode: ReactNode = (() => {
    switch (viewModel.timeline.type) {
      case ProfileTimelineViewModelType.EmptyTimeline:
        return <Text>{viewModel.timeline.info}</Text>;

      case ProfileTimelineViewModelType.NoTimeline:
        return null;

      case ProfileTimelineViewModelType.TimelineWithMessages:
        return <PostList messages={viewModel.timeline.messages} />;

      case ProfileTimelineViewModelType.LoadingTimeline:
        return <Text>{viewModel.timeline.info}</Text>;

      default:
        return exhaustiveGuard(viewModel.timeline);
    }
  })();

  return timelineNode;
};
