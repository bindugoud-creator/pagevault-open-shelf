import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, LogOut, Menu, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LogoMark } from "./logo";
import { logout, useCurrentUser } from "@/lib/store";

const NAV = [
  { label: "Browse Books", to: "/browse" },
  { label: "Digital Library", to: "/digital-library" },
  { label: "How It Works", to: "/", hash: "how-it-works" },
  { label: "About", to: "/about" },
] as const;

const linkCls =
  "rounded-lg px-3 py-2 text-sm font-medium text-cream/85 transition-colors hover:bg-espresso-soft hover:text-cream";

function Brand() {
  return (
    <Link to="/" aria-label="MRV BookHub home" className="flex items-center gap-2.5">
      <LogoMark />
      <span className="leading-tight">
        <span className="block font-heading text-lg font-bold tracking-tight text-cream">
          MRV BookHub
        </span>
        <span className="block text-[10px] uppercase tracking-[0.22em] text-blush">
          Campus Book Exchange
        </span>
      </span>
    </Link>
  );
}

export function Navbar() {
  const user = useCurrentUser();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const signOut = () => {
    logout();
    void navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-40 bg-espresso shadow-nav">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 lg:px-8">
        <Brand />

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.label}
              to={n.to}
              {...("hash" in n ? { hash: n.hash } : {})}
              className={linkCls}
              activeProps={"hash" in n ? {} : { className: "bg-espresso-soft text-cream" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <Button variant="onDarkOutline" size="sm" asChild>
                <Link to="/upload">
                  <Upload />
                  Upload
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex size-9 items-center justify-center rounded-full bg-blush font-semibold text-espresso transition-transform hover:scale-105"
                    aria-label="Account menu"
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-xs font-normal text-muted-foreground">
                      {user.role} · {user.department}
                    </p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">
                      <LayoutDashboard className="size-4" /> My dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/upload">
                      <Upload className="size-4" /> Upload a book
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="size-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="onDark" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button variant="hero" size="sm" asChild>
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="onDark" size="icon" className="md:hidden" aria-label="Open menu">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="border-espresso-soft bg-espresso text-cream">
            <SheetHeader>
              <SheetTitle className="text-left text-cream">Menu</SheetTitle>
            </SheetHeader>
            <nav className="mt-6 flex flex-col gap-1" onClick={() => setOpen(false)}>
              {NAV.map((n) => (
                <Link
                  key={n.label}
                  to={n.to}
                  {...("hash" in n ? { hash: n.hash } : {})}
                  className={linkCls}
                >
                  {n.label}
                </Link>
              ))}
              <div className="my-3 h-px bg-espresso-soft" />
              {user ? (
                <>
                  <Link to="/dashboard" className={linkCls}>
                    My dashboard
                  </Link>
                  <Link to="/upload" className={linkCls}>
                    Upload a book
                  </Link>
                  <button onClick={signOut} className={`${linkCls} text-left`}>
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className={linkCls}>
                    Login
                  </Link>
                  <Link to="/register" className={linkCls}>
                    Register
                  </Link>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
