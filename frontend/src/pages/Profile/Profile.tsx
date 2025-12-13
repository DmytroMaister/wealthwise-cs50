import type { FC } from 'react';
import type { User } from '../../types/commonTypes';

export const Profile: FC<{ user: User }> = ({ user }) => {
  console.log(user);
  return 'Profile TODO';
};
