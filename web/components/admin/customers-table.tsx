"use client";

import { useState, useMemo } from "react";
import { Search, Download, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, SlidersHorizontal, ListFilter, Calendar } from "lucide-react";

// Mock data base
const baseCustomers = [
  { name: "Sarah Parker", status: "Subscribed", billing: "Paid", plan: "Enterprise", joinedDate: "30th April 2026", joinedTime: "at 10:25 AM" },
  { name: "Michael Brown", status: "Inactive", billing: "Pending", plan: "Growth", joinedDate: "29th April 2026", joinedTime: "at 10:08 AM" },
  { name: "Linda Chen", status: "Unsubscribed", billing: "Overdue", plan: "Pro", joinedDate: "28th April 2026", joinedTime: "at 9:51 AM" },
  { name: "David Lee", status: "Subscribed", billing: "Trial", plan: "Starter", joinedDate: "27th April 2026", joinedTime: "at 9:34 AM" },
  { name: "Emily White", status: "Inactive", billing: "Paid", plan: "Enterprise", joinedDate: "26th April 2026", joinedTime: "at 9:17 AM" },
  { name: "Jessica Wong", status: "Unsubscribed", billing: "Pending", plan: "Growth", joinedDate: "25th April 2026", joinedTime: "at 9:00 AM" },
  { name: "Kevin Harris", status: "Subscribed", billing: "Overdue", plan: "Pro", joinedDate: "24th April 2026", joinedTime: "at 12:07 PM" },
  { name: "Priya Shah", status: "Inactive", billing: "Trial", plan: "Starter", joinedDate: "23rd April 2026", joinedTime: "at 11:50 AM" },
  { name: "Daniel Hall", status: "Unsubscribed", billing: "Paid", plan: "Enterprise", joinedDate: "22nd April 2026", joinedTime: "at 11:33 AM" },
  { name: "Ava Mitchell", status: "Subscribed", billing: "Pending", plan: "Growth", joinedDate: "21st April 2026", joinedTime: "at 11:16 AM" },
];

// Generate 55 mock customers for pagination demo
const customers = Array.from({ length: 55 }).map((_, i) => ({
  ...baseCustomers[i % 10],
  id: `#${18425 - i}`,
}));

const StatusBadge = ({ status }: { status: string }) => {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border bg-white dark:bg-transparent text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700">
      {status}
    </span>
  );
};

const BillingBadge = ({ billing }: { billing: string }) => {
  let color = "";
  if (billing === "Paid") color = "bg-emerald-500";
  else if (billing === "Pending") color = "bg-zinc-400";
  else if (billing === "Overdue") color = "bg-red-500";
  else if (billing === "Trial") color = "bg-zinc-400";

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 px-2.5 py-0.5 rounded-full bg-white dark:bg-transparent">
      <span className={`w-1.5 h-1.5 rounded-full ${color}`} />
      {billing}
    </span>
  );
};

export function CustomersTable() {
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const totalPages = Math.ceil(customers.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const paginatedCustomers = customers.slice(startIndex, startIndex + rowsPerPage);

  const toggleAll = () => {
    const visibleIds = paginatedCustomers.map(c => c.id);
    const allVisibleSelected = visibleIds.every(id => selected.includes(id));
    if (allVisibleSelected) {
      setSelected(selected.filter(id => !visibleIds.includes(id)));
    } else {
      setSelected(Array.from(new Set([...selected, ...visibleIds])));
    }
  };

  const toggleOne = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(i => i !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const visibleIds = paginatedCustomers.map(c => c.id);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every(id => selected.includes(id));

  return (
    <div className="rounded-xl border bg-white dark:bg-zinc-950 shadow-sm flex flex-col">
      {/* Header */}
      <div className="p-5 flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{customers.length} Customers</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Recent customer records with plan, billing, status, and signup activity.
          </p>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium border rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
          <Download className="w-3.5 h-3.5" />
          Export
        </button>
      </div>

      {/* Toolbar */}
      <div className="px-5 pb-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <div className="relative w-full max-w-[250px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search customers..."
              className="w-full pl-8 pr-4 py-1.5 text-sm rounded-md border focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:bg-zinc-900 dark:focus:ring-zinc-800 dark:border-zinc-800"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium border rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
            <ListFilter className="w-3.5 h-3.5" />
            Status
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium border rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
            <Calendar className="w-3.5 h-3.5" />
            Joined date
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium border rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Billing
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium border rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Sort
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border-t">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b bg-zinc-50/50 dark:bg-zinc-900/20">
              <th className="pl-5 pr-2 py-3 font-medium text-zinc-500 dark:text-zinc-400 w-12">
                <input
                  type="checkbox"
                  className="rounded border-zinc-300 w-4 h-4 text-zinc-900 focus:ring-zinc-900"
                  checked={allVisibleSelected}
                  onChange={toggleAll}
                />
              </th>
              <th className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">Customer</th>
              <th className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">Status</th>
              <th className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">Billing</th>
              <th className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">Plan</th>
              <th className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {paginatedCustomers.map((c) => (
              <tr key={c.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                <td className="pl-5 pr-2 py-3">
                  <input
                    type="checkbox"
                    className="rounded border-zinc-300 w-4 h-4 text-zinc-900 focus:ring-zinc-900"
                    checked={selected.includes(c.id)}
                    onChange={() => toggleOne(c.id)}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-zinc-100 dark:bg-zinc-800 border dark:border-zinc-700 flex items-center justify-center text-zinc-500 shrink-0">
                      <svg width="14" height="14" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.49991 0.876892C5.68022 0.876892 4.20459 2.35252 4.20459 4.17221C4.20459 5.99189 5.68022 7.46753 7.49991 7.46753C9.31959 7.46753 10.7952 5.99189 10.7952 4.17221C10.7952 2.35252 9.31959 0.876892 7.49991 0.876892ZM5.20459 4.17221C5.20459 2.90484 6.23253 1.87689 7.49991 1.87689C8.76728 1.87689 9.79522 2.90484 9.79522 4.17221C9.79522 5.43958 8.76728 6.46753 7.49991 6.46753C6.23253 6.46753 5.20459 5.43958 5.20459 4.17221ZM7.49991 8.5C4.58286 8.5 2.16452 10.6409 1.5546 13.4358C1.43997 13.9606 1.8364 14.4444 2.37059 14.4444H12.6292C13.1634 14.4444 13.5599 13.9606 13.4452 13.4358C12.8353 10.6409 10.417 8.5 7.49991 8.5ZM2.58046 13.4444C3.13689 11.1685 5.14713 9.5 7.49991 9.5C9.85268 9.5 11.8629 11.1685 12.4194 13.4444H2.58046Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                    </div>
                    <div>
                      <div className="font-medium text-zinc-900 dark:text-zinc-100">{c.name}</div>
                      <div className="text-zinc-500 text-xs">{c.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={c.status} />
                </td>
                <td className="px-4 py-3">
                  <BillingBadge billing={c.billing} />
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 font-medium text-xs">
                  {c.plan}
                </td>
                <td className="px-4 py-3">
                  <div className="text-zinc-900 dark:text-zinc-100 text-xs">{c.joinedDate}</div>
                  <div className="text-zinc-500 text-xs">{c.joinedTime}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-5 py-3 border-t flex items-center justify-between flex-wrap gap-4 text-xs font-medium text-zinc-500">
        <div>
          {selected.length} of {customers.length} row(s) selected.
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <select 
              className="border rounded px-1.5 py-1 bg-transparent focus:outline-none focus:ring-1 cursor-pointer"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div>Page {page} of {totalPages}</div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setPage(1)} 
              disabled={page === 1}
              className="p-1.5 border rounded hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            ><ChevronsLeft className="w-3.5 h-3.5" /></button>
            <button 
              onClick={() => setPage(page - 1)} 
              disabled={page === 1}
              className="p-1.5 border rounded hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            ><ChevronLeft className="w-3.5 h-3.5" /></button>
            <button 
              onClick={() => setPage(page + 1)} 
              disabled={page === totalPages}
              className="p-1.5 border rounded hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            ><ChevronRight className="w-3.5 h-3.5" /></button>
            <button 
              onClick={() => setPage(totalPages)} 
              disabled={page === totalPages}
              className="p-1.5 border rounded hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            ><ChevronsRight className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
