"use client";

import SearchField from "@/components/SearchField";
import UserButton from "@/components/UserButton";
import Link from "next/link";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import SubscriptionModal from "./SubscriptionModal"; // 👈 Import your modal

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-card shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-5 py-3">
        {/* Left: Modal Button + Logo */}
        <div className="flex items-center gap-3">
          <SubscriptionModal /> {/* 👈 Trigger is inside this component */}
          <Link href="/" className="text-2xl font-bold text-primary">
            GoTogether
          </Link>
        </div>

        {/* Center: Search */}
        <SearchField />

        {/* Right: Language Switcher & User */}
        <div className="flex items-center gap-3 sm:ms-auto">
          <LanguageSwitcher />
          <UserButton />
        </div>
      </div>
    </header>
  );
}
