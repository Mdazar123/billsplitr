"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  const isGroupChatPage = /^\/group\/[^/]+\/chat$/.test(pathname);

  if (isGroupChatPage) return null;
  return <Navbar />;
} 