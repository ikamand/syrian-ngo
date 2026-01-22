import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api, type InsertUser } from "@shared/routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Building2, Loader2 } from "lucide-react";

export default function Auth() {
  const { user, login, register, isLoggingIn, isRegistering } = useAuth();
  const [, setLocation] = useLocation();
  const [params] = useState(new URLSearchParams(window.location.search));
  const defaultTab = params.get("tab") === "register" ? "register" : "login";

  useEffect(() => {
    if (user) {
      setLocation(user.role === "admin" ? "/admin" : "/dashboard");
    }
  }, [user, setLocation]);

  const loginForm = useForm({
    resolver: zodResolver(api.auth.login.input),
    defaultValues: { username: "", password: "" },
  });

  const registerForm = useForm({
    resolver: zodResolver(api.auth.register.input),
    defaultValues: { username: "", password: "", role: "user" as const },
  });

  if (user) return null;

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Decorative Side */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-primary text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576402187878-974f70c890a5?w=1600&auto=format&fit=crop')] opacity-20 bg-cover bg-center mix-blend-multiply" />
          <div className="relative z-10 text-center space-y-8 max-w-lg">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Coats_of_arms_of_Syria.svg/1200px-Coats_of_arms_of_Syria.svg.png" 
              alt="Syrian National Emblem"
              className="w-32 h-auto mx-auto drop-shadow-2xl"
            />
            <h1 className="text-4xl font-bold">بوابة المنظمات</h1>
            <p className="text-lg text-white/80 leading-relaxed">
              المنصة الرسمية الموحدة لتسجيل ومتابعة المنظمات غير الحكومية. سجّل دخولك للوصول إلى لوحة التحكم ومتابعة طلباتك.
            </p>
          </div>
      </div>

      {/* Form Side */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Coats_of_arms_of_Syria.svg/1200px-Coats_of_arms_of_Syria.svg.png" 
              alt="Syrian National Emblem"
              className="w-32 h-auto mx-auto drop-shadow-xl mb-6"
            />
            <h1 className="text-2xl font-bold text-primary">بوابة المنظمات</h1>
          </div>

          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
              <TabsTrigger value="register">حساب جديد</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
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
                              <Input placeholder="أدخل اسم المستخدم" {...field} />
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
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full h-11" disabled={isLoggingIn}>
                        {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : "تسجيل الدخول"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card className="border-none shadow-xl">
                <CardHeader>
                  <CardTitle>إنشاء حساب جديد</CardTitle>
                  <CardDescription>قم بإنشاء حساب لتقديم طلب تسجيل منظمة</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit((data) => register(data))} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>اسم المستخدم</FormLabel>
                            <FormControl>
                              <Input placeholder="اختر اسم مستخدم" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>كلمة المرور</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full h-11" disabled={isRegistering}>
                        {isRegistering ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : "إنشاء الحساب"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
