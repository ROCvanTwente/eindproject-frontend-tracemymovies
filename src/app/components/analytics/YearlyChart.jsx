// Component dat een lijngrafiek tekent van het aantal bekeken films per jaar of per maand binnen een geselecteerd jaar.
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function YearlyChart({ yearlyData = [], monthlyData = {} }) {
  const [viewMode, setViewMode] = useState("yearly"); // "yearly" | "monthly"

  // 1. Verwerk standaard layoutgrenzen en bepaal de slimme standaard jaaroptie
  const yearsArray = yearlyData.map((d) => parseInt(d.year)).filter(Boolean);
  const minYear = yearsArray.length > 0 ? Math.min(...yearsArray) : new Date().getFullYear();
  const maxYear = new Date().getFullYear();
  
  const defaultYearString = yearsArray.length > 0 ? Math.max(...yearsArray).toString() : new Date().getFullYear().toString();
  const [selectedYear, setSelectedYear] = useState(defaultYearString);

  // 2. Selecteer en modelleer de data voor de actieve grafiekweergave
  let activeChartData = [];
  if (viewMode === "yearly") {
    activeChartData = yearlyData;
  } else {
    const rawMonths = monthlyData[selectedYear] || [];
    activeChartData = rawMonths.map((item) => ({
      ...item,
      displayLabel: MONTH_NAMES[parseInt(item.month) - 1] || item.month
    }));
  }

  // 3. Berekening van de piekwaarden inclusief de tijdscontext
  const peakMetric = activeChartData.reduce(
    (max, x) => (x.movies > max.movies ? x : max),
    { movies: 0 }
  );

  const peakText = peakMetric.movies > 0
    ? (viewMode === "yearly"
      ? `${peakMetric.year} (${peakMetric.movies} movies)`
      : `${peakMetric.displayLabel} (${peakMetric.movies} movies)`)
    : "0 movies";

  return (
    <div className="w-full">
      {/* Header-informatieblok */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_10px_var(--color-accent)]" />
            <h2 className="text-xl font-bold font-heading text-white tracking-wide">
              {viewMode === "yearly" ? "Films Per Year" : `Films in ${selectedYear}`}
            </h2>
          </div>
          <p className="text-xs text-muted-foreground/80">
            {viewMode === "yearly" ? `Watching history from ${minYear} to ${maxYear}` : `Monthly metrics breakdown for calendar year ${selectedYear}`}
          </p>
        </div>

        {/* Knoppen en dropdowns voor de dynamische besturing */}
        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          {/* Weergave-toggles */}
          <div className="flex bg-background/60 p-1 border border-white/5 rounded-xl">
            <button
              onClick={() => setViewMode("yearly")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${viewMode === "yearly" ? "bg-accent text-background shadow-md" : "text-muted-foreground hover:text-white"
                }`}
            >
              Yearly
            </button>
            <button
              onClick={() => {
                setViewMode("monthly");
                if (!monthlyData[selectedYear] && yearlyData.length > 0) {
                  setSelectedYear(yearlyData[yearlyData.length - 1].year);
                }
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${viewMode === "monthly" ? "bg-accent text-background shadow-md" : "text-muted-foreground hover:text-white"
                }`}
            >
              Monthly
            </button>
          </div>

          {/* Jaar-selectie dropdown (met styling voor focus, hover en aangepaste pijl) */}
          {viewMode === "monthly" && (
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="appearance-none bg-background border border-white/10 text-white rounded-xl text-xs pl-3 pr-8 py-2 outline-none focus:border-accent hover:border-accent/50 font-bold cursor-pointer transition-colors"
              >
                {yearlyData.map((d) => (
                  <option key={d.year} value={d.year} className="bg-[#151921] text-white checked:bg-accent/20">
                    {d.year}
                  </option>
                ))}
              </select>
              {/* Aangepaste SVG-pijlhuls die zwart blijft bij hoveren over de achtergrond */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-muted-foreground">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          )}

          {/* Metric-datapil met samenvatting van de piek */}
          <div className="flex items-center gap-4 bg-background/80 border border-white/4 p-2 rounded-xl shadow-inner">
            <div className="px-3 py-0.5">
              <p className="text-[10px] text-muted-foreground/80 uppercase font-bold tracking-wider">
                {viewMode === "yearly" ? "Peak Volume" : "Max Monthly Log"}
              </p>
              <p className="text-sm font-black text-accent">
                {peakText}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grafiek-canvasgebied */}
      <div className="w-full h-[320px] relative px-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={activeChartData} margin={{ top: 15, right: 15, left: -25, bottom: 5 }}>
            <defs>
              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#44FFFF" floodOpacity="0.6" />
              </filter>
            </defs>

            <CartesianGrid strokeDasharray="8 8" stroke="var(--color-muted)" opacity={0.2} vertical={false} />

            <XAxis
              dataKey={viewMode === "yearly" ? "year" : "displayLabel"}
              stroke="var(--color-muted-foreground)"
              fontSize={11}
              fontWeight={700}
              tickLine={false}
              axisLine={false}
              dy={12}
            />
            <YAxis
              stroke="var(--color-muted-foreground)"
              fontSize={11}
              fontWeight={700}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              dx={-5}
            />

            <Tooltip
              cursor={{ stroke: 'rgba(68, 255, 255, 0.15)', strokeWidth: 1.5, strokeDasharray: "4 4" }}
              contentStyle={{
                backgroundColor: "var(--color-background)",
                border: "1px solid rgba(68, 255, 255, 0.3)",
                borderRadius: "14px",
                padding: "10px 14px"
              }}
              itemStyle={{ color: "var(--color-accent)", fontWeight: "900", fontSize: "14px" }}
              labelStyle={{ color: "var(--color-muted-foreground)", fontWeight: "700", marginBottom: "3px", fontSize: "11px" }}
              formatter={(value) => [`${value} Movies watched`, "Volume"]}
            />

            <Line
              type="linear"
              dataKey="movies"
              stroke="var(--color-accent)"
              strokeWidth={3.5}
              filter="url(#neonGlow)"
              dot={{ stroke: '#07090e', strokeWidth: 2.5, fill: 'var(--color-accent)', r: 5 }}
              activeDot={{ stroke: 'var(--color-accent)', strokeWidth: 2, fill: '#07090e', r: 7 }}
              connectNulls={true}
              isAnimationActive={false} // Voorkomt visuele haperingen bij transitie tussen weergaven
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}