"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  executeGraphQL,
  saveSelectedPodcasts,
} from "../utils";
import { Podcast } from "../types";
import { useState, useCallback, useEffect, useRef } from "react";
import toast from "react-hot-toast";


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
  const [selectedPodcasts, setSelectedPodcasts] = useState<Podcast[]>(() => initialSelectedPodcasts);
  const isInitialized = useRef(false);

  // One-time initialization when async data arrives
  useEffect(() => {
    if (!isInitialized.current && initialSelectedPodcasts.length > 0) {
      setSelectedPodcasts(initialSelectedPodcasts);
      isInitialized.current = true;
    }
  }, [initialSelectedPodcasts]);

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

  // Save selected podcasts mutation
  const { mutate: saveSelection, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      return executeGraphQL<SaveSelectedPodcastsData>(
        saveSelectedPodcasts,
        {
          userId,
          selectedPodcasts: selectedPodcasts.map((podcast) => podcast._id),
        }
      );
    },
    onSuccess: () => {
      // Modify the selected podcasts
      queryClient.setQueryData(["selectedPodcasts", userId], () => {
        return selectedPodcasts.map((podcast) => podcast._id);
      });
      // Show success toast
      toast.success("Saved successfully!", {
        duration: 4000,
        position: "top-right",
        icon: '✅',
      });
    },
  });

  return {
    selectedPodcasts,
    togglePodcastSelection,
    saveSelection,
    isSaving,
  };
};
