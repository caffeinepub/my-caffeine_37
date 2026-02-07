import { useDashboardOverrides } from '../../../hooks/useDashboardOverrides';
import {
  kpiCardBorder,
  kpiCardPadding,
  kpiCardRadius,
  kpiCardShadow,
  kpiInnerPadding,
  kpiInnerRadius,
} from '../../../components/dashboard/dashboardBorders';

interface UserKpiSummaryProps {
  totalDue: number;
  totalWork: number;
  totalCost: number;
}

export default function UserKpiSummary({ totalDue, totalWork, totalCost }: UserKpiSummaryProps) {
  const { getLabel } = useDashboardOverrides();

  return (
    <div className="space-y-2.5">
      {/* Row 1: Full-width Due card */}
      <div className={`bg-gradient-to-br from-red-500 to-red-600 ${kpiCardRadius} ${kpiCardPadding} ${kpiCardShadow} ${kpiCardBorder}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <p className="text-white text-sm font-bold">{getLabel('kpiDueTitle', 'আমার মোট পাওনা')}</p>
          </div>
        </div>
        <div className={`bg-white/90 ${kpiInnerRadius} ${kpiInnerPadding}`}>
          <p className="text-gray-900 text-2xl font-bold text-center">{totalDue.toFixed(0)} ৳</p>
        </div>
      </div>

      {/* Row 2: Two half-width cards */}
      <div className="flex gap-2.5">
        <div className={`flex-1 bg-gradient-to-br from-green-600 to-green-700 ${kpiCardRadius} ${kpiCardPadding} ${kpiCardShadow} ${kpiCardBorder}`}>
          <div className="flex items-center gap-2 mb-1.5">
            <p className="text-white text-xs font-bold">{getLabel('kpiWorkTitle', 'মোট কাজ')}</p>
          </div>
          <div className={`bg-white/90 ${kpiInnerRadius} ${kpiInnerPadding}`}>
            <p className="text-gray-900 text-lg font-bold text-center">{totalWork.toFixed(0)} ৳</p>
          </div>
        </div>

        <div className={`flex-1 bg-gradient-to-br from-slate-600 to-slate-700 ${kpiCardRadius} ${kpiCardPadding} ${kpiCardShadow} ${kpiCardBorder}`}>
          <div className="flex items-center gap-2 mb-1.5">
            <p className="text-white text-xs font-bold">{getLabel('kpiTakenTitle', 'মোট নেওয়া')}</p>
          </div>
          <div className={`bg-white/90 ${kpiInnerRadius} ${kpiInnerPadding}`}>
            <p className="text-gray-900 text-lg font-bold text-center">{totalCost.toFixed(0)} ৳</p>
          </div>
        </div>
      </div>
    </div>
  );
}
