import type { ReactNode } from "react";
import libraryImage from "@/assets/library.webp.asset.json";
import { BOOKS } from "@/lib/books";
import { BookCover } from "./book-cover";

const SHOWCASE = ["clrs", "aima", "os", "dl"].flatMap((id) => BOOKS.filter((b) => b.id === id));

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <img src={libraryImage.url} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-image-fade" />
        <div className="absolute inset-x-0 bottom-0 p-10">
          <div className="flex items-end gap-3">
            {SHOWCASE.map((b, i) => (
              <BookCover
                key={b.id}
                src={b.cover}
                title={b.title}
                className={i % 2 ? "w-24 -rotate-2" : "w-28 rotate-1"}
              />
            ))}
          </div>
          <p className="mt-6 font-heading text-3xl font-bold text-cream">
            Every textbook on campus, one search away.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center px-4 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold">{title}</h1>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function safeRedirect(target: string | undefined): string {
  return target && target.startsWith("/") && !target.startsWith("//") ? target : "/dashboard";
}
