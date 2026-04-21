"use client";

import dynamic from "next/dynamic";

const NewCategoryClient = dynamic(() => import("./NewCategoryClient"), { ssr: false });

export default function NewCategoryPage() {
  return <NewCategoryClient />;
}
