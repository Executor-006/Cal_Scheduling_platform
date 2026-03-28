import { Calendar } from 'lucide-react';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

export default function Shell({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      {/* Mobile top bar — logo only, no hamburger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-2">
        <div className="w-7 h-7 bg-gray-900 rounded-md flex items-center justify-center">
          <Calendar size={14} className="text-white" />
        </div>
        <span className="text-sm font-bold text-gray-900 tracking-tight">Cal Clone</span>
      </div>

      <main className="lg:ml-56 pt-14 lg:pt-0 min-h-screen pb-16 lg:pb-0">
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:px-8 lg:py-6">
          {children}
        </div>
      </main>

      {/* Bottom navigation on mobile */}
      <BottomNav />
    </div>
  );
}
