import { useState, type FormEvent } from "react";
import { FileText, Download } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import type { ReportType } from "@/types";
import { reportsApi, geoApi } from "@/api";

const REPORT_TYPES: Array<{ value: ReportType; label: string }> = [
  { value: "weekly", label: "Weekly District Summary" },
  { value: "hotspot", label: "Hotspot Assessment" },
  { value: "case", label: "Case File Report" },
];

export default function Reports() {
  const queryClient = useQueryClient();
  const [type, setType] = useState<ReportType>("weekly");
  const [district, setDistrict] = useState("");
  const [downloadError, setDownloadError] = useState("");

  const { data: districtsData } = useQuery({
    queryKey: ["districts"],
    queryFn: geoApi.getDistricts,
  });

  const districts = districtsData || [];
  const selectedDistrictId = district || (districts.length > 0 ? districts[0].id : "");
  const selectedDistrictName = districts.find((d: any) => d.id === selectedDistrictId)?.name || "";

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: () => reportsApi.getReports(),
    refetchInterval: (query) => {
      const data = query.state.data as any[] | undefined;
      if (data && data.some(r => r.status === 'pending' || r.status === 'generating')) {
        return 2000;
      }
      return false;
    }
  });

  const { mutate: generateReport, isPending: isGenerating } = useMutation({
    mutationFn: reportsApi.createReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    }
  });

  const handleGenerate = (e: FormEvent) => {
    e.preventDefault();
    const label = REPORT_TYPES.find((t) => t.value === type)?.label ?? "Report";
    generateReport({
      title: `${label} — ${selectedDistrictName}`,
      type: type,
      district_id: selectedDistrictId,
    });
  };

  const handleDownload = async (reportId: string) => {
    try {
      const response = await reportsApi.downloadReport(reportId);
      // Create a blob URL from the response and trigger download
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${reportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      setDownloadError("Failed to download.");
    }
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
                value={selectedDistrictId}
                onChange={(e) => setDistrict(e.target.value)}
                className="bg-sx-panel border border-sx-border rounded-lg text-sm text-sx-text px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-sx-accent min-w-[200px]"
              >
                {districts.map((d: any) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
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
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Generated</th>
                <th className="px-5 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sx-border">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-3 text-center text-sx-text-dim">Loading reports...</td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-3 text-center text-sx-text-dim">No reports generated yet.</td>
                </tr>
              ) : (
                reports.map((r: any) => (
                  <tr key={r.id} className="hover:bg-sx-panel-light/50 transition-colors">
                    <td className="px-5 py-3 text-sx-text flex items-center gap-2">
                      <FileText className="h-4 w-4 text-sx-text-faint shrink-0" />
                      <span className="truncate max-w-[300px]">{r.title}</span>
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant="neutral">{r.type}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={r.status === 'ready' ? 'success' : r.status === 'failed' ? 'critical' : 'medium'}>
                        {r.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-sx-text-dim">
                      {new Date(r.created_at).toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        leftIcon={<Download className="h-3.5 w-3.5" />} 
                        onClick={() => handleDownload(r.id)}
                        disabled={r.status !== 'ready'}
                      >
                        Download
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {downloadError && <p className="px-5 py-3 text-xs text-sx-critical">{downloadError}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
