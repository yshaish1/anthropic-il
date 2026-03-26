import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#f5f3ef", borderTop: "1px solid #e4e2de", marginTop: "auto" }}>
      <div className="mx-auto max-w-[1200px] px-4" style={{ padding: "40px 16px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "40px",
            marginBottom: "40px",
          }}
        >
          {/* Brand */}
          <div>
            <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#030612", textTransform: "uppercase", marginBottom: "16px" }}>
              אנתרופיק IL
            </h4>
            <p style={{ fontSize: "14px", color: "#45464c", lineHeight: 1.7 }}>
              אגרגטור חדשות Anthropic ו-Claude בעברית.
              תוכן מתורגם אוטומטית באמצעות Claude.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#030612", textTransform: "uppercase", marginBottom: "16px" }}>
              ניווט
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { href: "/news", label: "חדשות" },
                { href: "/reddit", label: "רדיט" },
                { href: "/tips", label: "טיפים" },
                { href: "/releases", label: "עדכונים" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:!text-[#ab2c5d] transition-colors"
                  style={{ fontSize: "14px", color: "#45464c" }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* External Links */}
          <div>
            <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#030612", textTransform: "uppercase", marginBottom: "16px" }}>
              קישורים
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { href: "https://www.anthropic.com", label: "Anthropic" },
                { href: "https://claude.ai", label: "Claude" },
                { href: "https://www.reddit.com/r/ClaudeAI", label: "r/ClaudeAI" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:!text-[#ab2c5d] transition-colors"
                  style={{ fontSize: "14px", color: "#45464c" }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div style={{ paddingTop: "24px", borderTop: "1px solid #e4e2de", textAlign: "center" }}>
          <p style={{ fontSize: "14px", color: "#45464c" }}>
            עמוד זה אינו קשור רשמית לאנתרופיק, אך מוקדש לקהילת המשתמשים בישראל
          </p>
        </div>
      </div>
    </footer>
  );
}
