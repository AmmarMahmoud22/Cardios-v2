import React, { useState } from 'react';
import { VitalSign } from '../types';
import { Activity, Heart, ArrowUpRight, TrendingUp, AlertCircle, ShieldAlert } from 'lucide-react';

interface VitalsChartProps {
  vitals: VitalSign[];
}

export const VitalsChart: React.FC<VitalsChartProps> = ({ vitals }) => {
  const [hoveredPoint, setHoveredPoint] = useState<VitalSign | null>(null);
  const [showBP, setShowBP] = useState(true);
  const [showHR, setShowHR] = useState(true);

  // Sort chronological for plotting
  const sortedVitals = [...vitals].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  if (sortedVitals.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
        <Activity className="w-8 h-8 mx-auto text-slate-300 mb-2" />
        No vital recordings found yet. Use the "Log Vitals" form to record new readings.
      </div>
    );
  }

  // Dimensions for SVG chart
  const width = 650;
  const height = 240;
  const padding = { top: 25, right: 30, bottom: 35, left: 45 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Scales
  const minVal = 40;
  const maxVal = 200; // max BP range
  const yScale = (val: number) => {
    const clamped = Math.max(minVal, Math.min(maxVal, val));
    return padding.top + chartHeight - ((clamped - minVal) / (maxVal - minVal)) * chartHeight;
  };

  const xScale = (index: number) => {
    if (sortedVitals.length === 1) return padding.left + chartWidth / 2;
    return padding.left + (index / (sortedVitals.length - 1)) * chartWidth;
  };

  // Generate SVG path strings
  const systolicPoints = sortedVitals.map((v, i) => `${xScale(i)},${yScale(v.systolic)}`).join(' ');
  const diastolicPoints = sortedVitals.map((v, i) => `${xScale(i)},${yScale(v.diastolic)}`).join(' ');
  const heartRatePoints = sortedVitals.map((v, i) => `${xScale(i)},${yScale(v.heartRate)}`).join(' ');

  // Healthy target zone coordinates (Systolic: 90 - 130 mmHg)
  const targetTop = yScale(130);
  const targetBottom = yScale(90);
  const targetHeight = Math.max(0, targetBottom - targetTop);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 font-heading">
              <Activity className="w-5 h-5 text-rose-600" />
              Hemodynamic Trends & Telemetry
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
              {sortedVitals.length} Recordings
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Continuous remote patient monitoring & in-clinic vitals trajectory
          </p>
        </div>

        {/* Legend / Toggles */}
        <div className="flex items-center gap-3 text-xs font-medium">
          <button
            onClick={() => setShowBP(!showBP)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition ${
              showBP ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
            <span>Blood Pressure (Sys / Dia)</span>
          </button>
          <button
            onClick={() => setShowHR(!showHR)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition ${
              showHR ? 'bg-cyan-50 border-cyan-200 text-cyan-700' : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-600" />
            <span>Heart Rate (bpm)</span>
          </button>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[500px] select-none"
        >
          {/* Background grid lines */}
          {[60, 90, 120, 140, 160, 180].map(val => (
            <g key={val}>
              <line
                x1={padding.left}
                y1={yScale(val)}
                x2={width - padding.right}
                y2={yScale(val)}
                stroke="#f1f5f9"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={padding.left - 8}
                y={yScale(val) + 3}
                fill="#94a3b8"
                fontSize="10"
                textAnchor="end"
                fontFamily="sans-serif"
              >
                {val}
              </text>
            </g>
          ))}

          {/* Normal Target BP Band (90-130) */}
          <rect
            x={padding.left}
            y={targetTop}
            width={chartWidth}
            height={targetHeight}
            fill="#10b981"
            fillOpacity="0.06"
          />
          <text
            x={width - padding.right - 5}
            y={targetTop + 14}
            fill="#10b981"
            fontSize="9"
            fontWeight="bold"
            textAnchor="end"
          >
            Target BP Zone (&lt;130 mmHg)
          </text>

          {/* High Alert Threshold Line (160 mmHg) */}
          <line
            x1={padding.left}
            y1={yScale(160)}
            x2={width - padding.right}
            y2={yScale(160)}
            stroke="#ef4444"
            strokeWidth="1"
            strokeDasharray="2 2"
          />
          <text
            x={width - padding.right - 5}
            y={yScale(160) - 4}
            fill="#ef4444"
            fontSize="9"
            fontWeight="bold"
            textAnchor="end"
          >
            Stage 2 / Alert Threshold (160)
          </text>

          {/* Heart Rate Line */}
          {showHR && sortedVitals.length > 1 && (
            <polyline
              fill="none"
              stroke="#0891b2"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              points={heartRatePoints}
            />
          )}

          {/* Diastolic Line */}
          {showBP && sortedVitals.length > 1 && (
            <polyline
              fill="none"
              stroke="#f97316"
              strokeWidth="2"
              strokeDasharray="5 3"
              strokeLinejoin="round"
              strokeLinecap="round"
              points={diastolicPoints}
            />
          )}

          {/* Systolic Line */}
          {showBP && sortedVitals.length > 1 && (
            <polyline
              fill="none"
              stroke="#e11d48"
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
              points={systolicPoints}
            />
          )}

          {/* Data Points */}
          {sortedVitals.map((v, i) => {
            const x = xScale(i);
            const ySys = yScale(v.systolic);
            const yDia = yScale(v.diastolic);
            const yHr = yScale(v.heartRate);
            const isHovered = hoveredPoint?.id === v.id;
            const isCritical = v.systolic >= 160 || v.diastolic >= 100 || v.heartRate >= 110;

            const dateStr = new Date(v.timestamp).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric'
            });

            return (
              <g key={v.id} className="cursor-pointer" onMouseEnter={() => setHoveredPoint(v)}>
                {/* Vertical hover guide */}
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={height - padding.bottom}
                  stroke={isHovered ? '#64748b' : 'transparent'}
                  strokeWidth={isHovered ? '1.5' : '0'}
                  strokeDasharray="3 3"
                />

                {/* X-axis date labels */}
                <text
                  x={x}
                  y={height - padding.bottom + 16}
                  fill="#64748b"
                  fontSize="10"
                  textAnchor="middle"
                  fontWeight={isHovered ? 'bold' : 'normal'}
                >
                  {dateStr}
                </text>

                {/* Systolic Circle */}
                {showBP && (
                  <circle
                    cx={x}
                    cy={ySys}
                    r={isHovered ? 6 : isCritical ? 5 : 4}
                    fill={isCritical ? '#dc2626' : '#e11d48'}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                )}

                {/* Diastolic Circle */}
                {showBP && (
                  <circle
                    cx={x}
                    cy={yDia}
                    r={isHovered ? 5 : 3.5}
                    fill="#f97316"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                )}

                {/* Heart Rate Circle */}
                {showHR && (
                  <circle
                    cx={x}
                    cy={yHr}
                    r={isHovered ? 5 : 3.5}
                    fill="#0891b2"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Popup */}
        {hoveredPoint && (
          <div className="mt-3 p-3 bg-slate-900 text-white rounded-lg shadow-xl text-xs flex flex-wrap items-center justify-between gap-4 border border-slate-700 animate-fadeIn">
            <div className="flex items-center gap-3">
              <span className="text-slate-400">
                {new Date(hoveredPoint.timestamp).toLocaleString(undefined, {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                })}
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                Source: {hoveredPoint.source}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div>
                <span className="text-slate-400">Blood Pressure: </span>
                <strong className={`text-sm ${hoveredPoint.systolic >= 160 ? 'text-rose-400' : 'text-white'}`}>
                  {hoveredPoint.systolic}/{hoveredPoint.diastolic} mmHg
                </strong>
              </div>
              <div>
                <span className="text-slate-400">Heart Rate: </span>
                <strong className="text-cyan-400 text-sm">{hoveredPoint.heartRate} bpm</strong>
              </div>
              {hoveredPoint.spO2 && (
                <div>
                  <span className="text-slate-400">SpO2: </span>
                  <strong className="text-emerald-400 text-sm">{hoveredPoint.spO2}%</strong>
                </div>
              )}
            </div>

            {hoveredPoint.notes && (
              <div className="w-full text-slate-300 italic pt-1 border-t border-slate-800">
                "{hoveredPoint.notes}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Target Reference Legend */}
      <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Optimal BP: &lt;120/80 mmHg</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>Stage 1 HTN: 130-139/80-89</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
          <span>Stage 2 HTN: &gt;=140/90 mmHg</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-600" />
          <span>Resting HR Target: 60-80 bpm</span>
        </div>
      </div>
    </div>
  );
};
