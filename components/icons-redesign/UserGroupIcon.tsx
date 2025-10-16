import React from 'react';
import { IconProps } from '../icons/Icon';

const UserGroupIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.962c.57-1.007 1.255-1.503 2.007-1.828a4.5 4.5 0 0 1 5.334 0c.752.325 1.437.821 2.007 1.828m-9.344 0a4.5 4.5 0 0 1-5.334 0c-.752-.325-1.437-.821-2.007-1.828M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-12 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);

export default UserGroupIcon;