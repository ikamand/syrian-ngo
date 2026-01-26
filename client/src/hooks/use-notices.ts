import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Notice, InsertNotice } from "@shared/schema";

export function usePublicNotices() {
  return useQuery<Notice[]>({
    queryKey: ["/api/notices/public"],
  });
}

export function useNotices() {
  return useQuery<Notice[]>({
    queryKey: ["/api/notices"],
  });
}

export function useNotice(id: number) {
  return useQuery<Notice>({
    queryKey: ["/api/notices", id],
    enabled: !!id,
  });
}

export function useCreateNotice() {
  return useMutation({
    mutationFn: async (data: InsertNotice) => {
      const res = await apiRequest("POST", "/api/notices", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notices"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notices/public"] });
    },
  });
}

export function useUpdateNotice() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertNotice> }) => {
      const res = await apiRequest("PUT", `/api/notices/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notices"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notices/public"] });
    },
  });
}

export function useDeleteNotice() {
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/notices/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notices"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notices/public"] });
    },
  });
}
