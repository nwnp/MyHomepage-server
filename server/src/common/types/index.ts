import { Calendar } from '../databases/calendars.entity';
import { Til } from '../databases/tils.entity';

export type FollowsForLogin = {
  following_me: number;
  im_following: number;
};

export type FollowListType = 'followingMe' | 'imFollowing';
export type IteratorType = string[] | Calendar[] | Til[];
