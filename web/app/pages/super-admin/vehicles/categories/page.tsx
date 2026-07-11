"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Car } from "lucide-react";

const initialCategories = [
  { id: 1, name: "SUV", slug: "suv", listings: 198, icon: "🚙", description: "Sports Utility Vehicles for rough terrain." },
  { id: 2, name: "Sedan", slug: "sedan", listings: 124, icon: "🚗", description: "Standard passenger sedans for city travel." },
  { id: 3, name: "Van", slug: "van", listings: 87, icon: "🚐", description: "Vans and minibuses for group transport." },
  { id: 4, name: "Truck", slug: "truck", listings: 43, icon: "🚛", description: "Heavy trucks for cargo and logistics." },
  { id: 5, name: "Minibus", slug: "minibus", listings: 61, icon: "🚌", description: "Minibuses for shared city routes." },
  { id: 6, name: "Pickup", slug: "pickup", listings: 55, icon: "🛻", description: "Pickup trucks for mixed use." },
];

export default function VehicleCategoriesPage() {
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
      setCategories(cats => [...cats, { id: Date.now(), name: newName, slug: newName.toLowerCase().replace(/\s+/g, "-"), listings: 0, icon: "🚘", description: newDesc }]);
    }
    setNewName(""); setNewDesc(""); setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vehicle Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage the types of vehicles available on the platform.</p>
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
            <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Motorbike"
              className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <input type="text" value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Short description..."
              className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
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
                <button onClick={() => { setEditId(cat.id); setNewName(cat.name); setNewDesc(cat.description); setShowForm(true); }}
                  className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"><Edit className="w-3.5 h-3.5 text-zinc-500" /></button>
                <button onClick={() => setCategories(c => c.filter(x => x.id !== cat.id))}
                  className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{cat.description}</p>
            <div className="flex items-center gap-1.5 text-sky-600 text-sm font-semibold">
              <Car className="w-3.5 h-3.5" />
              {cat.listings} listings
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
