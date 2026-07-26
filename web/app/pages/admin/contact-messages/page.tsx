"use client";

import { useState, useEffect } from "react";
import { Search, Mail, CheckCircle2, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { adminService } from "@/lib/api";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  response?: string;
}

export default function AdminContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [respondOpen, setRespondOpen] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [responding, setResponding] = useState(false);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminService.getContactMessages({ limit: "100" });
      const data = res.data;
      const list = Array.isArray(data) ? data : data?.messages || data?.data || [];
      setMessages(list);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
      setError("Failed to load messages. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleRespond = async () => {
    if (!selectedMessage || !responseText.trim()) return;
    try {
      setResponding(true);
      await adminService.updateContactMessage(selectedMessage.id, {
        status: "RESOLVED",
        response: responseText.trim(),
      });
      setMessages((prev) =>
        prev.map((m) =>
          m.id === selectedMessage.id
            ? { ...m, status: "RESOLVED", response: responseText.trim() }
            : m
        )
      );
      setRespondOpen(false);
      setSelectedMessage(null);
      setResponseText("");
    } catch (err) {
      console.error("Failed to update message:", err);
    } finally {
      setResponding(false);
    }
  };

  const handleMarkAsRead = async (msg: ContactMessage) => {
    try {
      await adminService.updateContactMessage(msg.id, { status: "IN_PROGRESS" });
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, status: "IN_PROGRESS" } : m))
      );
    } catch (err) {
      console.error("Failed to update message:", err);
    }
  };

  const filtered = messages.filter((m) => {
    const matchesSearch =
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case "IN_PROGRESS":
        return <Clock className="h-5 w-5 text-amber-500" />;
      default:
        return <Mail className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return "success";
      case "IN_PROGRESS":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contact Messages</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage user contact messages
          </p>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive text-sm">
          {error}
          <Button variant="link" className="ml-2 p-0 h-auto" onClick={fetchMessages}>
            Retry
          </Button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Messages</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">{messages.length}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">New</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {messages.filter((m) => m.status === "NEW").length}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {messages.filter((m) => m.status === "RESOLVED").length}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-3 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="NEW">New</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No messages found</p>
          <p className="text-sm mt-1">
            {search || statusFilter !== "ALL"
              ? "Try adjusting your search or filter."
              : "No contact messages yet."}
          </p>
        </div>
      )}

      {/* Messages List */}
      <div className="space-y-4">
        {loading
          ? [...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))
          : filtered.map((m) => (
              <Card key={m.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        {getStatusIcon(m.status)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base">{m.subject}</CardTitle>
                          <Badge variant={getStatusVariant(m.status)}>
                            {m.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          From <span className="font-medium">{m.name}</span> ({m.email}) on{" "}
                          {new Date(m.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {m.status === "NEW" && (
                        <Button variant="outline" size="sm" onClick={() => handleMarkAsRead(m)}>
                          Mark as Read
                        </Button>
                      )}
                      {m.status !== "RESOLVED" && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedMessage(m);
                            setResponseText("");
                            setRespondOpen(true);
                          }}
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Respond
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{m.message}</p>
                  {m.response && (
                    <div className="mt-3 p-3 bg-muted/50 rounded-lg border border-border">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Response:</p>
                      <p className="text-sm">{m.response}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Respond Dialog */}
      <Dialog open={respondOpen} onOpenChange={setRespondOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Respond to {selectedMessage?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">{selectedMessage?.subject}</p>
              <p className="text-sm text-muted-foreground mt-1">{selectedMessage?.message}</p>
            </div>
            <Textarea
              placeholder="Type your response..."
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              rows={5}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRespondOpen(false)} disabled={responding}>
              Cancel
            </Button>
            <Button onClick={handleRespond} disabled={!responseText.trim() || responding}>
              {responding ? "Sending..." : "Send Response"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
