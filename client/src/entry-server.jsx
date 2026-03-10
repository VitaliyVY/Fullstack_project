import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import {
  dehydrate,
  HydrationBoundary,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/clerk-react";
import { ToastContainer } from "react-toastify";
import AppRoutes from "./AppRoutes.jsx";
import { createQueryClient } from "./lib/queryClient.js";
import { prefetchQueriesForUrl } from "./ssr/prefetchQueries.js";
import { getMetadataForUrl } from "./ssr/metadata.js";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";

const serializeState = (state) =>
  JSON.stringify(state).replace(/</g, "\\u003c");

export const render = async (url, options = {}) => {
  const queryClient = createQueryClient();
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "";
  const origin = options.origin || "http://localhost";

  await prefetchQueriesForUrl(url, queryClient);
  const metadata = getMetadataForUrl(url, queryClient, origin);

  const dehydratedState = dehydrate(queryClient);
  const appCore = (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        <StaticRouter location={url}>
          <AppRoutes />
        </StaticRouter>
        <ToastContainer position="bottom-right" />
      </HydrationBoundary>
    </QueryClientProvider>
  );

  const appHtml = renderToString(
    publishableKey ? (
      <ClerkProvider publishableKey={publishableKey}>{appCore}</ClerkProvider>
    ) : (
      appCore
    ),
  );

  return {
    appHtml,
    queryState: serializeState(dehydratedState),
    metadata,
  };
};
