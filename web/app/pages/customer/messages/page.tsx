"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { chatService } from "@/lib/api";
import {
  Send, Loader2, AlertCircle, MessageSquare, Search, Phone, Video,
  MoreVertical, ArrowLeft, Check, CheckCheck, Image as ImageIcon,
  Paperclip, Smile, X, Trash2,
} from "lucide-react";

export default function CustomerMessages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchConversations = useCallback(async () => {
    try {
      const data = await chatService.getConversations();
      const convs = Array.isArray(data) ? data : data?.conversations ?? [];
      setConversations(convs);
      setError(null);
    } catch (err: any) {
      if (!conversations.length) setError(err.message || "Failed to load conversations");
    } finally {
      setLoadingConversations(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
    pollRef.current = setInterval(fetchConversations, 10000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [fetchConversations]);

  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      setLoadingMessages(true);
      const data = await chatService.getMessages(conversationId);
      const msgs = Array.isArray(data) ? data : data?.messages ?? [];
      setMessages(msgs.reverse());
    } catch (err: any) {
      setError(err.message || "Failed to load messages");
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    if (selectedId) {
      fetchMessages(selectedId);
      const poll = setInterval(() => fetchMessages(selectedId), 5000);
      return () => clearInterval(poll);
    }
  }, [selectedId, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (selectedId && inputRef.current) inputRef.current.focus();
  }, [selectedId]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedId || sending) return;
    const content = newMessage.trim();
    setNewMessage("");
    try {
      setSending(true);
      await chatService.sendMessage(selectedId, { content });
      await fetchMessages(selectedId);
      fetchConversations();
    } catch (err: any) {
      setNewMessage(content);
      alert(err.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm("Delete this message?")) return;
    try {
      await chatService.deleteMessage(messageId);
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    } catch (err: any) {
      alert(err.message || "Failed to delete message");
    }
  };

  const getOtherParticipant = (conv: any) => {
    const participants = conv.participants || [];
    const other = participants.find((p: any) => {
      const pid = p.userId || p.user?.id;
      return pid !== user?.id;
    });
    return other?.user || participants[1]?.user || null;
  };

  const getOtherName = (conv: any) => {
    const other = getOtherParticipant(conv);
    if (!other) return "Unknown User";
    const profile = other.profile || other;
    return `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || other.email || "User";
  };

  const getOtherAvatar = (conv: any) => {
    const other = getOtherParticipant(conv);
    return other?.profile?.avatar || null;
  };

  const getLastMessage = (conv: any) => {
    const msgs = conv.messages;
    if (Array.isArray(msgs) && msgs.length > 0) {
      const msg = msgs[0];
      const prefix = msg.senderId === user?.id ? "You: " : "";
      const text = msg.content || (msg.type === "IMAGE" ? "Image" : msg.type === "DOCUMENT" ? "Document" : "Message");
      return prefix + (text.length > 40 ? text.slice(0, 40) + "..." : text);
    }
    return conv.title || "No messages yet";
  };

  const getTimeAgo = (dateStr: string | null) => {
    if (!dateStr) return "";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "now";
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d`;
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const filtered = conversations.filter((c) => {
    if (!search) return true;
    const name = getOtherName(c).toLowerCase();
    return name.includes(search.toLowerCase()) || c.title?.toLowerCase().includes(search.toLowerCase());
  });

  const selectedConv = conversations.find((c) => c.id === selectedId);

  return (
    <div className="flex flex-1 flex-col gap-4" style={{ height: "calc(100vh - 8rem)" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Messages & Inquiries</h1>
          <p className="text-sm text-muted-foreground mt-1">Communicate directly with your brokers.</p>
        </div>
        <div className="text-xs text-muted-foreground font-bold bg-muted px-3 py-1.5 rounded-full">
          {conversations.length} conversation{conversations.length !== 1 ? "s" : ""}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-[10px] text-red-700 dark:text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          <button onClick={() => setError(null)} className="ml-auto"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Main Chat Layout */}
      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Conversation List */}
        <div className={`${showMobileChat ? "hidden md:flex" : "flex"} w-full md:w-80 lg:w-96 bg-card border border-border rounded-[10px] shadow-sm flex-col overflow-hidden`}>
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" placeholder="Search conversations..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-4 bg-background border border-border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingConversations ? (
              <div className="space-y-2 p-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-[10px] animate-pulse">
                    <div className="w-11 h-11 rounded-full bg-muted shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-24 bg-muted rounded" />
                      <div className="h-2.5 w-40 bg-muted rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 px-4">
                <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
                <p className="text-sm font-bold text-muted-foreground">
                  {search ? "No matching conversations" : "No conversations yet"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {search ? "Try a different search" : "Contact a broker from a listing to start chatting"}
                </p>
              </div>
            ) : (
              filtered.map((conv) => {
                const name = getOtherName(conv);
                const avatar = getOtherAvatar(conv);
                const lastMsg = getLastMessage(conv);
                const time = getTimeAgo(conv.lastMessageAt || conv.updatedAt);
                const unread = conv.unreadCount || 0;
                const isSelected = conv.id === selectedId;

                return (
                  <div key={conv.id} onClick={() => { setSelectedId(conv.id); setShowMobileChat(true); }}
                    className={`flex items-center gap-3 p-3 mx-2 my-1 rounded-[10px] cursor-pointer transition-all ${
                      isSelected
                        ? "bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40"
                        : "hover:bg-muted/50 border border-transparent"
                    }`}>
                    <div className="relative shrink-0">
                      {avatar ? (
                        <img src={avatar} alt={name} className="w-11 h-11 rounded-full object-cover" />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center font-bold text-blue-600 text-sm">
                          {name[0]?.toUpperCase() || "?"}
                        </div>
                      )}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-card" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-sm truncate">{name}</span>
                        <span className="text-[10px] text-muted-foreground font-bold shrink-0">{time}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <p className="text-xs text-muted-foreground truncate">{lastMsg}</p>
                        {unread > 0 && (
                          <span className="px-1.5 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full shrink-0 min-w-[18px] text-center">
                            {unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`${!showMobileChat ? "hidden md:flex" : "flex"} flex-1 bg-card border border-border rounded-[10px] shadow-sm flex-col overflow-hidden`}>
          {!selectedId ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center mx-auto">
                  <MessageSquare className="w-10 h-10 text-blue-400 dark:text-blue-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-muted-foreground">Select a conversation</p>
                  <p className="text-sm text-muted-foreground mt-1">Choose from your existing conversations or start a new one</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-3 border-b border-border flex items-center gap-3 bg-card">
                <button onClick={() => setShowMobileChat(false)}
                  className="md:hidden p-1.5 rounded-[10px] hover:bg-muted">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                {(() => {
                  const name = getOtherName(selectedConv || {});
                  const avatar = getOtherAvatar(selectedConv || {});
                  return (
                    <>
                      {avatar ? (
                        <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center font-bold text-blue-600 text-sm">
                          {name[0]?.toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">{name}</div>
                        <div className="text-[11px] text-emerald-600 font-bold">Online</div>
                      </div>
                    </>
                  );
                })()}
                <div className="flex items-center gap-1">
                  <button className="p-2 rounded-[10px] hover:bg-muted text-muted-foreground transition-colors">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-[10px] hover:bg-muted text-muted-foreground transition-colors">
                    <Video className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-[10px] hover:bg-muted text-muted-foreground transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-muted/10">
                {loadingMessages ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
                    <p className="text-sm font-bold text-muted-foreground">No messages yet</p>
                    <p className="text-xs text-muted-foreground mt-1">Send the first message to start the conversation</p>
                  </div>
                ) : (
                  <>
                    {(() => {
                      const name = getOtherName(selectedConv || {});
                      return (
                        <div className="text-center py-4">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-full text-[11px] text-muted-foreground font-bold">
                            <span>Conversation with {name}</span>
                          </div>
                        </div>
                      );
                    })()}
                    {messages.map((msg, idx) => {
                      const isOwn = msg.senderId === user?.id;
                      const showAvatar = !isOwn && (idx === 0 || messages[idx - 1]?.senderId !== msg.senderId);
                      const showTime = idx === messages.length - 1 ||
                        messages[idx + 1]?.senderId !== msg.senderId ||
                        (new Date(messages[idx + 1]?.createdAt).getTime() - new Date(msg.createdAt).getTime()) > 300000;

                      return (
                        <div key={msg.id} className={`flex gap-2 ${isOwn ? "justify-end" : "justify-start"}`}>
                          {!isOwn && (
                            <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 text-[10px] font-bold shrink-0 mt-1"
                              style={{ visibility: showAvatar ? "visible" : "hidden" }}>
                              {getOtherName(selectedConv || {})[0]?.toUpperCase() || "?"}
                            </div>
                          )}
                          <div className={`group relative max-w-[75%] ${isOwn ? "order-1" : "order-2"}`}>
                            <div className={`px-3.5 py-2.5 text-sm leading-relaxed ${
                              isOwn
                                ? "bg-blue-600 text-white rounded-[10px] rounded-tr-sm"
                                : "bg-card border border-border text-foreground rounded-[10px] rounded-tl-sm"
                            }`}>
                              {msg.type === "IMAGE" && msg.mediaUrl ? (
                                <img src={msg.mediaUrl} alt="Shared" className="rounded-[10px] max-w-[240px] mb-1" />
                              ) : null}
                              {msg.content}
                            </div>
                            {showTime && (
                              <div className={`flex items-center gap-1 mt-0.5 ${isOwn ? "justify-end" : "justify-start"}`}>
                                <span className="text-[10px] text-muted-foreground font-bold">
                                  {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                                </span>
                                {isOwn && (
                                  <span className="text-blue-500">
                                    {msg.isRead ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                                  </span>
                                )}
                              </div>
                            )}
                            {isOwn && (
                              <button onClick={() => handleDeleteMessage(msg.id)}
                                className="absolute -top-2 -left-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                                <Trash2 className="w-2.5 h-2.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t border-border bg-card">
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-[10px] hover:bg-muted text-muted-foreground transition-colors shrink-0">
                    <Paperclip className="w-4.5 h-4.5" />
                  </button>
                  <button className="p-2 rounded-[10px] hover:bg-muted text-muted-foreground transition-colors shrink-0">
                    <ImageIcon className="w-4.5 h-4.5" />
                  </button>
                  <div className="flex-1 relative">
                    <input ref={inputRef} type="text" placeholder="Type a message..." value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                      className="w-full h-10 px-4 pr-10 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      <Smile className="w-4 h-4" />
                    </button>
                  </div>
                  <button onClick={handleSend}
                    disabled={!newMessage.trim() || sending}
                    className="p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-40 transition-all shrink-0 shadow-md shadow-blue-600/20">
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
