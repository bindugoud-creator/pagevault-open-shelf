import { useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuthShell, safeRedirect } from "@/components/site/auth-shell";
import { DEPARTMENTS, ROLES, type Department, type Role } from "@/lib/books";
import { register } from "@/lib/store";

type RegisterSearch = { redirect?: string };

export const Route = createFileRoute("/register")({
  validateSearch: (s: Record<string, unknown>): RegisterSearch =>
    typeof s["redirect"] === "string" ? { redirect: s["redirect"] } : {},
  head: () => ({
    meta: [
      { title: "Create an account · MRV BookHub" },
      { name: "description", content: "Join MRV BookHub as a student, faculty member, librarian, vendor or admin." },
      { property: "og:title", content: "Create an account · MRV BookHub" },
      { property: "og:description", content: "Join the MRV College book exchange and digital library." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { redirect } = Route.useSearch();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    rollNo: "",
    role: "Student" as Role,
    department: "CSE" as Department,
  });
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Use at least 6 characters for your password.");
      return;
    }
    setBusy(true);
    try {
      const user = await register(form);
      toast.success(`Welcome to BookHub, ${user.name.split(" ")[0]}!`);
      router.history.push(safeRedirect(redirect));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't create your account.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell title="Join BookHub" subtitle="Borrow, lend and reserve books across MRV College.">
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Aarav Reddy" className="h-11" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">College email</Label>
          <Input id="email" type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@mrv.edu" className="h-11" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>I am a</Label>
            <Select value={form.role} onValueChange={(v) => set("role", v as Role)}>
              <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Department</Label>
            <Select value={form.department} onValueChange={(v) => set("department", v as Department)}>
              <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="roll">Roll / staff number (optional)</Label>
          <Input id="roll" value={form.rollNo} onChange={(e) => set("rollNo", e.target.value)} placeholder="22MRV1A0501" className="h-11" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required minLength={6} value={form.password} onChange={(e) => set("password", e.target.value)} className="h-11" />
        </div>
        <Button type="submit" variant="hero" size="xl" className="w-full" disabled={busy}>
          <UserPlus /> {busy ? "Creating account…" : "Create account"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" search={redirect ? { redirect } : {}} className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}
