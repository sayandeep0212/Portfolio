'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const AdminDashboard = dynamic(() => import('./AdminDashboard'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#0b0d11] text-white flex flex-col items-center justify-center p-4">
      <Loader2 className="w-8 h-8 animate-spin text-[#00c0e8] mb-3" />
      <p className="font-mono text-sm text-gray-400">Loading Admin Console...</p>
    </div>
  ),
});

export default function AdminPage() {
  return <AdminDashboard />;
}
