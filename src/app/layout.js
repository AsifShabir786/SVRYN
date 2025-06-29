import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import AuthWrapper from "./auth-wrapper";
import ToastProvider from "@/components/ui/toast-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Svryn Social",
  description: "Making clone of Svryn Social",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthWrapper>
            {children}
            <ToastProvider />
          </AuthWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
