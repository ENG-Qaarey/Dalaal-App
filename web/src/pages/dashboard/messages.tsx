import React from "react"
import Head from "next/head"
import DashboardLayout from "@/components/layout/DashboardLayout"

const conversations = [
  { id: 1, name: "Xaliimo Axmed", message: "Is the apartment still available?", time: "15 min", unread: true },
  { id: 2, name: "Cabdi Maxamed", message: "I'd like to schedule a viewing tomorrow.", time: "1 hour", unread: true },
  { id: 3, name: "Faarax Yuusuf", message: "Thanks for the information!", time: "3 hours", unread: false },
  { id: 4, name: "Khadra Cumar", message: "What are the payment terms?", time: "Yesterday", unread: false },
]

const messages = [
  { id: 1, sender: "Xaliimo Axmed", text: "Hello, I'm interested in the luxury villa in KM. Is it still available?", time: "10:30 AM" },
  { id: 2, sender: "You", text: "Yes, the villa is still available. Would you like to schedule a viewing?", time: "10:45 AM" },
  { id: 3, sender: "Xaliimo Axmed", text: "That would be great. Can we meet tomorrow at 2 PM?", time: "11:00 AM" },
]

export default function MessagesPage() {
  return (
    <DashboardLayout>
      <Head><title>Messages | DalaalPrime</title></Head>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black">Messages</h1>
          <p className="text-sm text-muted-foreground">Communicate with potential buyers and renters</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3 h-[calc(100vh-220px)]">
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border">
              <input
                type="text"
                placeholder="Search conversations..."
                className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-sky-500"
              />
            </div>
            <div className="overflow-y-auto">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`flex items-start gap-3 border-b border-border p-4 cursor-pointer hover:bg-muted/30 transition-colors ${conv.unread ? "bg-sky-500/5" : ""}`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 text-sm font-bold text-white">
                    {conv.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm">{conv.name}</p>
                      <span className="text-xs text-muted-foreground">{conv.time}</span>
                    </div>
                    <p className={`text-sm truncate ${conv.unread ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                      {conv.message}
                    </p>
                  </div>
                  {conv.unread && <div className="h-2 w-2 rounded-full bg-sky-500" />}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card shadow-sm col-span-2 flex flex-col">
            <div className="flex items-center gap-3 p-4 border-b border-border">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 text-sm font-bold text-white">
                X
              </div>
              <div>
                <p className="font-semibold">Xaliimo Axmed</p>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs rounded-xl px-4 py-2.5 ${msg.sender === "You" ? "bg-sky-500 text-white" : "bg-muted"}`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sender === "You" ? "text-white/70" : "text-muted-foreground"}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 h-10 rounded-lg border border-border bg-background px-4 text-sm outline-none focus:border-sky-500"
                />
                <button className="h-10 rounded-lg bg-sky-500 px-4 text-sm font-bold text-white hover:bg-sky-600 transition-colors">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}