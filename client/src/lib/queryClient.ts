import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { isNetlifyEnvironment, apiBaseUrl } from "../netlifyEnvironment";
import * as mockApi from "../mockApi";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Add API base URL for non-Netlify environments
  const fullUrl = !url.startsWith('http') && !isNetlifyEnvironment ? 
    `${apiBaseUrl}${url}` : url;
    
  const res = await fetch(fullUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Handle mock API calls when deployed to Netlify
    if (isNetlifyEnvironment) {
      const endpoint = queryKey[0] as string;
      
      // Map API endpoints to mock functions
      if (endpoint.includes('/api/proposals/recent')) {
        const limit = parseInt(endpoint.split('/').pop() || '5');
        return await mockApi.fetchRecentProposals(limit);
      } else if (endpoint.includes('/api/contributors/top')) {
        const limit = parseInt(endpoint.split('/').pop() || '4');
        return await mockApi.fetchTopContributors(limit);
      } else if (endpoint === '/api/analytics') {
        return await mockApi.fetchAnalytics();
      } else if (endpoint.includes('/api/proposals/type/')) {
        const type = endpoint.split('/').pop() as string;
        return await mockApi.fetchProposalsByType(type as any);
      } else if (endpoint.includes('/api/proposals/status/')) {
        const status = endpoint.split('/').pop() as string;
        return await mockApi.fetchProposalsByStatus(status as any);
      } else if (endpoint.includes('/api/proposals/category/')) {
        const category = endpoint.split('/').pop() as string;
        return await mockApi.fetchProposalsByCategory(category as any);
      } else if (endpoint.includes('/api/proposals/')) {
        const id = endpoint.split('/').pop() as string;
        return await mockApi.fetchProposalById(id);
      } else if (endpoint.includes('/api/contributors/')) {
        const username = endpoint.split('/').pop() as string;
        return await mockApi.fetchContributorByUsername(username);
      } else if (endpoint === '/api/proposals') {
        return await mockApi.fetchProposals();
      } else if (endpoint === '/api/contributors') {
        return await mockApi.fetchContributors();
      }
      
      throw new Error(`Unhandled mock API endpoint: ${endpoint}`);
    }
    
    // Add API base URL for non-Netlify environments
    const url = queryKey[0] as string;
    const fullUrl = !url.startsWith('http') ? `${apiBaseUrl}${url}` : url;
    
    const res = await fetch(fullUrl, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
