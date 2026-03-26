import { Globe, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full pt-12 pb-24 px-6 bg-surface-container-low flex flex-col items-end space-y-4">
      <span className="font-bold text-2xl text-primary mb-4 block tracking-tighter">
        אנתרופיק IL
      </span>
      <div className="flex gap-8 mb-6">
        <a className="text-sm text-primary/70 hover:text-primary transition-colors" href="#">
          תנאי שימוש
        </a>
        <a className="text-sm text-primary/70 hover:text-primary transition-colors" href="#">
          פרטיות
        </a>
        <a className="text-sm text-primary/70 hover:text-primary transition-colors" href="#">
          צור קשר
        </a>
      </div>
      <div className="flex gap-4 mb-4">
        <a
          className="p-2 bg-surface-container-high rounded-full hover:bg-secondary-fixed transition-colors"
          href="https://www.anthropic.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Globe className="h-5 w-5 text-primary" />
        </a>
        <a
          className="p-2 bg-surface-container-high rounded-full hover:bg-secondary-fixed transition-colors"
          href="https://www.reddit.com/r/ClaudeAI"
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle className="h-5 w-5 text-primary" />
        </a>
      </div>
      <p className="text-sm text-primary/60">
        © 2026 אנתרופיק IL - כל הזכויות שמורות
      </p>
    </footer>
  );
}
