"use client";
import { useCallback, useEffect, useState } from "react";
import { Button, useDisclosure } from "@heroui/react";
import PodcastList from "./components/PodcastList";
import { usePodcasts } from "./hooks/usePodcasts";
import DrawerComponent from "./components/ui/DrawerComponent";
import { Podcast } from "./types";
import { useSelectedPodcasts } from "./hooks/useSelectedPodcasts";

export default function Home() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { userId, podcasts, selectedPodcasts:initialSelectedPodcasts, isLoading } = usePodcasts();
  const {
    selectedPodcasts,
    togglePodcastSelection,
    removePodcast, 
    saveSelection,
    isSaving 
  } = useSelectedPodcasts(userId, initialSelectedPodcasts);
  const [allPodcasts, setAllPodcasts] = useState<Podcast[]>([]);

  // Only update allPodcasts when podcasts change and allPodcasts is empty
    useEffect(() => {
      if (podcasts.length > 0 && allPodcasts.length === 0) {
        setAllPodcasts(podcasts);
      }
    }, [podcasts]);

   // Memoize the toggle function to prevent recreating it on each render
     const handleToggleSelection = useCallback((podcast: Podcast) => {
       setAllPodcasts((prev) =>
         prev.map((p) =>
           p._id === podcast._id
             ? { ...p, isSelected: !p.isSelected }
             : p
         )
       );
       togglePodcastSelection(podcast)
     }, []);

  // Handle removing podcast from selected list
  const handleRemovePodcast = (podcastId: string) => {
    
  };

  // Handle saving selected podcasts
  const handleSave = async () => {
    await saveSelection();
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white w-full">
        <div className="max-w-7xl px-4 py-5">
          <h1 className="text-3xl py-6 font-semibold text-gray-900">
            Add Podcasts
          </h1>
          <p>
            <strong>Popular on Queue</strong>
          </p>
        </div>
      </header>

      {/* Podcast List */}
      <PodcastList
        podcasts={allPodcasts}
        onToggleSelection={handleToggleSelection}
        isLoading={isLoading}
      />

      {/* Floating Button */}
        <div className="fixed bottom-0 left-0 right-0 flex flex-col justify-around items-center h-24 px-12 bg-gradient-to-t from-white to-transparent">
          {selectedPodcasts?.length ? <>
          <Button
            className="text-white rounded-full shadow-lg bg-gray-700 transition duration-300 hover:bg-gray-900 flex items-center py-2 w-full cursor-pointer outline-none"
            onPress={onOpen}
          >
            <span>
              Show Added ({selectedPodcasts?.length || 0})
            </span>
          </Button>
          <div className="w-1/2 h-2 -mb-2 bg-black rounded-full"></div>
          </> : null}
        </div>

      <div className={`fixed inset-0 top-0 w-screen h-screen bg-gray-700 transition-opacity duration-300 ${isOpen ? "opacity-80" : "opacity-0 pointer-events-none"}`}></div>

      {/* Bottom Drawer */}
      <DrawerComponent isOpen={isOpen} onOpenChange={onOpenChange} selectedPodcasts={selectedPodcasts} handleToggleSelection={handleToggleSelection} handleSave={handleSave} isSaving={isSaving} />
    </main>
  );
}
