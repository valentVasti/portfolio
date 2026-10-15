import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE_TITLE } from "./data";
import Cursor from "./components/cursor";
import AccentPanel from "./components/accent-panel";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: SITE_TITLE,
  description:
    "Portfolio of Metodius Frenaldy Vasti Valentino, Software Engineer building web applications and internal ERP systems.",
};

export const viewport: Viewport = {
  colorScheme: "dark light",
};

// Theme and accent are applied before first paint to avoid a flash. Defaults are dark and monochrome.
const themeScript = `document.documentElement.classList.add('js');try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);var a=localStorage.getItem('accent');if(a==='mono'||a==='orange'||a==='lime'||a==='teal'||a==='blue'||a==='orchid')document.documentElement.setAttribute('data-accent',a)}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} bg-bg font-sans text-fg antialiased`}>
        <div className="progress" aria-hidden="true" />
        <div className="grain" aria-hidden="true" />
        {children}
        <AccentPanel />
        <Cursor />
      </body>
    </html>
  );
}
