"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, HelpCircle, Loader2, X } from "lucide-react";
import { adminService } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
  createdAt?: string;
}

interface FAQForm {
  question: string;
  answer: string;
  category: string;
}

export default function AdminFAQs() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FAQForm>({
    question: "",
    answer: "",
    category: "",
  });

  useEffect(() => {
    loadFaqs();
  }, []);

  async function loadFaqs() {
    try {
      setLoading(true);
      const res = await adminService.getFaqs();
      const data = res.faqs ?? res.data ?? res;
      setFaqs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load FAQs", err);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingFaq(null);
    setForm({ question: "", answer: "", category: "" });
    setModalOpen(true);
  }

  function openEdit(faq: FAQ) {
    setEditingFaq(faq);
    setForm({ question: faq.question, answer: faq.answer, category: faq.category });
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.question.trim() || !form.answer.trim()) return;
    try {
      setSubmitting(true);
      if (editingFaq) {
        const updated = await adminService.updateFaq(editingFaq.id, form);
        setFaqs((prev) =>
          prev.map((f) =>
            f.id === editingFaq.id ? { ...f, ...(updated as Partial<FAQ>), ...form } : f
          )
        );
      } else {
        const created = await adminService.createFaq(form);
        setFaqs((prev) => [...prev, { ...(created as FAQ), ...form, id: (created as any)?.id || Date.now().toString() }]);
      }
      setModalOpen(false);
      setForm({ question: "", answer: "", category: "" });
      setEditingFaq(null);
    } catch (err) {
      console.error("Failed to save FAQ", err);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      await adminService.deleteFaq(id);
      setFaqs((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error("Failed to delete FAQ", err);
    }
  }

  const categories = Array.from(new Set(faqs.map((f) => f.category)));

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">FAQs</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage frequently asked questions
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          New FAQ
        </Button>
      </div>

      {faqs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <HelpCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No FAQs yet. Create one to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category} className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                {category}
              </h3>
              {faqs
                .filter((f) => f.category === category)
                .map((faq) => (
                  <Card key={faq.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <HelpCircle className="h-5 w-5 text-muted-foreground" />
                            <CardTitle className="text-base">{faq.question}</CardTitle>
                          </div>
                          <Badge variant={faq.isActive ? "success" : "secondary"}>
                            {faq.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(faq)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDelete(faq.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-card border border-border rounded-2xl p-8 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{editingFaq ? "Edit FAQ" : "New FAQ"}</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="question" className="text-sm font-semibold">
                  Question
                </label>
                <Input
                  id="question"
                  placeholder="e.g. How do I create a listing?"
                  value={form.question}
                  onChange={(e) => setForm((prev) => ({ ...prev, question: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-semibold">
                  Category
                </label>
                <Input
                  id="category"
                  placeholder="e.g. Listings, Payments, Account"
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="answer" className="text-sm font-semibold">
                  Answer
                </label>
                <textarea
                  id="answer"
                  rows={4}
                  placeholder="Provide the answer..."
                  value={form.answer}
                  onChange={(e) => setForm((prev) => ({ ...prev, answer: e.target.value }))}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting || !form.question.trim() || !form.answer.trim()}
                >
                  {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editingFaq ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
