import {
  ProfileFollowersViewModelType,
  createProfileFollowersViewModel,
} from './profile-followers.viewmodel';
import { exhaustiveGuard } from '@/libs/common/utils/exhaustive-guard.ts';
import { Button, Center } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import {
  LoadingRelationshipGrid,
  RelationshipGrid,
} from '@/components/profile/RelationshipGrid.tsx';

export const ProfileFollowers = () => {
  const { userId } = useParams() as { userId: string };
  const viewModel = useSelector(
    createProfileFollowersViewModel({ of: userId })
  );

  switch (viewModel.type) {
    case ProfileFollowersViewModelType.ProfileFollowersLoading:
      return <LoadingRelationshipGrid />;
    case ProfileFollowersViewModelType.ProfileFollowersLoaded:
      return (
        <>
          <RelationshipGrid relationshipCards={viewModel.followers} />
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
