import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type User } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useAuth() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: user, isLoading } = useQuery({
    queryKey: [api.auth.me.path],
    queryFn: async () => {
      const res = await fetch(api.auth.me.path);
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch user");
      return api.auth.me.responses[200].parse(await res.json());
    },
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: unknown) => {
      // Manual parse because we're calling it from a form
      const validCredentials = api.auth.login.input.parse(credentials);
      const res = await fetch(api.auth.login.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validCredentials),
      });
      if (!res.ok) {
        if (res.status === 401) throw new Error("Invalid username or password");
        throw new Error("Login failed");
      }
      return api.auth.login.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.setQueryData([api.auth.me.path], data);
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحباً بك، ${data.username}`,
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(api.auth.logout.path, { method: "POST" });
      if (!res.ok) throw new Error("Logout failed");
    },
    onSuccess: () => {
      queryClient.setQueryData([api.auth.me.path], null);
      toast({
        title: "تم تسجيل الخروج",
        description: "إلى اللقاء",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: unknown) => {
       const validCredentials = api.auth.register.input.parse(credentials);
       const res = await fetch(api.auth.register.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validCredentials),
      });
      if (!res.ok) {
         if (res.status === 400) throw new Error("Validation error");
         throw new Error("Registration failed");
      }
      return api.auth.register.responses[201].parse(await res.json());
    },
    onSuccess: (data) => {
       queryClient.setQueryData([api.auth.me.path], data);
       toast({
        title: "تم إنشاء الحساب بنجاح",
        description: `مرحباً بك، ${data.username}`,
      });
    }
  });

  return {
    user,
    isLoading,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending
  };
}
