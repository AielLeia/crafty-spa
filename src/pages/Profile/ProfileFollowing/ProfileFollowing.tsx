import { exhaustiveGuard } from '@/libs/common/utils/exhaustive-guard.ts';
import {
  createProfileFollowingViewModel,
  ProfileFollowingViewModelType,
} from '@/pages/Profile/ProfileFollowing/profile-following.viewmodel.ts';
import { Button, Center } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import {
  LoadingRelationshipGrid,
  RelationshipGrid,
} from '@/components/profile/RelationshipGrid.tsx';

export const ProfileFollowing = () => {
  const { userId } = useParams() as { userId: string };
  const viewModel = useSelector(
    createProfileFollowingViewModel({ of: userId })
  );

  switch (viewModel.type) {
    case ProfileFollowingViewModelType.ProfileFollowingLoading:
      return <LoadingRelationshipGrid />;
    case ProfileFollowingViewModelType.ProfileFollowingLoaded:
      return (
        <>
          <RelationshipGrid relationshipCards={viewModel.following} />
          <Center>
            <Button mb={10} colorScheme="twitter">
              Voir plus
            </Button>
          </Center>
        </>
      );
    default:
      return exhaustiveGuard(viewModel);
  }
};
