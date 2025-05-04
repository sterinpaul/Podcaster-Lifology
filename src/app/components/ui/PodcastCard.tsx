import React, { useState } from "react";
import Image from "next/image";
import { Podcast } from "../../types";
import { Button } from "@heroui/button";

interface PodcastCardProps {
  podcast: Podcast;
  deletable?: boolean;
  onToggleSelection: (podcast: Podcast) => void;
}

export default function PodcastCard({
  podcast,
  deletable,
  onToggleSelection,
}: PodcastCardProps) {
  const handleSubscribeOrRemove = () => {
    onToggleSelection(podcast);
  };

  return (
    <div className="flex items-center p-4">
      <div className="w-16 h-16 mr-4 relative flex-shrink-0 rounded-md overflow-hidden">
        <Image
          src={podcast.img || ""}
          alt={podcast.name}
          fill
          sizes="sm"
          className="object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex-grow min-w-0">
        <h4 className="text-gray-900 truncate font-bold">{podcast.name}</h4>
        <p className="text-sm text-gray-500 capitalize truncate">{podcast.title}</p>
      </div>
      <div className="ml-2">
        {deletable ? (
          <Button className="ml-2 py-1 p-1 rounded-full cursor-pointer bg-red-300 hover:bg-red-500 transition" onPress={handleSubscribeOrRemove}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="red"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        ) : (
          <Button
            className={`rounded-full font-medium py-1 cursor-pointer w-28 transition duration-200 hover:bg-opacity-70 ${
              podcast.isSelected ? "bg-gray-600 hover:bg-gray-700 text-gray-50" : "bg-gray-200 hover:bg-gray-300"
            }`}
            onPress={handleSubscribeOrRemove}
          >
            {podcast.isSelected ? "Selected" : "Subscribe"}
          </Button>
        )}
      </div>
    </div>
  );
}
