import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@shared/routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";

export default function Auth() {
  const { user, login, isLoggingIn } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user) {
      setLocation(user.role === "admin" ? "/admin" : "/dashboard");
    }
  }, [user, setLocation]);

  const loginForm = useForm({
    resolver: zodResolver(api.auth.login.input),
    defaultValues: { username: "", password: "" },
  });

  if (user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-geometric p-6 relative overflow-hidden">
      <div className="relative z-10 w-full max-w-md space-y-8 bg-background/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/10">
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-primary">بوابة المنظمات</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              المنصة الرسمية الموحدة لتسجيل ومتابعة المنظمات غير الحكومية. سجّل دخولك للوصول إلى لوحة التحكم ومتابعة طلباتك.
            </p>
          </div>
        </div>

        <Card className="border-none shadow-xl">
          <CardHeader>
            <CardTitle>مرحباً بعودتك</CardTitle>
            <CardDescription>أدخل بيانات اعتمادك للدخول إلى النظام</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit((data) => login(data))} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم المستخدم</FormLabel>
                      <FormControl>
                        <Input placeholder="أدخل اسم المستخدم" data-testid="input-username" {...field} />
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
                        <Input type="password" placeholder="••••••••" data-testid="input-password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full h-11" disabled={isLoggingIn} data-testid="button-login">
                  {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : "تسجيل الدخول"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          للحصول على حساب جديد، يرجى التواصل مع المسؤول
        </p>
      </div>
    </div>
  );
}
