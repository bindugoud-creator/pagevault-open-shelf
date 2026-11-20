import { Link } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { LogoMark } from "./logo";

export function Footer() {
  return (
    <footer id="about" className="bg-espresso-deep text-cream/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <LogoMark />
            <span className="font-heading text-xl font-bold text-cream">MRV BookHub</span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed">
            MRV BookHub is the college's home for academic books — a student-run exchange for
            borrowing and selling textbooks, plus a full digital front-door to the MRV Central
            Library. Built by students, for students.
          </p>
        </div>
        <div>
          <p className="eyebrow font-heading text-gold">Quick links</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link to="/browse" className="hover:text-cream">Browse Books</Link></li>
            <li><Link to="/digital-library" className="hover:text-cream">Digital Library</Link></li>
            <li><Link to="/upload" className="hover:text-cream">Upload your book</Link></li>
            <li><Link to="/about" className="hover:text-cream">About & FAQ</Link></li>
            <li><Link to="/register" className="hover:text-cream">Create an account</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow font-heading text-gold">Contact</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li className="flex items-center gap-2"><MapPin className="size-4 text-blush" /> MRV College Campus, Hyderabad</li>
            <li className="flex items-center gap-2"><Mail className="size-4 text-blush" /> <a href="mailto:library@mrv.edu" className="hover:text-cream">library@mrv.edu</a></li>
            <li className="flex items-center gap-2"><Phone className="size-4 text-blush" /> +91 97000 00000</li>
            <li className="flex items-center gap-2"><Clock className="size-4 text-blush" /> Mon–Sat · 9 AM to 6 PM</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-espresso-soft py-5 text-center font-mono text-xs text-cream/50">
        © {new Date().getFullYear()} MRV BookHub · Campus. Books. One Platform.
      </div>
    </footer>
  );
}
