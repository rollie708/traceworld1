import { Analyzer } from "@/components/Analyzer";

export default function AnalyzePage({ searchParams }: { searchParams: { address?: string } }) {
  return <main><Analyzer initialAddress={searchParams.address} /></main>;
}
