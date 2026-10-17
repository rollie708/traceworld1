import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="border-b hairline">
      <div className="container flex h-[78px] items-center justify-between gap-6">
        <Link href="/" className="focus-ring flex items-center gap-3 rounded-md" aria-label="TraceWorld home">
          <Image src="/traceworld-logo.svg" alt="TraceWorld" width={164} height={56} priority className="h-12 w-auto object-contain object-left" />
        </Link>
        <nav className="flex items-center gap-5 text-xs uppercase tracking-[.16em] text-[#989993] sm:gap-8" aria-label="Main navigation">
          <Link className="focus-ring rounded py-2 transition hover:text-[#E8E7E0]" href="/analyze">Analyzer</Link>
          <Link className="focus-ring rounded py-2 transition hover:text-[#E8E7E0]" href="/methodology">Methodology</Link>
          <a className="gold-button hidden rounded px-4 py-2.5 text-[10px] font-bold tracking-[.16em] sm:block" href="/analyze">START TRACE</a>
        </nav>
      </div>
    </header>
  );
}
