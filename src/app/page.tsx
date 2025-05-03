"use client";
import { useState } from "react";
import { Button, useDisclosure } from "@heroui/react";
import PodcastList from "./components/PodcastList";
import { usePodcasts } from "./hooks/usePodcasts";
import DrawerComponent from "./components/ui/DrawerComponent";

export default function Home() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { podcasts, selectedPodcasts, isLoading } = usePodcasts();

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
        podcasts={podcasts}
        onToggleSelection={() => {}}
        isLoading={isLoading}
      />

      {/* Floating Button */}
      {selectedPodcasts?.length ? (
        <div className="fixed bottom-0 left-0 right-0 flex justify-center items-center z-10 h-24 px-12 bg-gradient-to-t from-white to-transparent">
          <Button
            className="bg-gray-500 text-white rounded-full shadow-lg transition-all transform flex items-center py-3 w-full cursor-pointer outline-none"
            onPress={onOpen}
          >
            <span className="mr-1">
              Show Added ({selectedPodcasts?.length || 0})
            </span>
          </Button>
        </div>
      ) : null}

      {/* Bottom Drawer */}
      <DrawerComponent isOpen={isOpen} onOpenChange={onOpenChange} />
    </main>
  );
}
