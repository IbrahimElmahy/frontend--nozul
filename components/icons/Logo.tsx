import React from 'react';
import logoLight from '../../images/logo-light.png';
import logoDark from '../../images/logo-dark.png';

interface LogoProps {
    className?: string;
    variant?: 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ className = 'w-24', variant = 'dark' }) => {
    const src = variant === 'light' ? logoLight : logoDark;
    return <img src={src} alt="Nozulkum Logo" className={className} />;
};

export default Logo;
