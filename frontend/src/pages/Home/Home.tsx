import type { FC } from 'react';
import type { User } from '../../types/commonTypes';

export const Home: FC<{ user: User }> = ({ user }) => {
  console.log(user);
  return <div>Home</div>;
};
