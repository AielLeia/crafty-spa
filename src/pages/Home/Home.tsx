import { exhaustiveGuard } from '@/libs/common/utils/exhaustive-guard.ts';
import { RootState } from '@/libs/create-store.ts';
import {
  HomeViewModelType,
  selectHomeViewModel,
} from '@/pages/Home/home.viewmodel.ts';
import { Text } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { useSelector } from 'react-redux';

import { PostList } from '@/components/PostList.tsx';
import { TimelineDivider } from '@/components/TimelineDivider.tsx';

export const Home = () => {
  const viewModel = useSelector<
    RootState,
    ReturnType<typeof selectHomeViewModel>
  >((rootState) =>
    selectHomeViewModel(rootState, () => new Date().toISOString())
  );

  const timelineNode: ReactNode = (() => {
    switch (viewModel.timeline.type) {
      case HomeViewModelType.EmptyTimeline:
        return <Text>{viewModel.timeline.info}</Text>;

      case HomeViewModelType.NoTimeline:
        return null;

      case HomeViewModelType.TimelineWithMessages:
        return <PostList messages={viewModel.timeline.messages} />;

      case HomeViewModelType.LoadingTimeline:
        return <Text>{viewModel.timeline.info}</Text>;

      default:
        return exhaustiveGuard(viewModel.timeline);
    }
  })();

  return (
    <>
      <TimelineDivider text="For you" />
      {timelineNode}
    </>
  );
};
