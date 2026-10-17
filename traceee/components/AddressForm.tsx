"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Props = { compact?: boolean };

export function AddressForm({ compact = false }: Props) {
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = address.trim();
    if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
      setError("Enter a valid 42-character Ethereum address.");
      return;
    }
    setError("");
    router.push(`/analyze?address=${encodeURIComponent(value)}`);
  }

  return (
    <form onSubmit={submit} className={compact ? "w-full" : "w-full max-w-[720px]"} noValidate>
      <div className="panel flex flex-col gap-2 rounded-xl p-2 sm:flex-row">
        <label className="sr-only" htmlFor="contract-address">Ethereum contract address</label>
        <input
          id="contract-address"
          value={address}
          onChange={(event) => { setAddress(event.target.value); setError(""); }}
          placeholder="Paste an Ethereum contract address"
          spellCheck={false}
          autoComplete="off"
          className="focus-ring min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-[#E8E7E0] outline-none placeholder:text-[#747771]"
        />
        <div className="flex gap-2">
          <label className="sr-only" htmlFor="network">Network</label>
          <select id="network" disabled defaultValue="ethereum" className="focus-ring rounded-lg border hairline bg-[#0B0D0C] px-3 text-xs text-[#C3A56B] outline-none">
            <option value="ethereum">Ethereum · Mainnet</option>
          </select>
          <button className="gold-button focus-ring whitespace-nowrap rounded-lg px-4 py-3 text-xs font-bold uppercase tracking-[.12em]" type="submit">Analyze</button>
        </div>
      </div>
      {error && <p role="alert" className="mt-2 text-xs text-[#e7a19a]">{error}</p>}
      <p className="mt-3 text-[11px] leading-5 text-[#747771]">Ethereum mainnet only · Read-only analysis · No wallet connection required</p>
    </form>
  );
}
