"use client";
import React from 'react';

export function ImageHeader({ appId }: { appId: Number }) {
  return <div
    className='w-full bg-cover bg-center bg-no-repeat lg:h-[620px] h-[310px]'
    style={{
      backgroundImage: `url(https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/library_hero.jpg)`
    }}
  >
    {/* center img */}
    <div className='flex items-center justify-center h-full'>
      <img
        className='w-1/2 hover:opacity-0 transition'
        src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/logo.png`} />
    </div>
  </div>;
}
