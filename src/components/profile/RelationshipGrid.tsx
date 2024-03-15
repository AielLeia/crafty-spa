import { Center, SimpleGrid, SkeletonText } from '@chakra-ui/react';

import { LoadingCardWithAvatar } from '@/components/profile/CardWithAvatar.tsx';
import { RelationshipCard } from '@/components/profile/RelationshipCard/RelationshipCard.tsx';

export const LoadingRelationshipGrid = () => {
  return (
    <SimpleGrid
      columns={{ base: 1, md: 3, lg: 3, xl: 5 }}
      spacing="6"
      mt={10}
      mb={5}
    >
      {new Array(20).fill(null).map((_, i) => {
        return (
          <LoadingCardWithAvatar key={i}>
            <Center>
              <SkeletonText>Some username</SkeletonText>
            </Center>
          </LoadingCardWithAvatar>
        );
      })}
    </SimpleGrid>
  );
};

export const RelationshipGrid = ({
  relationshipCards,
}: {
  relationshipCards: {
    id: string;
    username: string;
    profilePicture: string;
    link: string;
    followersCount: number;
    isFollowedByAuthUser: boolean;
  }[];
}) => {
  return (
    <SimpleGrid
      columns={{ base: 1, md: 3, lg: 3, xl: 5 }}
      spacing="6"
      mt={10}
      mb={5}
    >
      {relationshipCards.map((user) => (
        <RelationshipCard key={user.id} {...user} />
      ))}
    </SimpleGrid>
  );
};
