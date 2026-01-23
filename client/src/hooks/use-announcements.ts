import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Announcement, InsertAnnouncement } from "@shared/schema";

export function usePublishedAnnouncements() {
  return useQuery<Announcement[]>({
    queryKey: ["/api/announcements/published"],
  });
}

export function useAnnouncements() {
  return useQuery<Announcement[]>({
    queryKey: ["/api/announcements"],
  });
}

export function useAnnouncement(id: number) {
  return useQuery<Announcement>({
    queryKey: ["/api/announcements", id],
    enabled: !!id,
  });
}

export function useCreateAnnouncement() {
  return useMutation({
    mutationFn: async (data: InsertAnnouncement) => {
      const res = await apiRequest("POST", "/api/announcements", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
      queryClient.invalidateQueries({ queryKey: ["/api/announcements/published"] });
    },
  });
}

export function useUpdateAnnouncement() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertAnnouncement> }) => {
      const res = await apiRequest("PUT", `/api/announcements/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
      queryClient.invalidateQueries({ queryKey: ["/api/announcements/published"] });
    },
  });
}

export function useDeleteAnnouncement() {
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/announcements/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
      queryClient.invalidateQueries({ queryKey: ["/api/announcements/published"] });
    },
  });
}
