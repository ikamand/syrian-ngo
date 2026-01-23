import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { SiteContent, InsertSiteContent } from "@shared/schema";

export function useAllSiteContent() {
  return useQuery<SiteContent[]>({
    queryKey: ["/api/site-content"],
  });
}

export function useSiteContent(key: string) {
  return useQuery<SiteContent>({
    queryKey: ["/api/site-content", key],
    enabled: !!key,
  });
}

export function useUpsertSiteContent() {
  return useMutation({
    mutationFn: async (data: InsertSiteContent) => {
      const res = await apiRequest("PUT", "/api/site-content", data);
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/site-content"] });
      queryClient.invalidateQueries({ queryKey: ["/api/site-content", variables.key] });
    },
  });
}
