"use client";

import { useEffect, useMemo, useState } from "react";
import { AddressForm } from "@/components/AddressForm";
import type { AbiItem, Indicator } from "@/lib/analysis";

type Report = { chain: string; address: string; contractName: string; verified: boolean; proxy: boolean; implementation: string | null; abi: AbiItem[]; indicators: Indicator[]; explorerUrl: string; sourceMessage: string };

export function Analyzer({ initialAddress }: { initialAddress?: string }) {
  const [address, setAddress] = useState(initialAddress || "");
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function run(value: string) {
    setLoading(true); setError(""); setReport(null);
    try {
      const response = await fetch(`/api/analyze?address=${encodeURIComponent(value)}`);
      const data = await response.json() as Report & { error?: string };
      if (!response.ok) throw new Error(data.error || "Unable to analyze this address.");
      setReport(data);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Unable to analyze this address."); }
    finally { setLoading(false); }
  }

  useEffect(() => { if (initialAddress && /^0x[a-fA-F0-9]{40}$/.test(initialAddress)) void run(initialAddress); }, [initialAddress]);
  const functions = useMemo(() => report?.abi.filter((item) => item.type === "function") || [], [report]);
  const events = useMemo(() => report?.abi.filter((item) => item.type === "event") || [], [report]);

  return <div className="container py-16 sm:py-24">
    <div className="max-w-[700px]"><p className="eyebrow mb-5">Contract analyzer / Ethereum mainnet</p><h1 className="serif text-5xl leading-[1.05] tracking-[-.04em] sm:text-7xl">Read the public<br /><span className="text-[#C3A56B]">surface.</span></h1><p className="mt-6 max-w-[570px] text-sm leading-6 text-[#989993]">Enter a public Ethereum contract address. TraceWorld retrieves verified metadata and ABI evidence from Etherscan without connecting a wallet.</p></div>
    <div className="mt-10 max-w-[760px]"><AddressForm compact /></div>
    {loading && <div className="panel mt-12 flex items-center gap-4 rounded-xl p-6" role="status"><span className="h-3 w-3 animate-pulse rounded-full bg-[#C3A56B]" /><span className="text-sm text-[#989993]">Retrieving source metadata and ABI from Etherscan…</span></div>}
    {error && <div className="mt-12 rounded-xl border border-[#743f3a] bg-[#261816] p-6" role="alert"><p className="eyebrow text-[#e7a19a]">Analysis unavailable</p><p className="mt-2 text-sm leading-6 text-[#e7c3bf]">{error}</p></div>}
    {report && <ReportView report={report} functions={functions} events={events} />}
    {!loading && !error && !report && <div className="mt-16 border-t hairline pt-6 text-xs text-[#747771]">No contract loaded. Analysis results appear here after submission.</div>}
  </div>;
}

function ReportView({ report, functions, events }: { report: Report; functions: AbiItem[]; events: AbiItem[] }) {
  return <div className="mt-16 space-y-12">
    <section><div className="section-rule mb-5"><p className="eyebrow">01 / Overview</p></div><div className="panel rounded-xl p-6 sm:p-8"><div className="flex flex-col justify-between gap-6 sm:flex-row"><div><p className="text-[11px] uppercase tracking-[.16em] text-[#747771]">Contract name</p><h2 className="mt-2 text-2xl">{report.contractName}</h2><p className="mt-3 break-all font-mono text-xs text-[#989993]">{report.address}</p></div><div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[.12em]"><span className="rounded-full border border-[#8c7650] px-3 py-1.5 text-[#C3A56B]">{report.chain}</span><span className={`rounded-full border px-3 py-1.5 ${report.verified ? "border-[#526c50] text-[#a7c5a2]" : "border-[#743f3a] text-[#e7a19a]"}`}>{report.verified ? "Verified source" : "Unverified"}</span></div></div><div className="mt-8 grid gap-3 sm:grid-cols-3"><Stat label="Functions" value={report.verified ? String(functions.length) : "Unknown"} /><Stat label="Events" value={report.verified ? String(events.length) : "Unknown"} /><Stat label="Proxy signal" value={report.verified ? (report.proxy ? "Detected" : "Not detected") : "Unknown"} /></div><a href={report.explorerUrl} target="_blank" rel="noreferrer" className="ghost-button focus-ring mt-7 inline-flex rounded px-4 py-3 text-xs uppercase tracking-[.14em]">View on Etherscan ↗</a></div></section>
    <section><div className="section-rule mb-5"><p className="eyebrow">02 / Functions & events</p></div>{report.verified ? <div className="grid gap-5 lg:grid-cols-2"><AbiTable title="Functions" items={functions} /><AbiTable title="Events" items={events} /></div> : <UnknownCard text="The contract is not verified on Etherscan. Functions, events, inputs, and outputs cannot be reliably listed." />}</section>
    <section><div className="section-rule mb-5"><p className="eyebrow">03 / Permissions</p></div><div className="grid gap-4 md:grid-cols-2">{report.indicators.map((indicator) => <IndicatorCard key={indicator.title} indicator={indicator} />)}</div></section>
    <section><div className="section-rule mb-5"><p className="eyebrow">04 / Findings & evidence</p></div><div className="panel rounded-xl p-6 sm:p-8"><p className="text-sm leading-6 text-[#989993]">TraceWorld surfaces indicators from public ABI names. It does not prove exploitability, intent, or contract safety.</p><div className="mt-6 space-y-4">{report.indicators.flatMap((item) => item.evidence.map((evidence) => <div key={`${item.title}-${evidence}`} className="border-l border-[#C3A56B] pl-4"><p className="text-xs font-medium">{item.title}</p><p className="mt-1 font-mono text-xs leading-5 text-[#989993]">{evidence}</p></div>))}</div></div></section>
    <section><div className="section-rule mb-5"><p className="eyebrow">05 / Source code status</p></div><div className="panel rounded-xl p-6"><div className="flex items-center gap-3"><span className={`h-2 w-2 rounded-full ${report.verified ? "bg-[#a7c5a2]" : "bg-[#e7a19a]"}`} /><p className="text-sm">{report.sourceMessage}</p></div>{report.implementation && <p className="mt-5 break-all text-xs text-[#989993]">Implementation address: <span className="font-mono">{report.implementation}</span></p>}</div></section>
  </div>;
}

function Stat({ label, value }: { label: string; value: string }) { return <div className="border hairline p-4"><p className="text-[10px] uppercase tracking-[.14em] text-[#747771]">{label}</p><p className="mt-3 text-xl text-[#C3A56B]">{value}</p></div>; }
function UnknownCard({ text }: { text: string }) { return <div className="panel rounded-xl p-6 text-sm leading-6 text-[#989993]"><span className="mr-2 text-[#C3A56B]">Unknown</span>{text}</div>; }
function AbiTable({ title, items }: { title: string; items: AbiItem[] }) { return <div className="panel overflow-hidden rounded-xl"><div className="border-b hairline px-5 py-4"><h3 className="text-sm">{title} <span className="ml-2 text-xs text-[#747771]">{items.length}</span></h3></div><div className="max-h-[370px] overflow-auto">{items.length ? items.map((item, index) => <div key={`${item.name}-${index}`} className="border-b hairline px-5 py-4 last:border-0"><p className="font-mono text-xs text-[#E8E7E0]">{item.name || "anonymous"}</p><p className="mt-2 text-[11px] text-[#747771]">{(item.inputs || []).map((input) => `${input.name || "_"}: ${input.type || "?"}`).join(", ") || "No inputs"}</p>{item.outputs?.length ? <p className="mt-1 text-[11px] text-[#989993]">returns {item.outputs.map((output) => output.type || "?").join(", ")}</p> : null}</div>) : <p className="p-5 text-xs text-[#747771]">No items returned.</p>}</div></div>; }
function IndicatorCard({ indicator }: { indicator: Indicator }) { const tone = indicator.status === "detected" ? "text-[#C3A56B]" : indicator.status === "unknown" ? "text-[#e7a19a]" : "text-[#a7c5a2]"; return <article className="panel rounded-xl p-5"><div className="flex items-center justify-between gap-4"><h3 className="text-sm">{indicator.title}</h3><span className={`text-[10px] uppercase tracking-[.12em] ${tone}`}>{indicator.status}</span></div><p className="mt-3 text-xs leading-5 text-[#989993]">{indicator.detail}</p><ul className="mt-4 space-y-2">{indicator.evidence.map((evidence) => <li key={evidence} className="font-mono text-[11px] leading-5 text-[#747771]">↳ {evidence}</li>)}</ul></article>; }
