import { useEffect, useRef } from "react";
import { Chart, ChartConfiguration } from "chart.js/auto";

export default function PieChartCard() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels: ['0-50%', '50-80%', '80-90%', '90-100%'],
        datasets: [{
          data: [23, 51, 19, 7],
          backgroundColor: [
            '#EF4444', // red-500
            '#EAB308', // yellow-500  
            '#3B82F6', // blue-500
            '#10B981'  // success-500
          ],
          borderWidth: 0,
          cutout: '70%'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.label + ': ' + context.parsed + '%';
              }
            }
          }
        }
      }
    };

    chartInstance.current = new Chart(ctx, config);

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Match Score Distribution</h3>
      <div className="relative">
        <canvas ref={chartRef} width="300" height="300" data-testid="pie-chart"></canvas>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900" data-testid="avg-match-score">73%</div>
            <div className="text-sm text-slate-500">Avg Match</div>
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm text-slate-600">0-50%</span>
          </div>
          <span className="text-sm font-medium text-slate-800" data-testid="distribution-low">23%</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-sm text-slate-600">50-80%</span>
          </div>
          <span className="text-sm font-medium text-slate-800" data-testid="distribution-medium">51%</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm text-slate-600">80-90%</span>
          </div>
          <span className="text-sm font-medium text-slate-800" data-testid="distribution-high">19%</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-success-500 rounded-full mr-2"></div>
            <span className="text-sm text-slate-600">90-100%</span>
          </div>
          <span className="text-sm font-medium text-slate-800" data-testid="distribution-excellent">7%</span>
        </div>
      </div>
    </div>
  );
}
