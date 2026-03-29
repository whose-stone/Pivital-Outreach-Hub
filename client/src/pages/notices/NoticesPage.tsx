import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { useEvents } from "@/context/EventContext";

interface Notice {
  id: string;
  message: string;
  audienceId: string | null;
  resolved: boolean;
  createdAt: string;
}

async function fetchNotices(): Promise<Notice[]> {
  const res = await fetch("/api/notices");
  if (!res.ok) throw new Error("Failed to fetch notices");
  return res.json();
}

async function resolveNotice(id: string): Promise<Notice> {
  const res = await fetch(`/api/notices/${id}/resolve`, { method: "PATCH" });
  if (!res.ok) throw new Error("Failed to resolve notice");
  return res.json();
}

export default function NoticesPage() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { audiences } = useEvents();

  const { data: notices = [], isLoading } = useQuery<Notice[]>({
    queryKey: ["/api/notices"],
    queryFn: fetchNotices,
  });

  const resolveMut = useMutation({
    mutationFn: resolveNotice,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/notices"] });
      toast({ title: "Notice resolved", description: "The notice has been marked as resolved." });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const pending = notices.filter((n) => !n.resolved);
  const resolved = notices.filter((n) => n.resolved);

  const getAudienceName = (audienceId: string | null) => {
    if (!audienceId) return null;
    return audiences.find((a) => a.id === audienceId)?.name ?? null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground">
          <span className="text-yellow-400">Notices</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Action items that need your attention — like incomplete audience profiles created during CSV import.
        </p>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground py-16 text-center">Loading notices…</div>
      ) : (
        <>
          {/* Pending notices */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Bell className="h-5 w-5 text-yellow-400" />
              Pending
              {pending.length > 0 && (
                <span className="inline-flex items-center justify-center h-5 w-5 text-xs font-bold rounded-full bg-yellow-400 text-[#001F17]">
                  {pending.length}
                </span>
              )}
            </h2>

            {pending.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground bg-white/5 rounded-xl border border-dashed border-white/15">
                <Bell className="h-10 w-10 mx-auto mb-3 text-yellow-400/40" />
                <p className="font-medium">All caught up!</p>
                <p className="text-sm">No pending notices at this time.</p>
              </div>
            ) : (
              pending.map((notice) => {
                const audienceName = getAudienceName(notice.audienceId);
                return (
                  <Card
                    key={notice.id}
                    data-testid={`card-notice-${notice.id}`}
                    className="glass-card border-l-4 border-l-yellow-400"
                  >
                    <CardContent className="py-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <Bell className="h-4 w-4 text-yellow-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground" data-testid={`text-notice-message-${notice.id}`}>
                            {notice.message}
                          </p>
                          {audienceName && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Audience: <span className="text-purple-300">{audienceName}</span>
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {notice.audienceId && (
                          <Link href={`/audiences?highlight=${notice.audienceId}`}>
                            <a
                              data-testid={`link-audience-card-${notice.id}`}
                              className="inline-flex items-center gap-1 text-xs text-[#00E6BA] hover:underline"
                            >
                              <ExternalLink className="h-3 w-3" />
                              View Card
                            </a>
                          </Link>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 text-xs h-8"
                          data-testid={`button-resolve-notice-${notice.id}`}
                          onClick={() => resolveMut.mutate(notice.id)}
                          disabled={resolveMut.isPending}
                        >
                          <CheckCheck className="h-3.5 w-3.5" />
                          Resolve
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {/* Resolved notices */}
          {resolved.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-muted-foreground flex items-center gap-2">
                <CheckCheck className="h-5 w-5" />
                Resolved ({resolved.length})
              </h2>
              {resolved.map((notice) => (
                <Card
                  key={notice.id}
                  data-testid={`card-notice-resolved-${notice.id}`}
                  className="glass-card border-l-4 border-l-white/20 opacity-60"
                >
                  <CardContent className="py-4 flex items-center gap-3">
                    <CheckCheck className="h-4 w-4 text-green-400 shrink-0" />
                    <p className="text-sm text-muted-foreground line-through" data-testid={`text-notice-resolved-${notice.id}`}>
                      {notice.message}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
