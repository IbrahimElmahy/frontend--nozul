
import React from 'react';
import { IconProps } from '../icons/Icon';

const TagIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a22.53 22.53 0 0 0 6.5-6.5l.33-2.606a2.25 2.25 0 0 0-.265-1.6 21.979 21.979 0 0 0-1.316-2.192l-.643-.857a2.25 2.25 0 0 0-1.394-.806l-4.318-.492a2.25 2.25 0 0 0-1.591.659Z" />
    </svg>
);

export default TagIcon;
