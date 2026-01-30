import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertNgo } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useNgos() {
  return useQuery({
    queryKey: [api.ngos.list.path],
    queryFn: async () => {
      const res = await fetch(api.ngos.list.path);
      if (!res.ok) throw new Error("Failed to fetch NGOs");
      return api.ngos.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateNgo() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertNgo) => {
      const validated = api.ngos.create.input.parse(data);
      const res = await fetch(api.ngos.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });
      
      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized");
        if (res.status === 400) throw new Error("Validation failed");
        throw new Error("Failed to create NGO");
      }
      
      return api.ngos.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.ngos.list.path] });
      toast({
        title: "تم تقديم الطلب بنجاح",
        description: "سيتم مراجعة طلبك من قبل المسؤولين",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateNgoStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status, rejectionReason }: { 
      id: number; 
      status: "Approved" | "AdminApproved" | "Rejected" | "Pending";
      rejectionReason?: string;
    }) => {
      const url = buildUrl(api.ngos.updateStatus.path, { id });
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, rejectionReason }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update status");
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.ngos.list.path] });
      let statusText = "";
      if (variables.status === "Approved") {
        statusText = "الموافقة النهائية على";
      } else if (variables.status === "AdminApproved") {
        statusText = "الموافقة الأولية على";
      } else if (variables.status === "Rejected") {
        statusText = "رفض";
      }
      toast({
        title: "تم التحديث",
        description: `تم ${statusText} المنظمة بنجاح`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteNgo() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.ngos.delete.path, { id });
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete NGO");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.ngos.list.path] });
      toast({
        title: "تم الحذف",
        description: "تم حذف المنظمة بنجاح",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateNgo() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertNgo> }) => {
      const url = buildUrl(api.ngos.update.path, { id });
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update NGO");
      return api.ngos.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.ngos.list.path] });
      toast({
        title: "تم التحديث",
        description: "تم تحديث بيانات المنظمة بنجاح",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
