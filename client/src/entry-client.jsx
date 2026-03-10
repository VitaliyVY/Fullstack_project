import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import {
  HydrationBoundary,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/clerk-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import AppRoutes from "./AppRoutes.jsx";
import { createQueryClient } from "./lib/queryClient.js";

const queryClient = createQueryClient();
const dehydratedState = window.__REACT_QUERY_STATE__ || undefined;
const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "";
const appCore = (
  <QueryClientProvider client={queryClient}>
    <HydrationBoundary state={dehydratedState}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      <ToastContainer position="bottom-right" />
    </HydrationBoundary>
  </QueryClientProvider>
);

const app = (
  <StrictMode>
    {publishableKey ? (
      <ClerkProvider publishableKey={publishableKey}>{appCore}</ClerkProvider>
    ) : (
      appCore
    )}
  </StrictMode>
);

hydrateRoot(document.getElementById("root"), app);
