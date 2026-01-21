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
    mutationFn: async ({ id, status }: { id: number; status: "Approved" | "Rejected" | "Pending" }) => {
      const url = buildUrl(api.ngos.updateStatus.path, { id });
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update status");
      return api.ngos.updateStatus.responses[200].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.ngos.list.path] });
      const statusText = variables.status === "Approved" ? "الموافقة على" : "رفض";
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
