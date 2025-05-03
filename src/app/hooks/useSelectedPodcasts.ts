"use client"
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { executeGraphQL, getUserId, saveSelectedPodcastsMutation } from '../utils';
import { Podcast } from '../types';
import { useState, useCallback } from 'react';

interface SaveSelectedPodcastsData {
  saveSelectedPodcasts: {
    userId: string;
    selectedPodcasts: Podcast[];
  };
}

export const useSelectedPodcasts = (initialSelectedPodcasts: Podcast[] = []) => {
  const userId = getUserId();
  const queryClient = useQueryClient();
  const [selectedPodcasts, setSelectedPodcasts] = useState<Podcast[]>(initialSelectedPodcasts);
  
  // Toggle podcast selection
  const togglePodcastSelection = useCallback((podcast: Podcast) => {
    setSelectedPodcasts(prev => {
      const existingIndex = prev.findIndex(p => p._id === podcast._id);
      if (existingIndex >= 0) {
        // Remove if already selected
        return prev.filter(p => p._id !== podcast._id);
      } else {
        // Add if not selected
        return [...prev, { ...podcast, isSelected: true }];
      }
    });
  }, []);
  
  // Remove podcast from selection
  const removePodcast = useCallback((podcastId: string) => {
    setSelectedPodcasts(prev => prev.filter(p => p._id !== podcastId));
  }, []);
  
  // Save selected podcasts mutation
  const { mutate: saveSelection, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      return executeGraphQL<SaveSelectedPodcastsData>(
        saveSelectedPodcastsMutation,
        { 
          userId, 
          selectedPodcasts: selectedPodcasts.map(p => ({
            _id: p._id,
            name: p.name,
            img: p.img,
            channel: p.uNm,
            isSelected: true
          }))
        }
      );
    },
    onSuccess: () => {
      // Invalidate and refetch the selected podcasts query
      queryClient.invalidateQueries({ queryKey: ['selectedPodcasts', userId] });
    }
  });
  
  return {
    selectedPodcasts,
    setSelectedPodcasts,
    togglePodcastSelection,
    removePodcast,
    saveSelection,
    isSaving,
  };
};