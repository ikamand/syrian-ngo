import logoUrl from "@assets/emblem-of-syria-seeklogo_1769035838735.png";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Building2, Home, LayoutDashboard, LogOut, Shield, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              {/* Syrian Coat of Arms */}
              <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center overflow-hidden">
                <img src={logoUrl} alt="Emblem of Syria" className="h-full w-full object-contain" />
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-sm font-bold text-primary">الجمهورية العربية السورية</span>
                <span className="text-xs text-muted-foreground font-medium">وزارة الشؤون الإجتماعية والعمل</span>
              </div>
            </div>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className={`transition-colors hover:text-primary ${isActive("/") ? "text-primary font-bold" : "text-foreground/80"}`}>
            الرئيسية
          </Link>
          <Link href="/ngos" className={`transition-colors hover:text-primary ${isActive("/ngos") ? "text-primary font-bold" : "text-foreground/80"}`}>
            دليل المنظمات
          </Link>
          {user && (
            <Link href={user.role === 'admin' ? '/admin' : '/dashboard'} className={`transition-colors hover:text-primary ${isActive("/dashboard") || isActive("/admin") ? "text-primary font-bold" : "text-foreground/80"}`}>
              لوحة التحكم
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-primary/10 hover:bg-primary/20">
                  <User className="h-5 w-5 text-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.role === 'admin' ? 'مدير النظام' : 'مستخدم'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={user.role === 'admin' ? '/admin' : '/dashboard'}>
                    <div className="flex w-full items-center cursor-pointer">
                      <LayoutDashboard className="ml-2 h-4 w-4" />
                      لوحة التحكم
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="text-red-600 focus:text-red-600 cursor-pointer">
                  <LogOut className="ml-2 h-4 w-4" />
                  تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button asChild variant="ghost" className="font-bold">
                <Link href="/login">تسجيل الدخول</Link>
              </Button>
              <Button asChild className="font-bold shadow-lg shadow-primary/20">
                <Link href="/login?tab=register">حساب جديد</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
