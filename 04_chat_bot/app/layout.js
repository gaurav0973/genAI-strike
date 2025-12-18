import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Load the font
const jetbrains = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-mono' 
});

export const metadata = {
  title: "AI Chatbot",
  description: "Simple Next.js 16 AI Chatbot",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={jetbrains.className}>
        {children}
      </body>
    </html>
  );
}