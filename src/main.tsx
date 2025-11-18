import { RouterProvider, createRouter } from "@tanstack/react-router";
import { Buffer } from "buffer";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { bootstrapStrongholdFromEnv } from "./scripts/bootstrap-stronghold";

if (typeof globalThis.Buffer === "undefined") {
  globalThis.Buffer = Buffer;
}

import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  bootstrapStrongholdFromEnv();
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
