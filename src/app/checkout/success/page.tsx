import { Suspense } from "react";
import SuccessClient from "./success-client";

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
          Loading...
        </div>
      }
    >
      <SuccessClient />
    </Suspense>
  );
}
