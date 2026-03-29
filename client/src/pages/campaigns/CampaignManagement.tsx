import { useState, useRef } from "react";
import { Upload, Download, FileText, CheckCircle, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const CSV_COLUMNS = [
  "date",
  "time",
  "location",
  "audience",
  "summary",
  "call_to_action",
  "execution_notes",
  "topic_plan",
];

const TEMPLATE_ROW = [
  "03/29/2026",
  "2:00 PM",
  "Phoenix Convention Center",
  "Phoenix Chamber of Commerce",
  "Quarterly outreach on new SBA loan programs",
  "Schedule a follow-up consultation",
  "Bring brochures and sign-up sheets",
  "Small business financing options",
];

function downloadTemplate() {
  const header = CSV_COLUMNS.join(",");
  const row = TEMPLATE_ROW.map((v) => `"${v}"`).join(",");
  const csv = [header, row].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "campaign_template.csv";
  a.click();
  URL.revokeObjectURL(url);
}

interface UploadResult {
  eventsCreated: number;
  audiencesAutoCreated: number;
  noticesCreated: number;
  autoCreatedAudienceNames: string[];
  errors: string[];
}

export default function CampaignManagementPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const qc = useQueryClient();
  const { toast } = useToast();

  const handleFile = async (file: File) => {
    if (!file.name.endsWith(".csv")) {
      toast({ title: "Invalid file", description: "Please upload a .csv file.", variant: "destructive" });
      return;
    }

    setUploading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/campaigns/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast({ title: "Upload failed", description: data.message || "Unknown error", variant: "destructive" });
        return;
      }

      setResult(data);
      qc.invalidateQueries({ queryKey: ["/api/events"] });
      qc.invalidateQueries({ queryKey: ["/api/audiences"] });
      qc.invalidateQueries({ queryKey: ["/api/notices"] });

      toast({
        title: "Upload complete",
        description: `${data.eventsCreated} event(s) created.`,
      });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground">
          Campaign <span className="text-[#00E6BA]">Management</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Bulk-import outreach events from a CSV file. Download the template, fill it in, and upload to create all events at once.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Template Download */}
        <Card className="glass-card border-t-4 border-t-[#00E6BA]">
          <CardHeader>
            <CardTitle className="font-serif text-xl flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#00E6BA]" />
              CSV Template
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Download the template with the required columns pre-filled with an example row.
            </p>
            <div className="rounded-lg bg-white/5 border border-white/10 p-3 overflow-x-auto">
              <table className="text-xs text-muted-foreground w-full">
                <thead>
                  <tr>
                    {CSV_COLUMNS.map((col) => (
                      <th key={col} className="text-left pr-4 pb-1 font-semibold text-foreground/80 whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {TEMPLATE_ROW.map((val, i) => (
                      <td key={i} className="pr-4 whitespace-nowrap text-muted-foreground/70">
                        {val.length > 16 ? val.slice(0, 14) + "…" : val}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <Button
              data-testid="button-download-template"
              onClick={downloadTemplate}
              className="gap-2 bg-[#00E6BA] hover:bg-[#00c9a3] text-[#001F17] font-semibold"
            >
              <Download className="h-4 w-4" />
              Download CSV Template
            </Button>
          </CardContent>
        </Card>

        {/* Upload */}
        <Card className="glass-card border-t-4 border-t-blue-500">
          <CardHeader>
            <CardTitle className="font-serif text-xl flex items-center gap-2">
              <Upload className="h-5 w-5 text-blue-400" />
              Upload Campaign CSV
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Drag and drop your completed CSV file here, or click to browse.
            </p>

            <div
              data-testid="drop-zone-csv"
              className={cn(
                "relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200",
                isDragging
                  ? "border-blue-400 bg-blue-500/10"
                  : "border-white/20 hover:border-white/40 hover:bg-white/5"
              )}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                data-testid="input-csv-file"
                onChange={onInputChange}
              />
              <Upload className={cn("h-10 w-10 mx-auto mb-3", isDragging ? "text-blue-400" : "text-muted-foreground")} />
              <p className="text-sm font-medium text-foreground">
                {uploading ? "Uploading…" : "Drop CSV here or click to browse"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">.csv files only</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      {result && (
        <Card className="glass-card border-t-4 border-t-green-500" data-testid="upload-results">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-serif text-xl flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              Upload Summary
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground"
              onClick={() => setResult(null)}
              data-testid="button-dismiss-results"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-white/5 p-4 text-center">
                <p className="text-3xl font-bold text-[#00E6BA]" data-testid="stat-events-created">{result.eventsCreated}</p>
                <p className="text-sm text-muted-foreground mt-1">Events Created</p>
              </div>
              <div className="rounded-lg bg-white/5 p-4 text-center">
                <p className="text-3xl font-bold text-purple-400" data-testid="stat-audiences-created">{result.audiencesAutoCreated}</p>
                <p className="text-sm text-muted-foreground mt-1">Audiences Auto-Created</p>
              </div>
              <div className="rounded-lg bg-white/5 p-4 text-center">
                <p className="text-3xl font-bold text-yellow-400" data-testid="stat-notices-created">{result.noticesCreated}</p>
                <p className="text-sm text-muted-foreground mt-1">Notices Generated</p>
              </div>
            </div>

            {result.autoCreatedAudienceNames.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Auto-created audiences:</p>
                <div className="flex flex-wrap gap-2">
                  {result.autoCreatedAudienceNames.map((name) => (
                    <span
                      key={name}
                      data-testid={`badge-audience-${name}`}
                      className="inline-block text-xs bg-purple-500/20 text-purple-300 rounded-full px-3 py-1"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {result.errors.length > 0 && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-4 space-y-1">
                <div className="flex items-center gap-2 text-red-400 font-medium text-sm mb-2">
                  <AlertCircle className="h-4 w-4" />
                  {result.errors.length} row(s) had errors:
                </div>
                {result.errors.map((e, i) => (
                  <p key={i} className="text-xs text-red-300/80" data-testid={`error-row-${i}`}>{e}</p>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
