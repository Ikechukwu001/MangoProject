"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Crown,
  User,
  Mail,
  Hash,
  ShieldCheck,
  AlertTriangle,
  BadgeCheck,
  Search,
  Filter,
} from "lucide-react";
import { createClient } from "@/src/lib/supabase/client";

export default function AdminPremiumPage() {
  const supabase = createClient();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  async function fetchRequests() {
    setLoading(true);

    const { data, error } = await supabase
      .from("premium_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setRequests(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  async function approveRequest(request) {
    setActionLoadingId(request.id);

    const { error: reqError } = await supabase
      .from("premium_requests")
      .update({
        status: "verified",
        updated_at: new Date().toISOString(),
      })
      .eq("id", request.id);

    if (reqError) {
      alert(reqError.message);
      setActionLoadingId(null);
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        plan: "premium",
        premium_status: "active",
      })
      .eq("id", request.user_id);

    if (profileError) {
      alert(profileError.message);
      setActionLoadingId(null);
      return;
    }

    await fetchRequests();
    setActionLoadingId(null);
  }

  async function rejectRequest(request) {
    setActionLoadingId(request.id);

    const { error: requestError } = await supabase
      .from("premium_requests")
      .update({
        status: "rejected",
        updated_at: new Date().toISOString(),
      })
      .eq("id", request.id);

    if (requestError) {
      alert(requestError.message);
      setActionLoadingId(null);
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        premium_status: "rejected",
      })
      .eq("id", request.user_id);

    if (profileError) {
      alert(profileError.message);
      setActionLoadingId(null);
      return;
    }

    await fetchRequests();
    setActionLoadingId(null);
  }

  const stats = useMemo(() => {
    const pending = requests.filter((req) => req.status === "pending").length;
    const verified = requests.filter((req) => req.status === "verified").length;
    const rejected = requests.filter((req) => req.status === "rejected").length;

    return {
      total: requests.length,
      pending,
      verified,
      rejected,
    };
  }, [requests]);

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchesSearch =
        req.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.reference?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || req.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [requests, searchTerm, statusFilter]);

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
                Admin Control
              </p>
              <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                Premium Request Management
              </h1>
              <p className="mt-2 text-sm leading-7 text-slate-500">
                Review payment requests, approve premium users, and manage account upgrades.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
              <ShieldCheck size={16} />
              Admin Access
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Requests</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{stats.total}</p>
          </div>

          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <div className="flex items-center gap-2 text-amber-700">
              <Clock size={16} />
              <p className="text-sm font-medium">Pending</p>
            </div>
            <p className="mt-2 text-3xl font-bold text-amber-800">{stats.pending}</p>
          </div>

          <div className="rounded-3xl border border-teal-200 bg-teal-50 p-5 shadow-sm">
            <div className="flex items-center gap-2 text-teal-700">
              <BadgeCheck size={16} />
              <p className="text-sm font-medium">Verified</p>
            </div>
            <p className="mt-2 text-3xl font-bold text-teal-800">{stats.verified}</p>
          </div>

          <div className="rounded-3xl border border-red-200 bg-red-50 p-5 shadow-sm">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle size={16} />
              <p className="text-sm font-medium">Rejected</p>
            </div>
            <p className="mt-2 text-3xl font-bold text-red-800">{stats.rejected}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search by name, email, or reference"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              />
            </div>

            <div className="relative">
              <Filter
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              >
                <option value="all">All statuses</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests */}
        <div className="space-y-4">
          {loading ? (
            <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="animate-pulse space-y-4">
                <div className="h-6 w-48 rounded bg-slate-200" />
                <div className="h-24 rounded-2xl bg-slate-200" />
                <div className="h-24 rounded-2xl bg-slate-200" />
                <div className="h-24 rounded-2xl bg-slate-200" />
              </div>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="rounded-[28px] border border-slate-200 bg-white p-10 text-center shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">
                No premium requests found
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Try changing your search or filter.
              </p>
            </div>
          ) : (
            filteredRequests.map((req) => (
              <div
                key={req.id}
                className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        <User size={14} />
                        {req.full_name || "No name provided"}
                      </div>

                      <div
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                          req.status === "pending"
                            ? "bg-amber-100 text-amber-700"
                            : req.status === "verified"
                            ? "bg-teal-100 text-teal-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {req.status === "pending" && <Clock size={14} />}
                        {req.status === "verified" && <CheckCircle2 size={14} />}
                        {req.status === "rejected" && <XCircle size={14} />}
                        {req.status.toUpperCase()}
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Mail size={15} />
                          <span className="text-xs font-medium uppercase tracking-wider">
                            Email
                          </span>
                        </div>
                        <p className="mt-2 break-all text-sm font-semibold text-slate-900">
                          {req.email}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Hash size={15} />
                          <span className="text-xs font-medium uppercase tracking-wider">
                            Reference
                          </span>
                        </div>
                        <p className="mt-2 text-sm font-semibold text-slate-900">
                          {req.reference}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Crown size={15} />
                          <span className="text-xs font-medium uppercase tracking-wider">
                            Amount
                          </span>
                        </div>
                        <p className="mt-2 text-sm font-semibold text-slate-900">
                          ₦{req.amount?.toLocaleString?.() || req.amount}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400">
                      Requested on {new Date(req.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex min-w-[220px] flex-col gap-3">
                    {req.status === "pending" ? (
                      <>
                        <button
                          onClick={() => approveRequest(req)}
                          disabled={actionLoadingId === req.id}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <CheckCircle2 size={16} />
                          {actionLoadingId === req.id ? "Processing..." : "Approve Premium"}
                        </button>

                        <button
                          onClick={() => rejectRequest(req)}
                          disabled={actionLoadingId === req.id}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <XCircle size={16} />
                          Reject Request
                        </button>
                      </>
                    ) : req.status === "verified" ? (
                      <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4 text-center">
                        <div className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700">
                          <Crown size={16} />
                          Premium Activated
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-center">
                        <div className="inline-flex items-center gap-2 text-sm font-semibold text-red-700">
                          <AlertTriangle size={16} />
                          Request Rejected
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}