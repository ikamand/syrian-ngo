import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { SiteContent, InsertSiteContent } from "@shared/schema";

export function useAllSiteContent() {
  return useQuery<SiteContent[]>({
    queryKey: ["/api/content"],
  });
}

export function useSiteContent(key: string) {
  return useQuery<SiteContent>({
    queryKey: ["/api/content", key],
    enabled: !!key,
  });
}

export function useUpsertSiteContent() {
  return useMutation({
    mutationFn: async (data: InsertSiteContent) => {
      const res = await apiRequest("PUT", `/api/content/${data.key}`, data);
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      queryClient.invalidateQueries({ queryKey: ["/api/content", variables.key] });
    },
  });
}
