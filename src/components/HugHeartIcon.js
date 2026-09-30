'use client';

import Image from 'next/image';

export default function HugHeartIcon({ size = 24, style = {}, className = '' }) {
    return (
        <Image
            src="/heart_icon.png"
            width={size}
            height={size}
            alt="Heart"
            className={className}
            style={{
                objectFit: 'contain',
                display: 'inline-block',
                verticalAlign: 'middle',
                ...style
            }}
        />
    );
}
