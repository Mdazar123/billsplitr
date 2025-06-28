"use client";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer"; // adjust path if needed

export default function ConditionalFooter() {
  const pathname = usePathname();
  const isGroupChatPage = /^\/group\/[^/]+\/chat$/.test(pathname);

  if (isGroupChatPage) return null;
  return <Footer />;
}
