import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";
import ConditionalLanding from "@/components/ConditionalLanding";
import ReactQueryProvider from "lib/react-query-provider";

export const metadata: Metadata = {
  title: "Trendlama - Best Clothes",
  description: "Trendlama is the best place to find the best clothes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ReactQueryProvider>
          {/* Navbar ثابت */}
          <Navbar />

          {/* Landing يظهر بس في الصفحة الرئيسية */}
          <ConditionalLanding />

          {/* باقي الصفحات */}
          <div className="w-full mb-12">{children}</div>

          {/* Footer */}
          <div className="mx-auto p-4 sm:px-0 sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-6xl mb-8">
            <Footer />
          </div>

          <ToastContainer position="bottom-right" />
        </ReactQueryProvider>
      </body>
    </html>
  );
}