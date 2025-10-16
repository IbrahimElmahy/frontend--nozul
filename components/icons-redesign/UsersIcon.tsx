import React from 'react';
import { IconProps } from '../icons/Icon';

const UsersIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-2.25M15 19.128v-3.863a3.376 3.376 0 0 0-3.375-3.375h-1.5A3.375 3.375 0 0 0 6.75 15.265v3.863m7.5 0a9.337 9.337 0 0 0-4.12-2.25m4.12 2.25c.507 0 1.012-.064 1.504-.187M15 19.128a9.38 9.38 0 0 1-2.625.372 9.337 9.337 0 0 1-4.121-2.25m0 0a9.283 9.283 0 0 1-2.625-2.625m2.625 2.625a9.283 9.283 0 0 0 2.625-2.625m0 0a3.375 3.375 0 0 1 3.375-3.375h1.5a3.375 3.375 0 0 1 3.375 3.375m-7.5 0V6.375A3.375 3.375 0 0 1 9.375 3h1.5A3.375 3.375 0 0 1 14.25 6.375v3.375m-7.5 0h-1.5A3.375 3.375 0 0 0 3.375 12h1.5" />
  </svg>
);

export default UsersIcon;