'use client';

import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/lib/api';
import { Mail, Calendar, Trash2, CheckCircle2 } from 'lucide-react';

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubscribers() {
      try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch(`${API_BASE_URL}/admin/subscribers`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setSubscribers(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSubscribers();
  }, []);

  return (
    <div className="space-y-12">
      <div>
        <h1 className="font-playfair text-4xl text-slate-900 mb-2">Shore Club Members</h1>
        <p className="text-slate-500 font-light">Manage your coastal community and newsletter subscribers.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-coastal-seafoam/10 rounded-full flex items-center justify-center text-coastal-seafoam">
              <Mail className="w-5 h-5" />
            </div>
            <h2 className="font-playfair text-2xl text-slate-900">Active Subscribers</h2>
          </div>
          <span className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-slate-100">
            {subscribers.length} Members
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">
                <th className="px-8 py-4">Email Address</th>
                <th className="px-8 py-4">Joined Date</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={4} className="p-20 text-center text-slate-400">Consulting the archives...</td></tr>
              ) : subscribers.length === 0 ? (
                <tr><td colSpan={4} className="p-20 text-center text-slate-400">No members have joined the club yet.</td></tr>
              ) : subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-8 py-6 font-medium text-slate-900">
                    {sub.email}
                  </td>
                  <td className="px-8 py-6 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-300" />
                      {new Date(sub.created_at).toLocaleDateString(undefined, { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-green-50 text-green-600">
                      <CheckCircle2 className="w-3 h-3" />
                      Active
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
