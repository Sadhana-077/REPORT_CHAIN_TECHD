import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminAuth } from "@/components/auth/AdminAuth";
import { 
  LayoutDashboard,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  ChevronRight,
  TrendingUp,
  Users,
  Shield
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Status = "pending" | "verified" | "investigating" | "resolved";

interface Complaint {
  id: string;
  cid: string;
  title: string;
  status: Status;
  submittedAt: string;
  aiConfidence: number;
}

const mockComplaints: Complaint[] = [
  {
    id: "1",
    cid: "QmXnny1234567890abcdef",
    title: "Infrastructure Safety Concern - Highway Bridge",
    status: "investigating",
    submittedAt: "2024-01-15T10:30:00Z",
    aiConfidence: 94.7,
  },
  {
    id: "2",
    cid: "QmYbbc9876543210fedcba",
    title: "Environmental Violation - Industrial Waste",
    status: "verified",
    submittedAt: "2024-01-14T15:45:00Z",
    aiConfidence: 89.3,
  },
  {
    id: "3",
    cid: "QmZccx5678901234ghijkl",
    title: "Public Service Complaint - Water Supply",
    status: "pending",
    submittedAt: "2024-01-16T08:20:00Z",
    aiConfidence: 92.1,
  },
  {
    id: "4",
    cid: "QmAbcd1234mnopqrstuv",
    title: "Corruption Report - Government Office",
    status: "resolved",
    submittedAt: "2024-01-10T11:00:00Z",
    aiConfidence: 97.5,
  },
  {
    id: "5",
    cid: "QmEfgh5678wxyzabcdef",
    title: "Road Safety Issue - Missing Signage",
    status: "investigating",
    submittedAt: "2024-01-13T09:15:00Z",
    aiConfidence: 88.9,
  },
];

const statusConfig: Record<Status, { label: string; color: string; bgColor: string }> = {
  pending: { label: "Pending", color: "text-warning", bgColor: "bg-warning/20" },
  verified: { label: "Verified", color: "text-accent", bgColor: "bg-accent/20" },
  investigating: { label: "Investigating", color: "text-primary", bgColor: "bg-primary/20" },
  resolved: { label: "Resolved", color: "text-green-400", bgColor: "bg-green-500/20" },
};

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<Status | "all">("all");

  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "pending").length,
    investigating: complaints.filter((c) => c.status === "investigating").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.cid.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || c.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const updateStatus = (id: string, newStatus: Status) => {
    setComplaints(complaints.map((c) => 
      c.id === id ? { ...c, status: newStatus } : c
    ));
    toast({
      title: "Status Updated",
      description: `Complaint status changed to ${statusConfig[newStatus].label}`,
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <AdminAuth 
      portalName="Admin Dashboard" 
      portalIcon={<LayoutDashboard className="w-6 h-6 text-primary" />}
    >
      <Layout>
        <div className="py-8 min-h-screen">
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold flex items-center gap-3">
                  <LayoutDashboard className="w-8 h-8 text-primary" />
                <span className="text-gradient">Admin Dashboard</span>
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage and review all submitted complaints
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary/30">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Admin Access</span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Complaints", value: stats.total, icon: FileText, color: "text-primary" },
              { label: "Pending Review", value: stats.pending, icon: Clock, color: "text-warning" },
              { label: "Investigating", value: stats.investigating, icon: AlertTriangle, color: "text-primary" },
              { label: "Resolved", value: stats.resolved, icon: CheckCircle, color: "text-accent" },
            ].map((stat, index) => (
              <div key={index} className="glass-card rounded-xl p-4 border border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  <TrendingUp className="w-4 h-4 text-accent" />
                </div>
                <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Search & Filter */}
          <div className="glass-card rounded-xl p-4 border border-border/50 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title or CID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={filterStatus === "all" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setFilterStatus("all")}
                >
                  All
                </Button>
                {(Object.keys(statusConfig) as Status[]).map((status) => (
                  <Button
                    key={status}
                    variant={filterStatus === status ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setFilterStatus(status)}
                    className="gap-2"
                  >
                    <div className={`w-2 h-2 rounded-full ${statusConfig[status].bgColor}`} />
                    {statusConfig[status].label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Complaints Table */}
          <div className="glass-card rounded-xl border border-border/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">CID</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Title</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">AI Score</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComplaints.map((complaint) => (
                    <tr key={complaint.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                      <td className="p-4">
                        <code className="text-xs font-mono text-primary">
                          {complaint.cid.slice(0, 12)}...
                        </code>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-foreground font-medium max-w-xs truncate">
                          {complaint.title}
                        </p>
                      </td>
                      <td className="p-4">
                        <select
                          value={complaint.status}
                          onChange={(e) => updateStatus(complaint.id, e.target.value as Status)}
                          className={`text-xs px-3 py-1.5 rounded-full border cursor-pointer ${statusConfig[complaint.status].bgColor} ${statusConfig[complaint.status].color} bg-transparent`}
                        >
                          {(Object.keys(statusConfig) as Status[]).map((status) => (
                            <option key={status} value={status} className="bg-card text-foreground">
                              {statusConfig[status].label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 rounded-full bg-secondary overflow-hidden">
                            <div 
                              className="h-full bg-accent rounded-full"
                              style={{ width: `${complaint.aiConfidence}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {complaint.aiConfidence}%
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {formatDate(complaint.submittedAt)}
                      </td>
                      <td className="p-4">
                        <Button variant="ghost" size="sm" className="gap-1">
                          <Eye className="w-4 h-4" />
                          View
                          <ChevronRight className="w-3 h-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredComplaints.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No complaints found</p>
              </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </AdminAuth>
  );
};

export default AdminDashboard;
