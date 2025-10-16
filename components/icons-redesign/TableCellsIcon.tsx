import React from 'react';
import { IconProps } from '../icons/Icon';

const TableCellsIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 6.75h17.25M3.375 12h17.25m-17.25 5.25h17.25M5.625 6.75v10.5m4.5-10.5v10.5m4.5-10.5v10.5m4.5-10.5v10.5" />
    </svg>
);

export default TableCellsIcon;