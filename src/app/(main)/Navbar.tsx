import SearchField from "@/components/SearchField";
import UserButton from "@/components/UserButton";
import Link from "next/link";
import LanguageSwitcher from "../../components/LanguageSwitcher"; // Adjusted path

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-card shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-5 px-5 py-3">
        <Link href="/" className="text-2xl font-bold text-primary">
          GoTogether
        </Link>
        <SearchField />
        <div className="flex items-center gap-3 sm:ms-auto"> {/* Wrapper div for UserButton and LanguageSwitcher */}
          <LanguageSwitcher />
          <UserButton />
        </div>
      </div>
    </header>
  );
}
