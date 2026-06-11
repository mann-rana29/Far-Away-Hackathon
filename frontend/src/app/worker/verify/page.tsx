"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Camera, CheckCircle2, ImageIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { workerApi } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { getCurrentLocation } from "@/lib/utils";

function VerifyCleanupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [assignedComplaints, setAssignedComplaints] = useState<any[]>([]);
  const [selectedComplaintId, setSelectedComplaintId] = useState<string>(initialId || "");
  const [afterImageFile, setAfterImageFile] = useState<File | null>(null);
  const [afterImagePreview, setAfterImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    workerApi.getRoute()
      .then(data => {
        // Only show complaints that are NOT cleaned
        setAssignedComplaints(data.filter((c: any) => c.status !== "CLEANED" && c.complaintStatus !== "CLEANED"));
      })
      .catch(console.error)
      .finally(() => setFetchLoading(false));
  }, []);

  const selectedComplaint = assignedComplaints.find(c => String(c.id || c.complaintId) === selectedComplaintId);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAfterImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAfterImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedComplaintId || !afterImageFile) return;

    setLoading(true);
    try {
      const location = await getCurrentLocation();
      
      const formData = new FormData();
      formData.append("image", afterImageFile);
      formData.append("lat", location.latitude.toString());
      formData.append("lon", location.longitude.toString());
      
      await workerApi.verifyCleanup(selectedComplaintId, formData);
      setStep(3);
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Could not upload the verification image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) {
    return (
      <div className="px-4 py-4 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
        </div>
        <h1 className="text-xl font-serif font-bold">Cleanup Recorded</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-xs">The stop has been successfully updated and marked as cleaned.</p>
        <Button onClick={() => router.push("/worker/route")} className="mt-6 cursor-pointer">Back to Checklist</Button>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/worker/route" className="p-2 -ml-2 rounded-md hover:bg-muted transition-colors"><ArrowLeft className="h-4 w-4" /></Link>
        <h1 className="text-lg font-serif font-semibold">Submit Verification</h1>
      </div>

      <input 
        type="file" 
        accept="image/*" 
        capture="environment"
        ref={fileInputRef}
        onChange={handleImageSelect}
        className="hidden"
      />

      {/* Complaint Selector */}
      <Card className="border-border/60 bg-card shadow-sm">
        <CardContent className="p-4 space-y-3">
          <Label className="text-xs font-medium">Select assigned stop</Label>
          {fetchLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground py-2">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span className="text-[10px]">Loading assignment list...</span>
            </div>
          ) : (
            <Select value={selectedComplaintId} onValueChange={setSelectedComplaintId}>
              <SelectTrigger className="bg-muted/50 border-none shadow-none h-11">
                <SelectValue placeholder="Choose a stop..." />
              </SelectTrigger>
              <SelectContent>
                {assignedComplaints.map(c => (
                  <SelectItem key={c.id || c.complaintId} value={String(c.id || c.complaintId)}>
                    Stop #{c.sequenceNo} — {c.location || c.area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      {/* Before Image */}
      {selectedComplaint && (
        <Card className="border-border/50">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-1.5">
              <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
              <Label className="text-xs">Reference Image (Reported)</Label>
            </div>
            {selectedComplaint.imageUrl ? (
              <img src={selectedComplaint.imageUrl} alt="Before" className="w-full h-auto rounded-lg shadow-sm" />
            ) : (
              <div className="h-40 bg-muted/30 rounded-lg flex items-center justify-center">
                <p className="text-xs text-muted-foreground">No reference image</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* After Photo Upload */}
      {selectedComplaint && (
        <Card className="border-border/50">
          <CardContent className="p-4 space-y-3">
            <Label className="text-xs">Cleanup Proof (After Photo)</Label>
            {!afterImagePreview ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                <Camera className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
                <p className="text-[10px] text-muted-foreground">Tap to take photo or upload proof</p>
              </div>
            ) : (
              <div className="relative">
                <img src={afterImagePreview} alt="After" className="w-full h-auto rounded-lg shadow-sm" />
                <button 
                  onClick={() => { setAfterImageFile(null); setAfterImagePreview(null); }}
                  className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full p-1.5 text-xs hover:bg-background transition-colors"
                  disabled={loading}
                >
                  ✕
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Button 
        className="w-full h-11 font-medium cursor-pointer" 
        onClick={handleSubmit} 
        disabled={loading || !selectedComplaintId || !afterImageFile}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        {loading ? "Verifying..." : "Confirm & Submit"}
      </Button>
    </div>
  );
}

export default function VerifyCleanup() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><Loader2 className="h-8 w-8 animate-spin text-primary/50" /></div>}>
      <VerifyCleanupContent />
    </Suspense>
  );
}
