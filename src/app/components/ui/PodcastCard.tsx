import React from 'react';
import Image from 'next/image';
import { Podcast } from '../../types';
import { Button } from '@heroui/button';

interface PodcastCardProps {
  podcast: Podcast;
  deletable: boolean;
  onToggleSelection: (id: string,selected:boolean) => void;
}

export default function PodcastCard({
  podcast,
  deletable,
  onToggleSelection,
}: PodcastCardProps) {
  const handleSubscribe = () => {
    onToggleSelection(podcast._id,podcast.isSelected || false);
  };

  return (
    <div className="flex items-center p-4">
      <div className="w-16 h-16 mr-4 relative flex-shrink-0 rounded-md overflow-hidden">
        <Image
          src={podcast.img || ''}
          alt={podcast.name}
          fill
          sizes='sm'
          className="object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex-grow min-w-0">
        <h3 className="text-gray-900 truncate font-bold">{podcast.name}</h3>
        <p className="text-sm text-gray-500 truncate">{podcast.uNm}</p>
      </div>
      <div className="ml-2">
        <Button
          className='bg-gray-200 rounded-full font-medium py-1 cursor-pointer'
          onPress={handleSubscribe}
        >{podcast.isSelected ? "Selected" : "Subscribe"}</Button>
      </div>
    </div>
  );
}