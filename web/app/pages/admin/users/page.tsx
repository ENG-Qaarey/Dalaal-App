"use client";

import { useState, useEffect } from "react";
import { Search, Users, Plus, X, ChevronLeft, ChevronRight } from "lucide-react";
import { adminService, usersService } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface User {
  id: string;
  email: string;
  role: string;
  status: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    city?: string;
    avatar?: string;
  };
  createdAt: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [stats, setStats] = useState({ total: 0, active: 0, suspended: 0 });
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  // Create user modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    role: "CUSTOMER" as User["role"],
    firstName: "",
    lastName: "",
    phoneNumber: "",
    city: "",
  });
  // Validation errors state
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params: any = { page: "1", limit: "50" };
      if (search) params.q = search;
      if (roleFilter !== "ALL") params.role = roleFilter;

      const data = await adminService.getUsers(params);
      const userList = Array.isArray(data) ? data : data?.users ?? data?.data ?? [];
      setUsers(userList);
      setStats({
        total: userList.length,
        active: userList.filter((u: any) => u.status === "ACTIVE").length,
        suspended: userList.filter((u: any) => u.status === "SUSPENDED").length,
      });
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsCreateModalOpen(false);
      }
    };
    if (isCreateModalOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isCreateModalOpen]);

  const toggleUserStatus = async (id: string) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;
    const newStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      await adminService.updateUserStatus(id, newStatus);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
      );
      setStats((prev) => ({
        total: prev.total,
        active: prev.active + (newStatus === "ACTIVE" ? 1 : -1),
        suspended: prev.suspended + (newStatus === "SUSPENDED" ? 1 : -1),
      }));
    } catch (error) {
      console.error("Failed to update user status:", error);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!newUser.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!newUser.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!newUser.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!newUser.password) {
      newErrors.password = "Password is required";
    } else if (newUser.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    const newUserObj: User = {
      id: `u${Date.now()}`,
      email: newUser.email,
      role: newUser.role,
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
      profile: {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phoneNumber: newUser.phoneNumber,
        city: newUser.city,
      },
    };
    setUsers((prev) => [newUserObj, ...prev]);
    // Reset form and close modal
    setNewUser({
      email: "",
      password: "",
      role: "CUSTOMER",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      city: "",
    });
    setErrors({});
    setIsCreateModalOpen(false);
  };

  const filtered = users.filter((u) => {
    const fullName = `${u.profile?.firstName || ""} ${u.profile?.lastName || ""}`.trim();
    const matchesSearch =
      fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.profile?.city?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filtered.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      case "BROKER":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "PROPERTY_OWNER":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "VEHICLE_OWNER":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "CUSTOMER":
        return "bg-zinc-100 text-zinc-700 dark:bg-zinc-900/30 dark:text-zinc-400";
      default:
        return "bg-zinc-100 text-zinc-700 dark:bg-zinc-900/30 dark:text-zinc-400";
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Users</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage all users on the DalaalPrime platform
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">{stats.total}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.active}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Suspended Users</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.suspended}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Search & Role Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search user by name, email, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All User Roles</SelectItem>
            <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
            <SelectItem value="BROKER">Broker</SelectItem>
            <SelectItem value="PROPERTY_OWNER">Property Owner</SelectItem>
            <SelectItem value="VEHICLE_OWNER">Vehicle Owner</SelectItem>
            <SelectItem value="CUSTOMER">Customer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-9 w-32" />
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground uppercase text-xs font-semibold tracking-wider">
                  <th className="p-4 pl-0">User</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">City</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-0 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {currentUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-muted-foreground">
                    No users found
                  </td>
                </tr>
                ) : (
                  currentUsers.map((u) => {
                    const fullName = `${u.profile?.firstName || ""} ${u.profile?.lastName || ""}`.trim() || "Unknown";
                    const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                    return (
                      <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-4 pl-0">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={u.profile?.avatar} />
                              <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold text-foreground">{fullName}</div>
                              <div className="text-xs text-muted-foreground">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">{u.profile?.phoneNumber || "-"}</td>
                        <td className="p-4 font-medium text-blue-600 dark:text-blue-400">{u.profile?.city || "-"}</td>
                        <td className="p-4">
                          <Badge className={getRoleColor(u.role)}>
                            {u.role.replace("_", " ")}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge variant={u.status === "ACTIVE" ? "success" : "destructive"}>
                            {u.status}
                          </Badge>
                        </td>
                        <td className="p-4 pr-0 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleUserStatus(u.id)}
                            className={u.status === "ACTIVE" 
                              ? "text-destructive hover:text-destructive hover:bg-destructive/10" 
                              : "text-emerald-600 hover:text-emerald-600 hover:bg-emerald-500/10"
                            }
                          >
                            {u.status === "ACTIVE" ? "Suspend" : "Activate"}
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filtered.length)} of {filtered.length} users
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <div className="text-sm font-medium">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={(e) => e.target === e.currentTarget && setIsCreateModalOpen(false)}
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-card border border-border rounded-2xl p-8 w-full max-w-lg shadow-2xl transform transition-all duration-300 scale-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold">Create New User</h2>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={createUser} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-semibold">First Name</label>
                  <Input
                    id="firstName"
                    value={newUser.firstName}
                    onChange={(e) => {
                      setNewUser({ ...newUser, firstName: e.target.value });
                      if (errors.firstName) {
                        setErrors({ ...errors, firstName: "" });
                      }
                    }}
                    className={errors.firstName ? "border-red-500 focus-visible:ring-red-500" : ""}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-semibold">Last Name</label>
                  <Input
                    id="lastName"
                    value={newUser.lastName}
                    onChange={(e) => {
                      setNewUser({ ...newUser, lastName: e.target.value });
                      if (errors.lastName) {
                        setErrors({ ...errors, lastName: "" });
                      }
                    }}
                    className={errors.lastName ? "border-red-500 focus-visible:ring-red-500" : ""}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold">Email Address</label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => {
                    setNewUser({ ...newUser, email: e.target.value });
                    if (errors.email) {
                      setErrors({ ...errors, email: "" });
                    }
                  }}
                  className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                  placeholder="user@example.com"
                />
                {errors.email && (
                  <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    {errors.email}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold">Password</label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => {
                    setNewUser({ ...newUser, password: e.target.value });
                    if (errors.password) {
                      setErrors({ ...errors, password: "" });
                    }
                  }}
                  className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
                  placeholder="At least 6 characters"
                />
                {errors.password && (
                  <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    {errors.password}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-semibold">User Role</label>
                <Select
                  value={newUser.role}
                  onValueChange={(val) => setNewUser({ ...newUser, role: val as User["role"] })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CUSTOMER">Customer</SelectItem>
                    <SelectItem value="BROKER">Broker</SelectItem>
                    <SelectItem value="PROPERTY_OWNER">Property Owner</SelectItem>
                    <SelectItem value="VEHICLE_OWNER">Vehicle Owner</SelectItem>
                    <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="phoneNumber" className="text-sm font-semibold">Phone Number</label>
                  <Input
                    id="phoneNumber"
                    value={newUser.phoneNumber}
                    onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
                    placeholder="+252 61 xxx xxxx"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="city" className="text-sm font-semibold">City</label>
                  <Input
                    id="city"
                    value={newUser.city}
                    onChange={(e) => setNewUser({ ...newUser, city: e.target.value })}
                    placeholder="e.g., Mogadishu"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-border mt-6">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-6 py-2"
                >
                  Cancel
                </Button>
                <Button type="submit" className="px-8 py-2 bg-blue-600 hover:bg-blue-700">
                  Create User
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
