import { createFileRoute } from "@tanstack/react-router";
import { IconSquareInfo } from "central-icons";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { generateFileName } from "~/lib/utils";
import { Campaign, Session } from "~/types";

export const Route = createFileRoute("/workbench")({
  component: RouteComponent,
});

function RouteComponent() {
  const [value, setValue] = useState<string>(
    "{currentDate}-{currentTime}_notes.md"
  );
  const [output, setOutput] = useState<string>("");
  const session: Session & { campaign: Campaign } = {
    id: "123",
    name: "Example Session",
    number: 1,
    campaignId: "123",
    date: new Date().toISOString(),
    duration: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    wordCount: 100,
    noteWordCount: 100,
    filePath: "Example File Path",
    campaign: {
      id: "123",
      name: "Example Campaign",
      dmName: "Example DM",
      description: "Example Campaign Description",
      outputDirectory: "/Users/jobiewong/Documents",
      namingConvention: "{currentDate}-{currentTime}_notes.md",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };

  async function handleSubmit() {
    const updatedSession = {
      ...session,
      campaign: {
        ...session.campaign,
        namingConvention: value,
      },
    };
    const fileName = generateFileName(updatedSession);
    setOutput(fileName);
  }

  return (
    <main className="page-wrapper flex flex-col items-center">
      <div className="content-wrapper w-full flex flex-col gap-4">
        <Label>
          <div className="flex items-center gap-2">
            Naming Convention{" "}
            <Tooltip>
              <TooltipTrigger>
                <IconSquareInfo className="size-4 opacity-60 hover:opacity-100" />
              </TooltipTrigger>
              <TooltipContent
                className="max-w-xs space-y-2"
                classNames={{
                  arrow: "translate-y-[calc(50%-2px)]",
                }}
              >
                <p>
                  Determines the generated file name for each session note. The
                  following variables are available:
                </p>
                <ul className="list-disc list-inside marker:text-accent-500">
                  <li>{`{campaignName}`}</li>
                  <li>{`{sessionNumber}`}</li>
                  <li>{`{currentDate}`}</li>
                  <li>{`{currentTime}`}</li>
                </ul>
                <p>
                  If undefined, the default is{" "}
                  <b>{`{currentDate}-{currentTime}_notes.md`}</b>.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </Label>
        <Input value={value} onChange={(e) => setValue(e.target.value)} />
        <Button onClick={handleSubmit}>Submit</Button>
        <p>{output}</p>
      </div>
    </main>
  );
}
