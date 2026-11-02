import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatThaiDate(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return '—';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '—';
  
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear() + 543;
  return `${day}/${month}/${year}`;
}

export const EXTENSION_BADGE_CLASS: Record<string, string> = {
  pdf: "bg-rose-50 text-rose-700 border-rose-200/80 font-bold",
  dwg: "bg-sky-50 text-sky-700 border-sky-200/80 font-bold",
  sldprt: "bg-emerald-50 text-emerald-700 border-emerald-200/80 font-bold",
  sldasm: "bg-emerald-50 text-emerald-700 border-emerald-200/80 font-bold",
  slddrw: "bg-emerald-50 text-emerald-700 border-emerald-200/80 font-bold",
};

export const EXTENSION_DOT_CLASS: Record<string, string> = {
  pdf: "bg-rose-500",
  dwg: "bg-sky-500",
  sldprt: "bg-emerald-500",
  sldasm: "bg-emerald-500",
  slddrw: "bg-emerald-500",
};

export function getExtensionBadgeClass(ext?: string | null): string {
  if (!ext) return "bg-slate-50 text-slate-700 border-slate-200/80 font-bold";
  return EXTENSION_BADGE_CLASS[ext.toLowerCase()] || "bg-slate-50 text-slate-700 border-slate-200/80 font-bold";
}

export function getExtensionDotClass(ext?: string | null): string {
  if (!ext) return "bg-slate-400";
  return EXTENSION_DOT_CLASS[ext.toLowerCase()] || "bg-slate-400";
}

export function getPaginationItems(currentPage: number, totalPages: number): (number | string)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages: (number | string)[] = [];
  pages.push(1);

  if (currentPage > 3) {
    pages.push("...");
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 2) {
    pages.push("...");
  }

  pages.push(totalPages);
  return pages;
}

