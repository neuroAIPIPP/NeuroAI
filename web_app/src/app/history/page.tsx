import Navbar from '@/components/Navbar';
import HistoryTable from '@/components/history/HistoryTable';
import { Layers, TrendingUp } from 'lucide-react';

export default function HistoryPage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-blue-100/30 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-yellow-100/20 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />

      <Navbar />

      <div className="pt-28 pb-12 px-6 lg:px-12 max-w-[1400px] mx-auto min-h-screen flex flex-col relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <h1 className="text-[2.75rem] font-bold text-[#2A3441] tracking-tight">
            Session History
          </h1>

          <div className="flex items-center gap-4">
            {/* Avg Focus Stat */}
            <div className="bg-[#E2F0DD] px-5 py-3 rounded-2xl flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-[#4D5E3A]" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#4D5E3A] uppercase tracking-widest leading-none mb-1">
                  Avg. Focus
                </span>
                <span className="text-xl font-bold text-[#2A3441] leading-none">
                  84.2%
                </span>
              </div>
            </div>

            {/* Sessions Stat */}
            <div className="bg-[#D0E2FF] px-5 py-3 rounded-2xl flex items-center gap-3">
              <Layers className="w-5 h-5 text-[#2A5298]" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#2A5298] uppercase tracking-widest leading-none mb-1">
                  Sessions
                </span>
                <span className="text-xl font-bold text-[#2A3441] leading-none">
                  128
                </span>
              </div>
            </div>
          </div>
        </div>

        <HistoryTable />
      </div>
    </main>
  );
}
