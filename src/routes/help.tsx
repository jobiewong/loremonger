import { createFileRoute } from "@tanstack/react-router";
import { AsciiLogo } from "~/components/ascii-logo";

export const Route = createFileRoute("/help")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="page-wrapper flex flex-col items-center">
      <div className="content-wrapper px-4 pb-4 pt-8 overflow-y-auto">
        <AsciiLogo
          isAnimated={false}
          className="text-[5px] leading-1.25 text-accent-500"
        />
        <section className="mt-6 w-full [&>h2]:mb-2 [&>p]:mb-4 [&>h2]:font-bold [&>p]:text-sm">
          <h2>What is Loremonger?</h2>
          <p>
            Loremonger is a small utility for automatically generating D&D
            session notes from an audio recording. The notes are generated in
            markdown format to be used in a program such as Obsidian. Recordings
            can be multiple audio or video files — uploads are automatically
            concatenated and converted to a single .mp3 file.
          </p>
          <h2>How to use Loremonger</h2>
          <ol className="text-sm marker:text-accent-foreground list-decimal list-outside pl-8 space-y-2">
            <li>Configure your API keys (File &gt; Settings)</li>
            <li>
              Create a <em>Campaign</em> (File &gt; New &gt; Campaign)
            </li>
            <li>
              Fill out the metadata including campaign name, DM name, and output
              directory. Fill out information about the campaign party. This
              will help the LLM make sense of names that it encounters in the
              transcript and generate more consistent notes.
            </li>
            <li>
              Create a <em>Session</em> (File &gt; New &gt; Session)
            </li>
            <li>
              Upload your session recordings and click <b>Transcribe</b>. You
              will see logs of the output below. Depending on the session length
              this may take a few minutes.
            </li>
            <li>
              View the outputted notes. The location and naming convention is
              determined by the campaign settings.
            </li>
          </ol>
        </section>
      </div>
    </main>
  );
}
