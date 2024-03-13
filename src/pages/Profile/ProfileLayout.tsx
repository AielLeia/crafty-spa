import { RootState } from '@/libs/create-store.ts';
import { User } from '@/libs/users/models/user.entity.ts';
import { selectUser } from '@/libs/users/slices/user.slice.ts';
import { Box, Heading, TabList, Tabs } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';

import { CardContent } from '@/components/profile/CardContent';
import { CardWithAvatar } from '@/components/profile/CardWithAvatar';
import { NavTab } from '@/components/profile/NavTab';

export const ProfileLayout = () => {
  const params = useParams();
  const userId = params.userId as string;
  const user = useSelector<RootState, User>((state) =>
    selectUser(userId, state)
  );

  if (!user) return null;

  return (
    <>
      <Box as="section" pt="20" pb="12" position="relative">
        <Box position="absolute" inset="0" height="32" bg="blue.600" />
        <CardWithAvatar
          maxW="xl"
          avatarProps={{
            src: userId,
            name: userId,
            uploading: false,
          }}
        >
          <CardContent>
            <Heading size="lg" fontWeight="extrabold" letterSpacing="tight">
              {user.username}
            </Heading>
          </CardContent>
        </CardWithAvatar>
      </Box>
      <Tabs size="lg">
        <TabList>
          <NavTab to={`/u/${userId}`}>Timeline</NavTab>
          <NavTab to={`/u/${userId}/following`}>
            Following ({user?.followingCount ?? 0})
          </NavTab>
          <NavTab to={`/u/${userId}/followers`}>
            Followers ({user?.followersCount ?? 0})
          </NavTab>
        </TabList>
      </Tabs>

      <Outlet />
    </>
  );
};
