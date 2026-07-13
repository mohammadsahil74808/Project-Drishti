/**
 * SentinelX AI — root application component.
 * Mounts the application router (src/router/index.tsx).
 */
import AppRouter from "@/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  );
}
