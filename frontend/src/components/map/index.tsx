"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamically import the BaseMap component, disabling SSR to avoid window is not defined errors
const MapDynamic = dynamic(() => import("./base-map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-muted/30">
      <Skeleton className="h-full w-full" />
    </div>
  ),
});

export default MapDynamic;
