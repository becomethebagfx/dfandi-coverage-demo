"use client";

import dynamic from "next/dynamic";

const USMap = dynamic(() => import("./USMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[460px] rounded-2xl bg-slate-100 grid place-items-center text-sm text-slate-500">
      Loading coverage map...
    </div>
  ),
});

export default USMap;
