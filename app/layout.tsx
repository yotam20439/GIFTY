import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "כרטיסים – הארנק של כרטיסי המתנה שלי",
  description: "כמה כרטיסי מתנה יש לי, כמה נשאר בכל אחד, ומתי הם פגים.",
};

export const viewport: Viewport = {
  themeColor: "#14181F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600&family=Suez+One&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-paper text-ink font-ui antialiased">{children}</body>
    </html>
  );
}
