"use client";

import dynamic from "next/dynamic";

const NewAuthorClient = dynamic(() => import("./NewAuthorClient"), { ssr: false });

export default function NewAuthorPage() {
  return <NewAuthorClient />;
}
