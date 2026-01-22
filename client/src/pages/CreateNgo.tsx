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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreateNgo() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { mutate: createNgo, isPending } = useCreateNgo();
  const [, setLocation] = useLocation();

  const form = useForm<InsertNgo>({
    resolver: zodResolver(api.ngos.create.input),
    defaultValues: {
      name: "",
      arabicName: "",
      englishName: "",
      legalForm: "",
      scope: "",
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
                        <FormLabel>الاسم التعريفي</FormLabel>
                        <FormControl>
                          <Input placeholder="مثال: جمعية الأمل الخيرية" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="arabicName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الاسم باللغة العربية</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="englishName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الاسم باللغة الإنكليزية</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="legalForm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الشكل القانوني</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر الشكل القانوني" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="جمعية أهلية">جمعية أهلية</SelectItem>
                            <SelectItem value="مؤسسة تنموية">مؤسسة تنموية</SelectItem>
                            <SelectItem value="فرع منظمة دولية">فرع منظمة دولية</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="scope"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>نطاق عمل المنظمة</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر نطاق العمل" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="نطاق محلي">نطاق محلي</SelectItem>
                            <SelectItem value="نطاق محافظات">نطاق محافظات</SelectItem>
                            <SelectItem value="نطاق وطني">نطاق وطني</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>المدينة / المحافظة (المركز الرئيسي)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر المحافظة" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {["Damascus", "Aleppo", "Homs", "Hama", "Latakia", "Tartus", "Idlib", "Raqqa", "Deir ez-Zor", "Al-Hasakah", "Daraa", "As-Suwayda", "Quneitra", "Rif Dimashq"].map(city => (
                              <SelectItem key={city} value={city}>{city}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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

                <div className="pt-8 border-t space-y-4">
                  <h3 className="text-lg font-bold text-red-600">البيانات المطلوب استكمالها (حسب وثيقة منصة تشارك)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-red-500">
                    <ul className="list-disc list-inside space-y-1">
                      <li>معلومات التأسيس (الاسم، المعرف، الشكل القانوني)</li>
                      <li>معلومات الإشهار ونطاق العمل</li>
                      <li>وثائق المنظمة (النظام الداخلي، قرار الإشهار)</li>
                      <li>التصنيفات والخدمات</li>
                    </ul>
                    <ul className="list-disc list-inside space-y-1">
                      <li>المراكز الخدمية والفروع</li>
                      <li>العلاقة مع الوزارة (البيانات المالية)</li>
                      <li>معلومات التواصل والحسابات البنكية</li>
                      <li>البرامج والخطط السنوية</li>
                    </ul>
                  </div>
                </div>

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
