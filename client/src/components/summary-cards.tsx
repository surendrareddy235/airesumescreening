interface SummaryCardsProps {
  stats: {
    tokensUsed: number;
    cost: string;
    remainingBalance: number;
    totalCandidates: number;
  };
}

export default function SummaryCards({ stats }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Tokens Used Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200 hover:shadow-md transition-shadow">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-microchip text-primary-600 text-xl"></i>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-600">Tokens Used</p>
            <p className="text-2xl font-bold text-slate-900" data-testid="stat-tokens-used">
              {stats.tokensUsed.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500">This month</p>
          </div>
        </div>
      </div>

      {/* Cost Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200 hover:shadow-md transition-shadow">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-dollar-sign text-yellow-600 text-xl"></i>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-600">Cost</p>
            <p className="text-2xl font-bold text-slate-900" data-testid="stat-cost">
              ${parseFloat(stats.cost).toFixed(2)}
            </p>
            <p className="text-xs text-slate-500">This month</p>
          </div>
        </div>
      </div>

      {/* Remaining Balance Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200 hover:shadow-md transition-shadow">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-wallet text-success-600 text-xl"></i>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-600">Remaining Balance</p>
            <p className="text-2xl font-bold text-slate-900" data-testid="stat-remaining-balance">
              {stats.remainingBalance} resumes
            </p>
            <p className="text-xs text-success-600">Free trial</p>
          </div>
        </div>
      </div>

      {/* Total Candidates Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200 hover:shadow-md transition-shadow">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-users text-purple-600 text-xl"></i>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-600">Total Candidates</p>
            <p className="text-2xl font-bold text-slate-900" data-testid="stat-total-candidates">
              {stats.totalCandidates}
            </p>
            <p className="text-xs text-slate-500">Current job</p>
          </div>
        </div>
      </div>
    </div>
  );
}
