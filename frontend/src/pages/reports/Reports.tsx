/**
 * SentinelX AI — Reports Page
 *
 * Report generation form + history table. "Generate" simulates a Celery
 * PDF-generation job locally — wire to POST /api/v1/reports/generate and
 * GET /api/v1/reports/{id}/download once the backend is live.
 */
import { useState, type FormEvent } from "react";
import { FileText, Download, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import type { ReportItem, ReportType } from "@/types";

const REPORT_TYPES: Array<{ value: ReportType; label: string }> = [
  { value: "weekly", label: "Weekly District Summary" },
  { value: "hotspot", label: "Hotspot Assessment" },
  { value: "case", label: "Case File Report" },
];

const DISTRICTS = ["Bengaluru Urban", "Mysuru", "Mangaluru", "Hubballi-Dharwad", "Belagavi"];

const INITIAL_REPORTS: ReportItem[] = [
  {
    id: "r1",
    type: "weekly",
    title: "Weekly District Summary — Bengaluru Urban",
    generatedAt: new Date(Date.now() - 3600000).toISOString(),
    downloadUrl: "#",
  },
  {
    id: "r2",
    type: "hotspot",
    title: "Hotspot Assessment — Majestic Bus Stand",
    generatedAt: new Date(Date.now() - 86400000).toISOString(),
    downloadUrl: "#",
  },
  {
    id: "r3",
    type: "case",
    title: "Case File Report — FIR #KA-2026-08213",
    generatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    downloadUrl: "#",
  },
];

export default function Reports() {
  const [reports, setReports] = useState<ReportItem[]>(INITIAL_REPORTS);
  const [type, setType] = useState<ReportType>("weekly");
  const [district, setDistrict] = useState(DISTRICTS[0]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (e: FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 1200));

    const label = REPORT_TYPES.find((t) => t.value === type)?.label ?? "Report";
    const newReport: ReportItem = {
      id: crypto.randomUUID(),
      type,
      title: `${label} — ${district}`,
      generatedAt: new Date().toISOString(),
      downloadUrl: "#",
    };
    setReports((prev) => [newReport, ...prev]);
    setIsGenerating(false);
  };

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-white">Reports</h1>
        <p className="text-sm text-sx-text-dim mt-1">
          Generate PDF reports for command staff and case files
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate New Report</CardTitle>
          <CardDescription>Choose a report type and filters</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-xs font-medium text-sx-text-dim mb-1.5">
                Report Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ReportType)}
                className="bg-sx-panel border border-sx-border rounded-lg text-sm text-sx-text px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-sx-accent min-w-[220px]"
              >
                {REPORT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-sx-text-dim mb-1.5">
                District
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="bg-sx-panel border border-sx-border rounded-lg text-sm text-sx-text px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-sx-accent min-w-[200px]"
              >
                {DISTRICTS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>

            <Button
              type="submit"
              isLoading={isGenerating}
              leftIcon={!isGenerating ? <FileText className="h-4 w-4" /> : undefined}
            >
              {isGenerating ? "Generating…" : "Generate Report"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Report History</CardTitle>
          <CardDescription>{reports.length} reports generated</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-sx-text-faint uppercase tracking-wide border-b border-sx-border">
                <th className="px-5 py-3 font-medium">Report</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Generated</th>
                <th className="px-5 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sx-border">
              {reports.map((r) => (
                <tr key={r.id} className="hover:bg-sx-panel-light/50 transition-colors">
                  <td className="px-5 py-3 text-sx-text flex items-center gap-2">
                    <FileText className="h-4 w-4 text-sx-text-faint shrink-0" />
                    {r.title}
                    {isGenerating && r.id === reports[0]?.id && (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-sx-accent" />
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant="neutral">{r.type}</Badge>
                  </td>
                  <td className="px-5 py-3 text-sx-text-dim">
                    {new Date(r.generatedAt).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Button variant="ghost" size="sm" leftIcon={<Download className="h-3.5 w-3.5" />}>
                      Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
