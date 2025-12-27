import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Hash,
  CheckCircle,
  Clock,
  AlertTriangle,
  Brain,
  HardDrive,
  Blocks,
  Building2,
  Shield,
  Loader2,
  Compass,
  ArrowRight
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

type ComplaintStatus = "pending" | "verified" | "investigating" | "resolved";

interface ComplaintData {
  cid: string;
  title: string;
  status: ComplaintStatus;
  submittedAt: string;
  aiVerification: {
    isAuthentic: boolean;
    confidence: number;
  };
  timeline: {
    event: string;
    timestamp: string;
    icon: React.ElementType;
    color: string;
  }[];
}

const mockComplaint: ComplaintData = {
  cid: "QmXnnyufdjhj3k4j5k6l7m8n9p0q1r2s3t4u5v6w7x8y9z0a1b2c3d4",
  title: "Infrastructure Safety Concern - Highway Bridge",
  status: "investigating",
  submittedAt: "2024-01-15T10:30:00Z",
  aiVerification: {
    isAuthentic: true,
    confidence: 94.7,
  },
  timeline: [
    {
      event: "Complaint submitted anonymously",
      timestamp: "2024-01-15T10:30:00Z",
      icon: Shield,
      color: "bg-primary/20 text-primary",
    },
    {
      event: "AI verification completed - Evidence authentic",
      timestamp: "2024-01-15T10:31:00Z",
      icon: Brain,
      color: "bg-accent/20 text-accent",
    },
    {
      event: "Evidence stored on IPFS",
      timestamp: "2024-01-15T10:31:30Z",
      icon: HardDrive,
      color: "bg-success/20 text-success",
    },
    {
      event: "Recorded on blockchain",
      timestamp: "2024-01-15T10:32:00Z",
      icon: Blocks,
      color: "bg-primary/20 text-primary",
    },
    {
      event: "Enrolled in e-Sakshya Portal",
      timestamp: "2024-01-15T10:33:00Z",
      icon: Building2,
      color: "bg-amber-500/20 text-amber-500",
    },
    {
      event: "Under investigation by authorities",
      timestamp: "2024-01-16T09:00:00Z",
      icon: Clock,
      color: "bg-warning/20 text-warning",
    },
  ],
};

const statusConfig: Record<ComplaintStatus, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
  pending: { label: "Pending Review", color: "text-warning", bgColor: "bg-warning/10 border-warning/30", icon: Clock },
  verified: { label: "Verified", color: "text-accent", bgColor: "bg-accent/10 border-accent/30", icon: CheckCircle },
  investigating: { label: "Under Investigation", color: "text-primary", bgColor: "bg-primary/10 border-primary/30", icon: AlertTriangle },
  resolved: { label: "Resolved", color: "text-success", bgColor: "bg-success/10 border-success/30", icon: CheckCircle },
};

const TrackComplaint = () => {
  const [cidInput, setCidInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [complaint, setComplaint] = useState<ComplaintData | null>(null);

  const handleSearch = async () => {
    if (!cidInput.trim()) {
      toast({
        title: "Enter CID Hash",
        description: "Please enter your complaint CID hash to track.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    await new Promise((r) => setTimeout(r, 2000));
    
    // Mock: return complaint data
    if (cidInput.toLowerCase().startsWith("qm")) {
      setComplaint({ ...mockComplaint, cid: cidInput });
    } else {
      setComplaint(null);
      toast({
        title: "Complaint Not Found",
        description: "No complaint found with this CID hash.",
        variant: "destructive",
      });
    }
    setIsSearching(false);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const StatusBadge = ({ status }: { status: ComplaintStatus }) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border ${config.bgColor} ${config.color}`}>
        <Icon className="w-4 h-4" />
        <span className="text-sm font-semibold">{config.label}</span>
      </div>
    );
  };

  return (
    <Layout>
      <div className="py-12 min-h-screen">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card border border-primary/30 mb-8">
              <Compass className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Real-time Tracking</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-foreground">Track Your</span>{" "}
              <span className="text-gradient">Complaint</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enter your CID hash to view the current status and complete timeline
              of your complaint stored on the blockchain.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-16">
            <div className="glass-card rounded-3xl p-8 border border-border/50 shadow-elevated">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Hash className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Enter your CID hash (e.g., QmXnny...)"
                    value={cidInput}
                    onChange={(e) => setCidInput(e.target.value)}
                    className="pl-14 h-14 text-base rounded-2xl"
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <Button
                  variant="hero"
                  size="xl"
                  className="gap-3 rounded-2xl"
                  onClick={handleSearch}
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                  Track Status
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Enter the CID hash you received when you submitted your complaint
              </p>
            </div>
          </div>

          {/* Results */}
          {complaint && (
            <div className="max-w-4xl mx-auto space-y-6 fade-in-up">
              {/* Status Card */}
              <div className="glass-card rounded-3xl p-8 border border-border/50">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                  <div>
                    <p className="text-sm text-muted-foreground mb-3">Current Status</p>
                    <StatusBadge status={complaint.status} />
                  </div>
                  <div className="lg:text-right">
                    <p className="text-sm text-muted-foreground mb-2">Submitted</p>
                    <p className="text-foreground font-semibold text-lg">{formatDate(complaint.submittedAt)}</p>
                  </div>
                </div>

                <div className="border-t border-border/50 pt-8">
                  <h3 className="font-display font-bold text-xl mb-4">{complaint.title}</h3>
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-secondary/30 border border-border/50">
                    <Hash className="w-5 h-5 text-primary shrink-0" />
                    <code className="font-mono text-sm text-muted-foreground break-all">{complaint.cid}</code>
                  </div>
                </div>
              </div>

              {/* AI Verification */}
              <div className="glass-card rounded-3xl p-8 border border-border/50">
                <h4 className="font-display text-xl font-semibold mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-primary" />
                  </div>
                  AI Verification
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 rounded-2xl bg-secondary/30 border border-border/50">
                    <p className="text-sm text-muted-foreground mb-2">Evidence Status</p>
                    <p className={`font-bold text-lg ${complaint.aiVerification.isAuthentic ? "text-accent" : "text-destructive"}`}>
                      {complaint.aiVerification.isAuthentic ? "Verified Authentic" : "Flagged for Review"}
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl bg-secondary/30 border border-border/50">
                    <p className="text-sm text-muted-foreground mb-2">Confidence Score</p>
                    <div className="flex items-center gap-3">
                      <p className="font-bold text-lg text-primary">{complaint.aiVerification.confidence}%</p>
                      <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                          style={{ width: `${complaint.aiVerification.confidence}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="glass-card rounded-3xl p-8 border border-border/50">
                <h4 className="font-display text-xl font-semibold mb-8 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Blocks className="w-5 h-5 text-primary" />
                  </div>
                  Blockchain Timeline
                </h4>
                <div className="space-y-1">
                  {complaint.timeline.map((event, index) => {
                    const EventIcon = event.icon;
                    return (
                      <div key={index} className="flex gap-6 group">
                        <div className="relative flex flex-col items-center">
                          <div className={`w-12 h-12 rounded-2xl ${event.color} flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>
                            <EventIcon className="w-5 h-5" />
                          </div>
                          {index < complaint.timeline.length - 1 && (
                            <div className="w-0.5 h-12 bg-gradient-to-b from-border to-transparent mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-8">
                          <p className="text-foreground font-medium text-lg">{event.event}</p>
                          <p className="text-sm text-muted-foreground mt-1">{formatDate(event.timestamp)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!complaint && !isSearching && (
            <div className="max-w-lg mx-auto text-center py-16">
              <div className="w-32 h-32 mx-auto rounded-full bg-secondary/30 flex items-center justify-center mb-8">
                <Search className="w-16 h-16 text-muted-foreground" />
              </div>
              <h3 className="font-display text-2xl font-semibold mb-4">Enter CID to Track</h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Enter your complaint CID hash above to view its current status
                and complete blockchain-verified timeline.
              </p>
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Hash className="w-4 h-4 text-primary" />
                <span>Example: QmXnny1234...</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TrackComplaint;
