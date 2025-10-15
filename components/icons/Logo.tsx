import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = 'w-24' }) => (
    <svg viewBox="0 0 70 50" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M0 50V10L10 0H20V50H0Z" fill="#3B82F6"/>
        <path d="M20 20L35 5L50 20V30L35 15L20 30V20Z" fill="#3B82F6"/>
        <path d="M50 50V0L60 10V50H50Z" fill="#3B82F6"/>
    </svg>
);

export default Logo;