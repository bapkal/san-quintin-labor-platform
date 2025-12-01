import { useState } from "react";
import { CalendarDays, MapPin, Users, Waves, FileText } from "lucide-react";

import type { Job } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import VoiceRecorder from "./VoiceRecorder";

interface JobCardProps {
  job: Job;
  onApply: (jobId: number, audioBlob?: Blob, notes?: string) => void;
}

export default function JobCard({ job, onApply }: JobCardProps) {
  const [showRecorder, setShowRecorder] = useState(false);
  const [showTextForm, setShowTextForm] = useState(false);
  const [textNotes, setTextNotes] = useState("");
  const cropType = (job as any)?.crop_type || (job as any)?.cropType;
  const workerCount = (job as any)?.workers_requested || (job as any)?.workersRequested;

  const handleApply = (audioBlob?: Blob, notes?: string) => {
    onApply(job.id, audioBlob, notes);
    setShowRecorder(false);
    setShowTextForm(false);
    setTextNotes("");
  };

  const handleTextSubmit = () => {
    if (textNotes.trim()) {
      handleApply(undefined, textNotes.trim());
    }
  };

  return (
    <Card className="border border-border/70 shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="muted" className="mb-2">
              {cropType ?? "Seasonal"}
            </Badge>
            <CardTitle className="text-xl">{job.title}</CardTitle>
            <CardDescription>{job.location}</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Pay</p>
            <p className="text-lg font-semibold text-foreground">{job.pay}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <CalendarDays className="h-4 w-4 text-primary" />
          <span>{job.date}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          <span>{job.location}</span>
        </div>
        {workerCount ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4 text-primary" />
            <span>{workerCount} workers requested</span>
          </div>
        ) : null}
        {job.description ? (
          <p className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
            {job.description}
          </p>
        ) : null}
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        {showRecorder ? (
          <VoiceRecorder
            onRecordComplete={(blob) => handleApply(blob)}
            onCancel={() => setShowRecorder(false)}
          />
        ) : showTextForm ? (
          <div className="w-full space-y-3">
            <Textarea
              placeholder="Write your application message here..."
              value={textNotes}
              onChange={(e) => setTextNotes(e.target.value)}
              rows={4}
              className="w-full"
            />
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={handleTextSubmit}
                disabled={!textNotes.trim()}
              >
                Submit Application
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowTextForm(false);
                  setTextNotes("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <Button
              className="w-full"
              size="lg"
              onClick={() => setShowRecorder(true)}
            >
              Apply with Voice
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setShowTextForm(true)}
            >
              <FileText className="mr-2 h-4 w-4" />
              Apply with Text
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => onApply(job.id)}
            >
              Quick Apply
            </Button>
          </>
        )}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Waves className="h-4 w-4 text-primary" />
          <span>Audio-first applications supported</span>
        </div>
      </CardFooter>
    </Card>
  );
}

