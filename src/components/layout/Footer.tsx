import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto bg-surface-container-low">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <Sparkles className="h-5 w-5 text-coral" />
            <span className="font-semibold">אנתרופיק IL</span>
          </div>
          <p className="text-sm text-on-surface-variant">
            אגרגטור חדשות Anthropic ו-Claude בעברית. תוכן מתורגם אוטומטית
            באמצעות Claude.
          </p>
        </div>
      </div>
    </footer>
  );
}
