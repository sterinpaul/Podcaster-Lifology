import { useQuery } from "@tanstack/react-query";
import {
  executeGraphQL,
  fetchAllPodcastsQuery,
  fetchSelectedPodcastsQuery,
  getUserId,
} from "../utils";
import { Podcast } from "../types";
import { useState } from "react";

interface PodcastsData {
  allPodcasts: Podcast[];
}

interface SelectedPodcastsData {
  selectedPodcasts: string[];
}

export const usePodcasts = () => {
  const userId = getUserId();
  
  // Fetch all podcasts
  const {
    data: podcastsData,
    isLoading: podcastsLoading,
    error: podcastsError,
  } = useQuery({
    queryKey: ["podcasts"],
    queryFn: () => executeGraphQL<PodcastsData>(fetchAllPodcastsQuery),
  });

  // Fetch selected podcasts
  const {
    data: selectedPodcastsData,
    isLoading: selectedPodcastsLoading,
    error: selectedPodcastsError,
  } = useQuery<SelectedPodcastsData>({
    queryKey: ["selectedPodcasts", userId],
    queryFn: () =>
      executeGraphQL<SelectedPodcastsData>(fetchSelectedPodcastsQuery, {
        userId,
      }),
    enabled: !!userId,
  });

  const allPodcastData = podcastsData?.allPodcasts || [];
  const selectedPodcastIds = selectedPodcastsData?.selectedPodcasts || [];

  // Create a hash set of selected podcast IDs for quick lookup
  const selectedSet = new Set(selectedPodcastIds);
  const mergedPodcasts = allPodcastData.map(
    (podcast: { _id: string; name: string; img: string; uNm: string }) => ({
      ...podcast,
      isSelected: selectedSet.has(podcast._id),
    })
  );

  const selectedPodcasts = allPodcastData.filter((podcast)=>selectedSet.has(podcast._id))

  const isLoading = podcastsLoading || selectedPodcastsLoading;
  const error = podcastsError || selectedPodcastsError;

  return {
    userId,
    podcasts: mergedPodcasts,
    selectedPodcasts,
    isLoading,
    error,
  };
};
