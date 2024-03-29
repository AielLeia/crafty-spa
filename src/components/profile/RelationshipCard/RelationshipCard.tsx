import { CardWithAvatar } from './CardWithAvatar';
import { FollowersCount } from './FollowersCount';
import { UserInfo } from './UserInfo';
import { AppDispatch } from '@/libs/create-store.ts';
import { followUser } from '@/libs/users/usecases/follow-user.usecase.ts';
import { unfollowUser } from '@/libs/users/usecases/unfollow-user.usecase.ts';
import { Button, HStack, useMultiStyleConfig } from '@chakra-ui/react';
import { HiOutlineUserPlus } from 'react-icons/hi2';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

export const RelationshipCard = (user: {
  id: string;
  username: string;
  profilePicture: string;
  isFollowedByAuthUser: boolean;
  followersCount: number;
  link: string;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const buttonProps = {
    variant: 'outline',
    colorScheme: 'blue',
    rounded: 'full',
    size: 'sm',
    width: 'full',
  };
  const buttonStyles = useMultiStyleConfig('Button', buttonProps);

  const handleFollowUser = () => {
    dispatch(followUser({ followingId: user.id }));
  };

  const handleUnfollowUser = () => {
    dispatch(unfollowUser({ followingId: user.id }));
  };

  return (
    <CardWithAvatar
      key={user.id}
      avatarProps={{ src: user.profilePicture, name: user.username }}
    >
      <UserInfo mt="3" name={user.username} />
      <FollowersCount my="4" count={user.followersCount} />
      <HStack spacing={5}>
        <Link to={user.link}>
          <Button {...buttonProps}>View Profile</Button>
        </Link>
        {user.isFollowedByAuthUser ? (
          <Button
            {...buttonProps}
            colorScheme="black"
            _after={{
              content: "'Following'",
            }}
            _hover={{
              ...buttonStyles._hover,
              bg: 'red.50',
              borderColor: 'red.100',
              textColor: 'red.500',
              _after: {
                content: "'Unfollow'",
              },
            }}
            onClick={handleUnfollowUser}
          />
        ) : (
          <Button
            {...buttonProps}
            leftIcon={<HiOutlineUserPlus />}
            onClick={handleFollowUser}
          >
            Follow
          </Button>
        )}
      </HStack>
    </CardWithAvatar>
  );
};
