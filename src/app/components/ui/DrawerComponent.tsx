import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
} from "@heroui/react";

interface DrawerProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export default function DrawerComponent({ isOpen, onOpenChange }: DrawerProps) {
  if (!isOpen) return null;

  return (
    <Drawer
      isOpen={isOpen}
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
          <>
            <DrawerHeader className="flex flex-col gap-1">
              Selected Podcasts
            </DrawerHeader>
            <DrawerBody>
              <p>This drawer has custom enter/exit animations.</p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                pulvinar risus non risus hendrerit venenatis. Pellentesque sit
                amet hendrerit risus, sed porttitor quam.
              </p>
            </DrawerBody>
            <DrawerFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={onClose}>
                Action
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
