"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  executeGraphQL,
  getUserId,
  saveSelectedPodcastsMutation,
} from "../utils";
import { Podcast } from "../types";
import { useState, useCallback } from "react";

interface SaveSelectedPodcastsData {
  saveSelectedPodcasts: {
    userId: string;
    selectedPodcasts: String[];
  };
}

export const useSelectedPodcasts = (
  userId: string,
  initialSelectedPodcasts: Podcast[] = []
) => {
  const queryClient = useQueryClient();
  const [selectedPodcasts, setSelectedPodcasts] = useState<Podcast[]>(
    initialSelectedPodcasts
  );

  // Toggle podcast selection
  const togglePodcastSelection = useCallback((podcast: Podcast) => {
    setSelectedPodcasts((prev) => {
      const existingPodcast = prev.some((p) => p._id === podcast._id);
      if (existingPodcast) {
        // Remove if already selected
        return prev.filter((p) => p._id !== podcast._id);
      } else {
        // Add if not selected
        return [...prev, { ...podcast, isSelected: true }];
      }
    });
  }, []);

  // Remove podcast from selection
  const removePodcast = useCallback((podcastId: string) => {
    setSelectedPodcasts((prev) => prev.filter((p) => p._id !== podcastId));
  }, []);

  // Save selected podcasts mutation
  const { mutate: saveSelection, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      return executeGraphQL<SaveSelectedPodcastsData>(
        saveSelectedPodcastsMutation,
        {
          userId,
          selectedPodcasts: selectedPodcasts.map((podcast) => podcast._id),
        }
      );
    },
    onSuccess: () => {
      // Invalidate and refetch the selected podcasts query
      queryClient.invalidateQueries({ queryKey: ["selectedPodcasts", userId] });
    },
  });

  return {
    selectedPodcasts,
    togglePodcastSelection,
    removePodcast,
    saveSelection,
    isSaving,
  };
};
