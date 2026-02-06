interface UserKpiSummaryProps {
  totalDue: number;
  totalWork: number;
  totalCost: number;
}

export default function UserKpiSummary({ totalDue, totalWork, totalCost }: UserKpiSummaryProps) {
  return (
    <div className="border-4 border-gray-900 rounded-3xl p-4 bg-white shadow-2xl">
      <div className="space-y-3">
        {/* Row 1: Full-width Due card - matching reference red card */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-3xl p-5 shadow-lg border-2 border-gray-300">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <p className="text-white text-base font-bold">আমার মোট পাওনা</p>
            </div>
          </div>
          <div className="bg-white/90 rounded-2xl px-4 py-3">
            <p className="text-gray-900 text-3xl font-bold text-center">{totalDue.toFixed(0)} ৳</p>
          </div>
        </div>

        {/* Row 2: Two half-width cards - matching reference green and gray cards */}
        <div className="flex gap-3">
          <div className="flex-1 bg-gradient-to-br from-green-600 to-green-700 rounded-3xl p-4 shadow-lg border-2 border-gray-300">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-white text-sm font-bold">মোট কাজ</p>
            </div>
            <div className="bg-white/90 rounded-xl px-3 py-2">
              <p className="text-gray-900 text-xl font-bold text-center">{totalWork.toFixed(0)} ৳</p>
            </div>
          </div>

          <div className="flex-1 bg-gradient-to-br from-slate-600 to-slate-700 rounded-3xl p-4 shadow-lg border-2 border-gray-300">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-white text-sm font-bold">মোট নেওয়া</p>
            </div>
            <div className="bg-white/90 rounded-xl px-3 py-2">
              <p className="text-gray-900 text-xl font-bold text-center">{totalCost.toFixed(0)} ৳</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
