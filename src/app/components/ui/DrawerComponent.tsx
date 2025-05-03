import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { Podcast } from "@/app/types";

interface DrawerProps {
  isOpen: boolean;
  onOpenChange: () => void;
  selectedPodcasts: Podcast[]
}

export default function DrawerComponent({ isOpen, onOpenChange, selectedPodcasts }: DrawerProps) {
  if (!isOpen) return null;

  return (
    <Drawer
      isOpen={isOpen}
      size="5xl"
      hideCloseButton={true}
      placement="bottom"
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
          <div className="z-10 bg-gray-50 w-full rounded-t-2xl shadow-cyan-950 shadow-2xl border border-gray-300">
            <DrawerHeader className="flex items-center justify-between gap-1 p-2 m-4">
              <h2 className="text-lg font-semibold text-nowrap">Selected Podcasts</h2>
              <Button
                onPress={onClose}
                className="p-1 rounded-full cursor-pointer hover:bg-gray-100"
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
            </DrawerHeader>
            <DrawerBody>
              {selectedPodcasts?.map(()=>{
                return <></>
              })}
            </DrawerBody>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
