import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl,FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useLocation } from "wouter";
import { ArrowRight } from "lucide-react";

const formSchema = z.object({
  firstName: z.string().min(1, "الإسم الأول مطلوب"),
  fatherName: z.string().min(1, "إسم الأب مطلوب"),
  lastName: z.string().min(1, "الكنية مطلوبة"),
  phone: z.string().min(1, "رقم الهاتف مطلوب"),
  nationalId: z.string().min(1, "الرقم الوطني مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح").min(1, "البريد الإلكتروني مطلوب"),
});

type FormValues = z.infer<typeof formSchema>;

export default function NgoRegistrationForm() {
  const [, setLocation] = useLocation();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      fatherName: "",
      lastName: "",
      phone: "",
      nationalId: "",
      email: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    // Move to next step or handle submission
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      <Navbar />
      <div className="bg-primary text-white py-12 mb-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold">نموذج تسجيل المنظمة</h1>
          <p className="mt-2 text-white/90 text-lg">الخطوة 1: المعلومات الشخصية لمقدم الطلب</p>
        </div>
      </div>

      <main className="container mx-auto px-4 max-w-2xl">
        <Button 
          variant="ghost" 
          onClick={() => setLocation("/create-ngo")}
          className="mb-6 gap-2 text-muted-foreground hover:text-primary"
        >
          <ArrowRight className="w-4 h-4" />
          العودة للدليل
        </Button>

        <Card className="shadow-lg border-0 rounded-none">
          <CardHeader className="bg-white border-b">
            <CardTitle className="text-xl text-primary font-bold">المعلومات الشخصية</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الإسم الأول <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل الإسم الأول" {...field} className="rounded-none" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fatherName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>إسم الأب <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل إسم الأب" {...field} className="rounded-none" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الكنية <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل الكنية" {...field} className="rounded-none" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nationalId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الرقم الوطني <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل الرقم الوطني" {...field} className="rounded-none" />
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
                        <FormLabel>رقم الهاتف <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="09xxxxxxxx" {...field} className="rounded-none" />
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
                        <FormLabel>البريد الإلكتروني <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="example@mail.com" {...field} className="rounded-none" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="pt-4 flex justify-end">
                  <Button type="submit" className="w-full md:w-auto px-8 py-6 text-lg font-bold pl-[24px] pr-[24px] pt-[10px] pb-[10px]">
                    التالي
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
