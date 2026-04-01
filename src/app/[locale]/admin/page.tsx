"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Users,
  Heart,
  Calendar,
  MessageSquare,
  Newspaper,
  BookOpen,
} from "lucide-react";

interface DashboardStats {
  members: number;
  donations: number;
  events: number;
  unreadMessages: number;
  subscribers: number;
  books: number;
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-warm-gray-200 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-warm-gray-500">{label}</p>
          <p className="text-2xl font-bold text-warm-gray-900 mt-1">{value}</p>
        </div>
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    members: 0,
    donations: 0,
    events: 0,
    unreadMessages: 0,
    subscribers: 0,
    books: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const supabase = createClient();

      try {
        const [members, donations, events, messages, subscribers, books] =
          await Promise.all([
            supabase
              .from("members")
              .select("id", { count: "exact", head: true }),
            supabase
              .from("donations")
              .select("id", { count: "exact", head: true }),
            supabase
              .from("events")
              .select("id", { count: "exact", head: true })
              .gte("date", new Date().toISOString()),
            supabase
              .from("contacts")
              .select("id", { count: "exact", head: true })
              .eq("is_read", false),
            supabase
              .from("newsletter_subscribers")
              .select("id", { count: "exact", head: true })
              .eq("is_active", true),
            supabase
              .from("books")
              .select("id", { count: "exact", head: true }),
          ]);

        setStats({
          members: members.count ?? 0,
          donations: donations.count ?? 0,
          events: events.count ?? 0,
          unreadMessages: messages.count ?? 0,
          subscribers: subscribers.count ?? 0,
          books: books.count ?? 0,
        });
      } catch {
        // Tables may not exist yet — keep zeros
      }
      setLoading(false);
    }

    loadStats();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-warm-gray-900">
          Dashboard
        </h1>
        <p className="text-warm-gray-500 mt-1">
          Hindu Mandir Stockholm — Admin Overview
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-warm-gray-200 p-5 h-24 animate-shimmer"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            label="Total Members"
            value={stats.members}
            icon={<Users size={20} className="text-white" />}
            color="bg-saffron-500"
          />
          <StatCard
            label="Donations"
            value={stats.donations}
            icon={<Heart size={20} className="text-white" />}
            color="bg-maroon-500"
          />
          <StatCard
            label="Upcoming Events"
            value={stats.events}
            icon={<Calendar size={20} className="text-white" />}
            color="bg-tulsi-green"
          />
          <StatCard
            label="Unread Messages"
            value={stats.unreadMessages}
            icon={<MessageSquare size={20} className="text-white" />}
            color="bg-incense-purple"
          />
          <StatCard
            label="Newsletter Subscribers"
            value={stats.subscribers}
            icon={<Newspaper size={20} className="text-white" />}
            color="bg-gold-500"
          />
          <StatCard
            label="Library Books"
            value={stats.books}
            icon={<BookOpen size={20} className="text-white" />}
            color="bg-warm-gray-700"
          />
        </div>
      )}
    </div>
  );
}
