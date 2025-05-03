"use client"
import React, { useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Podcast } from '../types';
import PodcastCard from './ui/PodcastCard';

interface PodcastListProps {
  podcasts: Podcast[];
  onToggleSelection: (id: string,selected:boolean) => void;
  isLoading?: boolean;
}

export default function PodcastList({
  podcasts,
  onToggleSelection,
  isLoading = false
}: PodcastListProps) {
  const parentRef = React.useRef<HTMLDivElement>(null);

  // Set up virtualizer
  const rowVirtualizer = useVirtualizer({
    count: isLoading ? 10 : podcasts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => 88, []), // Approximate height of PodcastCard (16px padding top/bottom + 16px image height + some text)
    overscan: 5,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4 p-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse flex items-center p-4">
            <div className="w-16 h-16 bg-gray-200 rounded-md mr-4"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="w-20 h-8 bg-gray-200 rounded-full"></div>
          </div>
        ))}
    </div>
    )
  }


  return (
    <div 
      ref={parentRef} 
      className="overflow-auto pb-20"
      style={{ height: 'calc(100vh - 150px)' }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const podcast = podcasts[virtualRow.index];
          return (
            <div
              key={podcast._id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <PodcastCard 
                podcast={podcast}
                onToggleSelection={onToggleSelection} 
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}