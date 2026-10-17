import Link from "next/link";
import { AddressForm } from "@/components/AddressForm";

const features = [
  ["01", "Source-first", "Start with what the explorer can verify. TraceWorld separates confirmed contract data from the unknown."],
  ["02", "Permission map", "Surface ownership, roles, pausing, minting, and administrative functions visible in the ABI."],
  ["03", "Evidence attached", "Every indicator points back to the function or event that caused it to appear."],
];

export default function HomePage() {
  return (
    <main>
      <section className="container relative flex min-h-[620px] flex-col justify-center py-24 lg:min-h-[670px]">
        <div className="absolute right-0 top-24 hidden h-52 w-52 dot-grid opacity-60 lg:block" aria-hidden="true" />
        <p className="eyebrow mb-7">Smart contract intelligence / Ethereum</p>
        <h1 className="serif max-w-[850px] text-5xl leading-[1.04] tracking-[-.045em] text-[#E8E7E0] sm:text-7xl lg:text-[92px]">Understand what&apos;s<br /><span className="text-[#C3A56B]">beneath the code.</span></h1>
        <p className="mt-8 max-w-[540px] text-base leading-7 text-[#989993]">TraceWorld turns public contract data into a clear, evidence-led map of what a smart contract exposes, controls, and leaves unknown.</p>
        <div className="mt-10"><AddressForm /></div>
        <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-3 border-t hairline pt-5 text-[10px] uppercase tracking-[.16em] text-[#747771]">
          <span><i className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[#C3A56B]" />Etherscan API V2</span><span>Verified data only</span><span>Read-only</span>
        </div>
      </section>

      <section className="border-y hairline bg-[#101210] py-24">
        <div className="container">
          <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow mb-4">The TraceWorld lens</p><h2 className="serif max-w-[580px] text-4xl leading-tight tracking-[-.03em] sm:text-5xl">Less noise.<br />More signal.</h2></div><p className="max-w-[310px] text-sm leading-6 text-[#989993]">A practical first pass for researchers, builders, and curious humans reading on-chain systems.</p></div>
          <div className="grid gap-px overflow-hidden border hairline bg-[rgba(232,231,224,.13)] md:grid-cols-3">
            {features.map(([number, title, text]) => <article key={number} className="bg-[#101210] p-7"><span className="text-xs text-[#C3A56B]">{number}</span><h3 className="mt-16 text-lg font-medium">{title}</h3><p className="mt-3 text-sm leading-6 text-[#989993]">{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="container py-24">
        <div className="section-rule mb-8"><p className="eyebrow">Interface preview</p><span className="text-[10px] uppercase tracking-[.16em] text-[#747771]">Demonstration only</span></div>
        <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
          <div className="panel rounded-xl p-6 sm:p-8"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] uppercase tracking-[.16em] text-[#747771]">Contract overview</p><h3 className="mt-3 text-2xl">Evidence, in context.</h3></div><span className="rounded-full border border-[#8c7650] px-3 py-1 text-[10px] uppercase tracking-[.12em] text-[#C3A56B]">Demo</span></div><div className="mt-9 grid gap-3 sm:grid-cols-3">{[["Source", "Verified"], ["Functions", "18"], ["Events", "9"]].map(([a,b]) => <div key={a} className="border hairline p-4"><p className="text-[10px] uppercase tracking-[.14em] text-[#747771]">{a}</p><p className="mt-3 text-lg text-[#C3A56B]">{b}</p></div>)}</div><p className="mt-6 border-l border-[#C3A56B] pl-4 text-sm leading-6 text-[#989993]">Static interface demonstration. Values above are not retrieved from a live contract.</p></div>
          <div className="flex flex-col justify-center rounded-xl border border-[#8c7650] bg-[#191B19] p-6 sm:p-8"><p className="eyebrow">Built for careful reading</p><p className="serif mt-5 text-3xl leading-tight">“Unknown” is a useful result.</p><p className="mt-5 text-sm leading-6 text-[#989993]">TraceWorld never turns an absence of evidence into a safety claim. When the public data cannot establish something, the interface says so.</p><Link className="ghost-button focus-ring mt-8 inline-flex w-fit rounded px-4 py-3 text-xs uppercase tracking-[.14em]" href="/methodology">Read the methodology →</Link></div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function Footer() { return <footer className="border-t hairline"><div className="container flex flex-col justify-between gap-5 py-8 text-xs text-[#747771] sm:flex-row sm:items-center"><span className="tracking-[.16em] text-[#E8E7E0]">TRACEWORLD</span><span>Decode. Trace. Understand.</span><span>Public data · No wallet · No custody</span></div></footer>; }
