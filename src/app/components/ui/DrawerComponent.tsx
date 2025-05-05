import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
} from "@heroui/react";
import { Podcast } from "@/app/types";
import PodcastCard from "./PodcastCard";

interface DrawerProps {
  isOpen: boolean;
  onOpenChange: () => void;
  selectedPodcasts: Podcast[];
  handleToggleSelection: (podcast: Podcast) => void;
  handleSave: () => void;
  isSaving:boolean;
}

export default function DrawerComponent({
  isOpen,
  onOpenChange,
  selectedPodcasts,
  handleToggleSelection,
  handleSave,
  isSaving
}: DrawerProps) {
  if (!isOpen) return null;

  return (
    <Drawer
      isOpen={isOpen}
      size="5xl"
      hideCloseButton={true}
      placement="bottom"
      backdrop="opaque"
      motionProps={{
        variants: {
          enter: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3 },
          },
          exit: {
            y: 100,
            opacity: 0,
            transition: { duration: 0.3 },
          },
        },
      }}
      onOpenChange={onOpenChange}
    >
      <DrawerContent>
        {(onClose) => (
          <div className="w-full bg-gray-50 rounded-t-2xl shadow-cyan-950 shadow-2xl border border-gray-300">
            <DrawerHeader className="flex items-center justify-between gap-1 p-4">
              <h2 className="text-lg font-semibold text-nowrap">
                Selected Podcasts
              </h2>
              <div>
                <Button
                  onPress={onClose}
                  className="p-1 rounded-full cursor-pointer transition bg-gray-200 hover:bg-gray-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
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
              </div>
            </DrawerHeader>
            <DrawerBody className="px-2 h-[calc(100vh-15rem)] overflow-y-scroll">
              {selectedPodcasts?.length ? (
                selectedPodcasts.map((podcast) => {
                  return (
                    <PodcastCard
                      key={podcast._id}
                      podcast={podcast}
                      deletable={true}
                      onToggleSelection={handleToggleSelection}
                    />
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No podcasts selected yet</p>
                </div>
              )}
            </DrawerBody>
            <DrawerFooter>
              <Button
                onPress={()=>{
                  handleSave()
                  onClose()
                }}
                className={`m-auto w-100 rounded-full p-2 my-2 text-gray-50 transition duration-200 bg-gray-700 cursor-pointer hover:bg-gray-900`}
                // disabled={selectedPodcasts.length === 0 || isSaving}
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </DrawerFooter>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
