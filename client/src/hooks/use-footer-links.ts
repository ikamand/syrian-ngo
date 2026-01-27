import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { FooterLink } from "@shared/schema";

export function useFooterLinks() {
  return useQuery<FooterLink[]>({
    queryKey: ["/api/admin/footer-links"],
  });
}

export function usePublicFooterLinks() {
  return useQuery<FooterLink[]>({
    queryKey: ["/api/footer-links"],
  });
}

export function useCreateFooterLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { title: string; url: string; sortOrder?: number }) => {
      const res = await apiRequest("POST", "/api/admin/footer-links", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/footer-links"] });
      queryClient.invalidateQueries({ queryKey: ["/api/footer-links"] });
    },
  });
}

export function useUpdateFooterLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: { title?: string; url?: string; sortOrder?: number } }) => {
      const res = await apiRequest("PUT", `/api/admin/footer-links/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/footer-links"] });
      queryClient.invalidateQueries({ queryKey: ["/api/footer-links"] });
    },
  });
}

export function useDeleteFooterLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/admin/footer-links/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/footer-links"] });
      queryClient.invalidateQueries({ queryKey: ["/api/footer-links"] });
    },
  });
}
