import React from 'react';
import { IconProps } from '../icons/Icon';

const PrinterIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6 18.25m.72-4.421c.24.03.48.062.72.096m10.56 0c.24-.03.48-.062.72-.096m-.72.096L18 18.25m-9.56-4.421c.24.03.48.062.72.096M12 10.5c-1.105 0-2.006.895-2.006 2.006s.895 2.006 2.006 2.006c1.105 0 2.006-.895 2.006-2.006S13.105 10.5 12 10.5Zm0 0V6.25m0 0a2.006 2.006 0 0 0-2.006 2.006v1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.25h-9a2.25 2.25 0 0 0-2.25 2.25v.875a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-.875a2.25 2.25 0 0 0-2.25-2.25Z" />
    </svg>
);

export default PrinterIcon;
