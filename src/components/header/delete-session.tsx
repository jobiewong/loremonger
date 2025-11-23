import { useMatches, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";
import sessionsCollection from "~/server/collections/sessions";

export function DeleteSession() {
  const matches = useMatches();
  const isOnSessionPage = matches.find(
    (match) => match.routeId === "/campaign/$campaignId/$sessionId/"
  );
  const session = isOnSessionPage?.loaderData?.session;
  const navigate = useNavigate();

  const [isClicked, setIsClicked] = useState(false);

  function handleClick() {
    if (isClicked && session) {
      setIsClicked(false);
      sessionsCollection.delete(session.id);
      toast.success("Session deleted");
      navigate({
        to: "/campaign/$campaignId",
        params: { campaignId: session.campaignId },
      });
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
            Delete Session
          </motion.div>
        )}
      </AnimatePresence>
      {isClicked && (
        <motion.div
          key="confirm-background"
          className="size-full absolute top-0 left-0 bg-red-200 dark:bg-red-900 z-0"
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{ duration: 5, ease: "linear" }}
        />
      )}
    </DropdownMenuItem>
  );
}
