import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = 'w-24' }) => (
  <img
    src="/images/logo-light.png"
    alt="Nuzulcom Logo"
    className={className}
    loading="lazy"
  />
);

export default Logo;