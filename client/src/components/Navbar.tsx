import logoUrl from "@assets/emblem-of-syria-seeklogo_1769035838735.png";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ChevronDown, LayoutDashboard, LogOut, User, Menu, FileText, Home, Building2, Scale, Megaphone, Key } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChangePasswordDialog } from "@/components/ChangePasswordDialog";

export function Navbar() {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [legalMenuOpen, setLegalMenuOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const isActive = (path: string) => location === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/">
            <div className="flex items-center gap-2 md:gap-3 cursor-pointer">
              <div className="w-10 h-10 md:w-16 md:h-16 flex items-center justify-center overflow-hidden">
                <img src={logoUrl} alt="Emblem of Syria" className="h-full w-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs md:text-sm font-bold text-primary">الجمهورية العربية السورية</span>
                <span className="text-[10px] md:text-xs text-muted-foreground font-medium">وزارة الشؤون الإجتماعية والعمل</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className={`transition-colors hover:text-primary ${isActive("/") ? "text-primary font-bold" : "text-foreground/80"}`}>
            الرئيسية
          </Link>
          <Link href="/ngos" className={`transition-colors hover:text-primary ${isActive("/ngos") ? "text-primary font-bold" : "text-foreground/80"}`}>
            دليل المنظمات
          </Link>
          <Link href="/announcements" className={`transition-colors hover:text-primary ${isActive("/announcements") ? "text-primary font-bold" : "text-foreground/80"}`}>
            الأخبار
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger className={`flex items-center gap-1 transition-colors hover:text-primary outline-none ${location.startsWith("/legal") ? "text-primary font-bold" : "text-foreground/80"}`}>
              المرجعيات القانونية
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-80">
              <DropdownMenuItem asChild>
                <Link href="/legal/association-law" className="cursor-pointer text-right w-full justify-end">
                  قانون الجمعيات والمؤسسات الخاصة و لائحته التنفيدية
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/legal/other-laws" className="cursor-pointer text-right w-full justify-end">
                  القوانين والمراسيم المرتبطة بعمل المنظمات غير الحكومية
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {user && (
            <Link href={user.role === 'admin' ? '/admin' : '/dashboard'} className={`transition-colors hover:text-primary ${isActive("/dashboard") || isActive("/admin") ? "text-primary font-bold" : "text-foreground/80"}`}>
              لوحة التحكم
            </Link>
          )}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden lg:flex items-center gap-4">
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
                <DropdownMenuItem onClick={() => setChangePasswordOpen(true)} className="cursor-pointer" data-testid="menu-change-password">
                  <Key className="ml-2 h-4 w-4" />
                  تغيير كلمة المرور
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

        {/* Mobile Menu */}
        <div className="flex lg:hidden items-center gap-2">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full bg-primary/10 hover:bg-primary/20">
                  <User className="h-4 w-4 text-primary" />
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
                <DropdownMenuItem onClick={() => setChangePasswordOpen(true)} className="cursor-pointer" data-testid="menu-change-password">
                  <Key className="ml-2 h-4 w-4" />
                  تغيير كلمة المرور
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="text-red-600 focus:text-red-600 cursor-pointer">
                  <LogOut className="ml-2 h-4 w-4" />
                  تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          <DropdownMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuItem asChild>
                <Link href="/" className="cursor-pointer w-full" onClick={() => setMobileMenuOpen(false)}>
                  <div className="flex items-center gap-3 w-full">
                    <Home className="h-4 w-4" />
                    <span>الرئيسية</span>
                  </div>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link href="/ngos" className="cursor-pointer w-full" onClick={() => setMobileMenuOpen(false)}>
                  <div className="flex items-center gap-3 w-full">
                    <Building2 className="h-4 w-4" />
                    <span>دليل المنظمات</span>
                  </div>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="/announcements" className="cursor-pointer w-full" onClick={() => setMobileMenuOpen(false)}>
                  <div className="flex items-center gap-3 w-full">
                    <Megaphone className="h-4 w-4" />
                    <span>الأخبار</span>
                  </div>
                </Link>
              </DropdownMenuItem>

              <Collapsible open={legalMenuOpen} onOpenChange={setLegalMenuOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full px-2 py-1.5 text-sm rounded-sm hover:bg-accent cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Scale className="h-4 w-4" />
                    <span>المرجعيات القانونية</span>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${legalMenuOpen ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pr-6 space-y-1 mt-1">
                  <DropdownMenuItem asChild>
                    <Link href="/legal/association-law" className="cursor-pointer text-right w-full" onClick={() => { setMobileMenuOpen(false); setLegalMenuOpen(false); }}>
                      <div className="flex items-center gap-3 w-full">
                        <FileText className="h-4 w-4 shrink-0" />
                        <span className="text-sm">قانون الجمعيات والمؤسسات الخاصة</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/legal/other-laws" className="cursor-pointer text-right w-full" onClick={() => { setMobileMenuOpen(false); setLegalMenuOpen(false); }}>
                      <div className="flex items-center gap-3 w-full">
                        <FileText className="h-4 w-4 shrink-0" />
                        <span className="text-sm">القوانين والمراسيم الأخرى</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                </CollapsibleContent>
              </Collapsible>

              {user && (
                <DropdownMenuItem asChild>
                  <Link href={user.role === 'admin' ? '/admin' : '/dashboard'} className="cursor-pointer w-full" onClick={() => setMobileMenuOpen(false)}>
                    <div className="flex items-center gap-3 w-full">
                      <LayoutDashboard className="h-4 w-4" />
                      <span>لوحة التحكم</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
              )}

              {!user && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/login" className="cursor-pointer w-full" onClick={() => setMobileMenuOpen(false)}>
                      <div className="flex items-center gap-3 w-full">
                        <User className="h-4 w-4" />
                        <span>تسجيل الدخول</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/login?tab=register" className="cursor-pointer w-full" onClick={() => setMobileMenuOpen(false)}>
                      <div className="flex items-center gap-3 w-full text-primary font-medium">
                        <User className="h-4 w-4" />
                        <span>حساب جديد</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <ChangePasswordDialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen} />
    </nav>
  );
}
