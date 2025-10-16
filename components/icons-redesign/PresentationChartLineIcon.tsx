import React from 'react';
import { IconProps } from '../icons/Icon';

const PresentationChartLineIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h12A2.25 2.25 0 0 0 20.25 14.25V3.75m-16.5 0h16.5M12 9.75l3 3m0 0-3 3m3-3h-6m6 0-3 3" />
  </svg>
);

export default PresentationChartLineIcon;