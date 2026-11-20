import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PICKUP_WINDOW_HOURS, LOAN_DAYS } from "@/lib/library";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About & FAQ · MRV BookHub" },
      { name: "description", content: "What MRV BookHub is, who it's for, and answers to common questions about borrowing and reserving books." },
      { property: "og:title", content: "About & FAQ · MRV BookHub" },
      { property: "og:description", content: "The student-run book exchange and digital library for MRV College." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AboutPage,
});

const ROLES = [
  ["Students", "Borrow, lend and sell textbooks, and reserve library copies."],
  ["Faculty", "Recommend titles and reserve reference copies for courses."],
  ["Librarians", "Issue reserved copies at the counter and track returns."],
  ["Vendors", "List new and used books for sale to the campus."],
  ["Admins", "Keep the platform safe and the catalogue up to date."],
];

const FAQ = [
  ["Is borrowing free?", "Yes — most books shared by students are free to borrow. Some owners also offer to sell their copy."],
  ["How long can I keep a library book?", `Library loans run for ${LOAN_DAYS} days from the day you collect the copy.`],
  ["What happens if I don't collect a reservation?", `Reservations are held for ${PICKUP_WINDOW_HOURS} hours. After that the copy goes back on the shelf.`],
  ["How do I list my own book?", "Create an account, tap Upload, and fill in the title — we fill in the rest for catalogue titles."],
];

function AboutPage() {
  return (
    <div>
      <section className="bg-hero text-cream">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center lg:px-8">
          <p className="eyebrow text-gold">About MRV BookHub</p>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Built by students, for students</h1>
          <p className="mx-auto mt-4 max-w-2xl text-cream/75">
            A student-run exchange for borrowing and selling textbooks, plus a full digital
            front-door to the MRV Central Library.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-14 lg:px-8">
        <h2 className="text-3xl font-bold">Who it's for</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {ROLES.map(([t, d]) => (
            <div key={t} className="rounded-2xl border bg-card p-5 shadow-card">
              <h3 className="text-lg font-semibold">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
        <h2 className="mt-14 text-3xl font-bold">Questions</h2>
        <Accordion type="single" collapsible className="mt-4 max-w-3xl">
          {FAQ.map(([q, a]) => (
            <AccordionItem key={q} value={q}>
              <AccordionTrigger className="text-left">{q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <Button variant="hero" size="xl" className="mt-10" asChild>
          <Link to="/register">Create your free account</Link>
        </Button>
      </section>
    </div>
  );
}
