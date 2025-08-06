import React from "react";
import type { Metadata } from "next";
// import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "../lib/fontawesome";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import FloatingContact from "../components/FloatingContact";

// const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
// const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });

export const metadata: Metadata = {
  title: {
    default: "IKIGAIVILLA - Trung Tâm Phức Hợp Nghỉ Dưỡng Đẳng Cấp 5 Sao",
    template: "%s | IKIGAIVILLA"
  },
  description: "IKIGAIVILLA - Trung tâm phức hợp nghỉ dưỡng đẳng cấp 5 sao tại Việt Nam. Trải nghiệm dịch vụ spa onsen, ẩm thực Nhật Bản, phòng nghỉ sang trọng và các tiện ích đẳng cấp quốc tế.",
  keywords: ["nghỉ dưỡng", "spa onsen", "khách sạn 5 sao", "Ikigai Villa", "nghỉ dưỡng Việt Nam", "spa Nhật Bản", "ẩm thực Nhật Bản"],
  authors: [{ name: "IKIGAIVILLA" }],
  creator: "IKIGAIVILLA",
  publisher: "IKIGAIVILLA",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ikigaivilla.vn'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://ikigaivilla.vn',
    title: 'IKIGAIVILLA - Trung Tâm Phức Hợp Nghỉ Dưỡng Đẳng Cấp 5 Sao',
    description: 'IKIGAIVILLA - Trung tâm phức hợp nghỉ dưỡng đẳng cấp 5 sao tại Việt Nam. Trải nghiệm dịch vụ spa onsen, ẩm thực Nhật Bản, phòng nghỉ sang trọng và các tiện ích đẳng cấp quốc tế.',
    siteName: 'IKIGAIVILLA',
    images: [
      {
        url: '/banner/ONSEN 10_4.png',
        width: 1200,
        height: 630,
        alt: 'IKIGAIVILLA - Trung Tâm Phức Hợp Nghỉ Dưỡng',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IKIGAIVILLA - Trung Tâm Phức Hợp Nghỉ Dưỡng Đẳng Cấp 5 Sao',
    description: 'IKIGAIVILLA - Trung tâm phức hợp nghỉ dưỡng đẳng cấp 5 sao tại Việt Nam.',
    images: ['/banner/ONSEN 10_4.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        <meta name="theme-color" content="#d11e0f" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="IKIGAIVILLA" />
      </head>
      <body
        className="antialiased"
      >
        <NavBar />
        {children}
        <Footer />
        <FloatingContact />
      </body>
    </html>
  );
}
