import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { useCreateNgo } from "@/hooks/use-ngos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api, type InsertNgo } from "@shared/routes";
import { Link, useLocation } from "wouter";
import { ArrowRight, Loader2 } from "lucide-react";

export default function CreateNgo() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { mutate: createNgo, isPending } = useCreateNgo();
  const [, setLocation] = useLocation();

  const form = useForm<InsertNgo>({
    resolver: zodResolver(api.ngos.create.input),
    defaultValues: {
      name: "",
      city: "",
      presidentName: "",
      email: "",
      phone: "",
      description: "",
    },
  });

  if (isAuthLoading) return null;

  if (!user) {
    setLocation("/login");
    return null;
  }

  const onSubmit = (data: InsertNgo) => {
    createNgo(data, {
      onSuccess: () => {
        setLocation("/dashboard");
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6 gap-2 text-muted-foreground hover:text-primary">
            <ArrowRight className="w-4 h-4" />
            العودة للوحة التحكم
          </Button>
        </Link>

        <Card className="max-w-3xl mx-auto shadow-lg border-primary/10">
          <CardHeader className="border-b bg-white rounded-t-xl pb-6">
            <CardTitle className="text-2xl text-primary">تسجيل منظمة جديدة</CardTitle>
            <CardDescription>يرجى ملء النموذج أدناه بدقة لتقديم طلب ترخيص منظمة غير حكومية.</CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>اسم المنظمة الرسمي</FormLabel>
                        <FormControl>
                          <Input placeholder="مثال: جمعية الأمل الخيرية" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>المدينة / المحافظة</FormLabel>
                        <FormControl>
                          <Input placeholder="مثال: دمشق" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="presidentName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>اسم رئيس مجلس الإدارة</FormLabel>
                        <FormControl>
                          <Input placeholder="الاسم الثلاثي" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>البريد الإلكتروني الرسمي</FormLabel>
                        <FormControl>
                          <Input placeholder="email@example.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>رقم الهاتف</FormLabel>
                        <FormControl>
                          <Input placeholder="09xxxxxxxx" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>نبذة عن أهداف المنظمة</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="اكتب وصفاً مختصراً لأهداف ونشاطات المنظمة..." 
                          className="min-h-[120px] resize-none"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>يرجى ذكر الأهداف الرئيسية والفئات المستهدفة.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4 border-t flex justify-end gap-4">
                  <Link href="/dashboard">
                    <Button variant="outline" type="button">إلغاء</Button>
                  </Link>
                  <Button type="submit" className="min-w-[150px] shadow-lg shadow-primary/25" disabled={isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                        جاري الإرسال...
                      </>
                    ) : (
                      "تقديم الطلب"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
