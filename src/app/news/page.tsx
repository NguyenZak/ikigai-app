import type { Metadata } from "next";
import NewsClient from "./NewsClient";

export const metadata: Metadata = {
  title: "Tin Tức & Sự Kiện | IKIGAIVILLA",
  description: "Cập nhật những tin tức mới nhất về IKIGAIVILLA, các sự kiện đặc biệt, khuyến mãi và thông tin về dịch vụ nghỉ dưỡng đẳng cấp 5 sao.",
  keywords: ["tin tức", "sự kiện", "khuyến mãi", "IKIGAIVILLA", "nghỉ dưỡng", "spa onsen"],
  openGraph: {
    title: "Tin Tức & Sự Kiện | IKIGAIVILLA",
    description: "Cập nhật những tin tức mới nhất về IKIGAIVILLA, các sự kiện đặc biệt, khuyến mãi và thông tin về dịch vụ nghỉ dưỡng đẳng cấp 5 sao.",
    url: "https://ikigaivilla.vn/news",
    siteName: "IKIGAIVILLA",
    images: [
      {
        url: "/banner/ONSEN 10_4.png",
        width: 1200,
        height: 630,
        alt: "Tin Tức & Sự Kiện IKIGAIVILLA",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tin Tức & Sự Kiện | IKIGAIVILLA",
    description: "Cập nhật những tin tức mới nhất về IKIGAIVILLA.",
    images: ["/banner/ONSEN 10_4.png"],
  },
  alternates: {
    canonical: "/news",
  },
};

export default function NewsPage() {
  return <NewsClient />;
} 