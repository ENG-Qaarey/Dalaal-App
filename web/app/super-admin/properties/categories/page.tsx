"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Home } from "lucide-react";

const initialCategories = [
  { id: 1, name: "Apartment", slug: "apartment", listings: 342, icon: "🏢", description: "Flat-style residential units in city areas." },
  { id: 2, name: "Villa", slug: "villa", listings: 87, icon: "🏡", description: "Luxury standalone homes with private amenities." },
  { id: 3, name: "House", slug: "house", listings: 219, icon: "🏠", description: "Standard residential houses for rent or sale." },
  { id: 4, name: "Commercial", slug: "commercial", listings: 134, icon: "🏬", description: "Shops, offices and business spaces." },
  { id: 5, name: "Land", slug: "land", listings: 56, icon: "🌿", description: "Empty plots available for development." },
  { id: 6, name: "Warehouse", slug: "warehouse", listings: 28, icon: "🏭", description: "Storage and industrial spaces." },
];

export default function PropertyCategoriesPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  const handleAdd = () => {
    if (!newName.trim()) return;
    if (editId !== null) {
      setCategories(cats => cats.map(c => c.id === editId ? { ...c, name: newName, description: newDesc } : c));
      setEditId(null);
    } else {
      setCategories(cats => [...cats, { id: Date.now(), name: newName, slug: newName.toLowerCase().replace(/\s+/g, "-"), listings: 0, icon: "📁", description: newDesc }]);
    }
    setNewName(""); setNewDesc(""); setShowForm(false);
  };

  const startEdit = (cat: typeof initialCategories[0]) => {
    setEditId(cat.id); setNewName(cat.name); setNewDesc(cat.description); setShowForm(true);
  };

  const deleteOne = (id: number) => setCategories(cats => cats.filter(c => c.id !== id));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Property Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage the types of property listings on the platform.</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditId(null); setNewName(""); setNewDesc(""); }}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border bg-white dark:bg-zinc-950 shadow-sm p-5 max-w-lg space-y-4">
          <h3 className="font-semibold">{editId ? "Edit Category" : "New Category"}</h3>
          <div className="space-y-2">
            <label className="text-sm font-medium">Category Name</label>
            <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Studio" className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <input type="text" value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Short description..." className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowForm(false)} className="px-3 py-1.5 text-sm border rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800">Cancel</button>
            <button onClick={handleAdd} className="px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90">Save</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => (
          <div key={cat.id} className="rounded-xl border bg-white dark:bg-zinc-950 shadow-sm p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cat.icon}</span>
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">{cat.name}</p>
                  <p className="text-xs text-muted-foreground">/{cat.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => startEdit(cat)} className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"><Edit className="w-3.5 h-3.5 text-zinc-500" /></button>
                <button onClick={() => deleteOne(cat.id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{cat.description}</p>
            <div className="flex items-center gap-1.5 text-sky-600 text-sm font-semibold">
              <Home className="w-3.5 h-3.5" />
              {cat.listings} listings
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
