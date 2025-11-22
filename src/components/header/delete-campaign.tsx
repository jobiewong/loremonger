import { useMatches, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { LinesPattern } from "~/components/patterns/lines";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { Toaster } from "~/components/ui/sonner";
import { cn } from "~/lib/utils";
import campaignsCollection from "~/server/collections/campaigns";

export function DeleteCampaign() {
  const matches = useMatches();
  const isOnCampaignPage = matches.find(
    (match) => match.routeId === "/campaign/$campaignId/"
  );
  const isOnSessionPage = matches.find(
    (match) => match.routeId === "/campaign/$campaignId/$sessionId/"
  );
  const campaign = isOnCampaignPage?.loaderData?.campaign;
  const session = isOnSessionPage?.loaderData?.session;
  const campaignId = session?.campaignId ?? campaign?.id;
  const navigate = useNavigate();

  const [isClicked, setIsClicked] = useState(false);

  function handleClick() {
    if (isClicked && campaignId) {
      setIsClicked(false);
      campaignsCollection.delete(campaignId);
      toast.success("Campaign deleted");
      navigate({ to: "/" });
    } else {
      setIsClicked(true);
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsClicked(false);
    }, 5000);
    return () => clearTimeout(timeoutId);
  }, [isClicked]);

  return (
    <DropdownMenuItem
      onClick={(e) => {
        e.preventDefault();
        handleClick();
      }}
      className={cn(
        "relative",
        isClicked && "bg-accent text-accent-foreground"
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {isClicked ? (
          <motion.div
            className="size-full relative z-1"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ bounce: 0, duration: 0.3, type: "spring" }}
          >
            Are you sure?
            <span className="float-right font-semibold">Y/N</span>
          </motion.div>
        ) : (
          <motion.div
            key="delete-campaign"
            className="size-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ bounce: 0, duration: 0.3, type: "spring" }}
          >
            Delete Campaign
          </motion.div>
        )}
      </AnimatePresence>
      {isClicked && (
        <motion.div
          key="confirm-background"
          className="size-full absolute top-0 left-0 bg-red-100 dark:bg-red-900 z-0"
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{ duration: 5, ease: "linear" }}
        />
      )}
    </DropdownMenuItem>
  );
}
