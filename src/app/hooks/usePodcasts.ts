import { useQuery } from '@tanstack/react-query';
import { executeGraphQL, fetchAllPodcastsQuery, fetchSelectedPodcastsQuery, getUserId } from '../utils';
import { Podcast } from '../types';
import { useCallback, useMemo } from 'react';

interface PodcastsData {
  allPodcasts: Podcast[];
}

interface SelectedPodcastsData {
  selectedPodcasts: string[];
}

export const usePodcasts = () => {
  const userId = getUserId();
  
  // Fetch all podcasts
  const { data: podcastsData, isLoading: podcastsLoading, error: podcastsError } = 
    useQuery({
      queryKey: ['podcasts'],
      queryFn: () => executeGraphQL<PodcastsData>(fetchAllPodcastsQuery),
    });
    
  // Fetch selected podcasts
  const {
    data: selectedPodcastsData, 
    isLoading: selectedPodcastsLoading, 
    error: selectedPodcastsError,
  } = useQuery<SelectedPodcastsData>({
    queryKey: ['selectedPodcasts', userId],
    queryFn: () => executeGraphQL<SelectedPodcastsData>(
      fetchSelectedPodcastsQuery, 
      { userId }
    ),
    enabled: !!userId,
  });
  
  const podcasts = podcastsData?.allPodcasts || [];  
  const selectedPodcasts = selectedPodcastsData?.selectedPodcasts || [];
  
  // Create a map of selected podcast IDs for quick lookup
    const selectedSet = new Set(selectedPodcasts);
    const mergedPodcasts = podcasts.map((podcast:{_id:string,name:string,img:string,uNm:string}) => ({
      ...podcast,
      isSelected: selectedSet.has(podcast._id)
    }))
  
  const isLoading = podcastsLoading || selectedPodcastsLoading;
  const error = podcastsError || selectedPodcastsError;
  
  return {
    podcasts: mergedPodcasts,
    selectedPodcasts,
    isLoading,
    error,
  };
};
