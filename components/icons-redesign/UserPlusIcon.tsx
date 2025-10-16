import React from 'react';
import { IconProps } from '../icons/Icon';

const UserPlusIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3.375 19.5a5.25 5.25 0 0 1 10.5 0v.003c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125V19.5a5.25 5.25 0 0 1-10.5 0v-.003c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v.003Z" />
    </svg>
);

export default UserPlusIcon;