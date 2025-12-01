import { useState, useEffect } from "react";
import { 
  FileText, 
  Mic, 
  User, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Play,
  Download,
  Filter
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { getApiUrl } from "../lib/config";
import { authenticatedFetch } from "../lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Application {
  id: number;
  job_id: number;
  job_title: string;
  worker_id?: string;
  worker_name?: string;
  worker_phone?: string;
  status: 'pending' | 'accepted' | 'rejected';
  audio_url?: string;
  notes?: string;
  submitted_at?: string;
  grower_id?: string;
  farm_name?: string;
}

export default function ApplicationsPage() {
  const { user, userRole } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const audioRef = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchApplications();
  }, [user, userRole, statusFilter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      
      // Build query params
      const params = new URLSearchParams();
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }
      
      // For growers, filter by their jobs
      if (userRole === "grower" && user?.id) {
        params.append("grower_id", user.id);
      }
      // Admins see all applications (no filter)

      const url = `${getApiUrl("applications")}?${params.toString()}`;
      const response = await authenticatedFetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch applications");
      }

      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId: number, newStatus: 'accepted' | 'rejected') => {
    try {
      const response = await authenticatedFetch(
        `${getApiUrl(`applications/${applicationId}`)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update application");
      }

      // Refresh applications
      fetchApplications();
    } catch (error) {
      console.error("Error updating application:", error);
      alert("Error updating application. Please try again.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-amber-100 text-amber-800 border-amber-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle2 className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const handlePlayAudio = (audioUrl: string) => {
    if (playingAudio === audioUrl) {
      // Stop playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setPlayingAudio(null);
    } else {
      // Play new audio
      setPlayingAudio(audioUrl);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.play();
      audio.onended = () => setPlayingAudio(null);
      audio.onerror = () => {
        alert("Error playing audio. Please try downloading it instead.");
        setPlayingAudio(null);
      };
    }
  };

  const filteredApplications = applications.filter(app => {
    if (statusFilter === "all") return true;
    return app.status === statusFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white pb-24">
      <header className="rounded-b-[2rem] bg-slate-900 px-6 pt-12 pb-10 text-white shadow-inner">
        <div className="mx-auto max-w-5xl space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-300">
              Application Review
            </p>
            <h1 className="mt-3 text-3xl font-semibold">
              {userRole === "grower" ? "Your Job Applications" : "All Applications"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-200">
              Review and manage applications from workers. Listen to voice recordings or read text applications.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 pt-6">
        <div className="flex flex-wrap items-center gap-3">
          <Tabs value={statusFilter} onValueChange={setStatusFilter}>
            <TabsList>
              <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({applications.filter(a => a.status === 'pending').length})
              </TabsTrigger>
              <TabsTrigger value="accepted">
                Accepted ({applications.filter(a => a.status === 'accepted').length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected ({applications.filter(a => a.status === 'rejected').length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchApplications}
            disabled={loading}
          >
            <Filter className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {loading ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <p className="font-medium">Loading applications...</p>
            </CardContent>
          </Card>
        ) : filteredApplications.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <FileText className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
              <CardTitle className="text-lg">No applications found</CardTitle>
              <CardDescription className="mt-2">
                {statusFilter === "all"
                  ? "No applications have been submitted yet."
                  : `No ${statusFilter} applications found.`}
              </CardDescription>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => (
              <Card key={app.id} className="border border-border/70 shadow-sm">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl">{app.job_title}</CardTitle>
                        <Badge className={getStatusColor(app.status)}>
                          {getStatusIcon(app.status)}
                          <span className="ml-1 capitalize">{app.status}</span>
                        </Badge>
                      </div>
                      {app.farm_name && (
                        <CardDescription>Farm: {app.farm_name}</CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Worker Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-primary" />
                      <span className="font-medium">{app.worker_name || "Unknown Worker"}</span>
                    </div>
                    {app.worker_phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{app.worker_phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Applied: {formatDate(app.submitted_at)}</span>
                    </div>
                  </div>

                  {/* Voice Application */}
                  {app.audio_url && (
                    <div className="rounded-lg border border-border/40 bg-muted/30 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Mic className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">Voice Application</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePlayAudio(app.audio_url!)}
                        >
                          {playingAudio === app.audio_url ? (
                            <>
                              <XCircle className="h-4 w-4 mr-2" />
                              Stop
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Play
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(app.audio_url, '_blank')}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Text Application */}
                  {app.notes && (
                    <div className="rounded-lg border border-border/40 bg-muted/30 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">Text Application</span>
                      </div>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {app.notes}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  {app.status === "pending" && (
                    <div className="flex gap-2 pt-2 border-t">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleStatusUpdate(app.id, "accepted")}
                        className="flex-1"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Accept
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleStatusUpdate(app.id, "rejected")}
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

