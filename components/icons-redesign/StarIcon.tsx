import React from 'react';
import { IconProps } from '../icons/Icon';

const StarIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321 1.004l-4.125 3.633a.563.563 0 0 0-.162.632l1.245 5.353a.563.563 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.245-5.353a.563.563 0 0 0-.162-.632l-4.125-3.633a.563.563 0 0 1 .321-1.004l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
  </svg>
);

export default StarIcon;
