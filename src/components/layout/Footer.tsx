import Link from "next/link";
import { Mail, Share2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full py-12 mt-20 bg-slate-50">
      <div className="flex flex-col items-center justify-center gap-6 max-w-[1280px] mx-auto text-center w-full">
        <Link href="/" className="text-xl font-extrabold text-primary headline-font">
          אנתרופיק IL
        </Link>
        <div className="flex flex-wrap justify-center gap-8 text-sm">
          <a className="text-slate-500 hover:text-accent transition-colors underline-offset-4 hover:underline" href="#">אודות</a>
          <a className="text-slate-500 hover:text-accent transition-colors underline-offset-4 hover:underline" href="#">תנאי שימוש</a>
          <a className="text-slate-500 hover:text-accent transition-colors underline-offset-4 hover:underline" href="#">פרטיות</a>
          <a className="text-slate-500 hover:text-accent transition-colors underline-offset-4 hover:underline" href="#">צרו קשר</a>
        </div>
        <div className="flex gap-4">
          <a className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-accent transition-all duration-200" href="#">
            <Mail className="h-4 w-4" />
          </a>
          <a className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-accent transition-all duration-200" href="#">
            <Share2 className="h-4 w-4" />
          </a>
        </div>
        <p className="text-sm leading-relaxed text-slate-400">
          © 2026 אנתרופיק IL. כל הזכויות שמורות.
        </p>
      </div>
    </footer>
  );
}
