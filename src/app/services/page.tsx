import { Suspense } from "react";
import Services from "@/components/Services";

export default function ServicesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Services />
    </Suspense>
  );
} 