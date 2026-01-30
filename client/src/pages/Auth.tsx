import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@shared/routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, LogIn, ChevronLeft } from "lucide-react";
import { Link } from "wouter";

export default function Auth() {
  const { user, login, isLoggingIn } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user) {
      setLocation(user.role === "admin" || user.role === "super_admin" ? "/admin" : "/dashboard");
    }
  }, [user, setLocation]);

  const loginForm = useForm({
    resolver: zodResolver(api.auth.login.input),
    defaultValues: { username: "", password: "" },
  });

  if (user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-6">
      <div className="w-full max-w-sm">
        <div className="bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] overflow-hidden">
          <div className="h-2 bg-primary/80" />
          
          <div className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <LogIn className="w-7 h-7 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">تسجيل الدخول</h1>
              <p className="text-sm text-muted-foreground">
                أدخل بياناتك للوصول إلى حسابك
              </p>
            </div>

            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit((data) => login(data))} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم المستخدم</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="أدخل اسم المستخدم" 
                          data-testid="input-username" 
                          className="h-11"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>كلمة المرور</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          data-testid="input-password" 
                          className="h-11"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full h-11 mt-2" 
                  disabled={isLoggingIn} 
                  data-testid="button-login"
                >
                  {isLoggingIn ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "دخول"
                  )}
                </Button>
              </form>
            </Form>

            <div className="pt-4 border-t">
              <Link href="/">
                <Button 
                  variant="ghost" 
                  className="w-full gap-2 text-muted-foreground hover:text-foreground" 
                  data-testid="link-home"
                >
                  <ChevronLeft className="w-4 h-4" />
                  العودة للرئيسية
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
