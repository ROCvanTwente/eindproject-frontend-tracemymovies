import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function YearlyChart({ yearlyData }) {
  const rawTimeline = yearlyData || [];

  // 1. Dynamically extract all valid years from incoming payload
  const incomingYears = rawTimeline.map((d) => parseInt(d.year)).filter(Boolean);
  
  // 2. Determine bounds: from the absolute oldest recorded year up to the current calendar year
  const currentYear = new Date().getFullYear();
  const minYear = incomingYears.length > 0 ? Math.min(...incomingYears) : currentYear;
  const maxYear = currentYear; // Ensures timeline extends dynamically to the present year

  // 3. Generate a continuous sequence of years and merge real records (defaulting missing years to 0)
  const completeTimeline = [];
  for (let y = minYear; y <= maxYear; y++) {
    const existingRecord = rawTimeline.find((d) => parseInt(d.year) === y);
    completeTimeline.push({
      year: y.toString(),
      movies: existingRecord ? existingRecord.movies : 0,
    });
  }

  // 4. Mathematically isolate the top velocity spikes from the fully filled sequence
  const peakYear = completeTimeline.reduce(
    (max, x) => (x.movies > max.movies ? x : max),
    { year: "N/A", movies: 0 }
  );

  return (
    <div className="w-full">
      {/* Header Info Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_10px_var(--color-accent)]" />
            <h2 className="text-xl font-bold font-heading text-white tracking-wide">
              Films Per Year
            </h2>
          </div>
          <p className="text-xs text-muted-foreground/80">Watching history from {minYear} to {maxYear}</p>
        </div>
        
        {/* Metric Data Pill Array */}
        <div className="flex items-center gap-4 bg-background/80 border border-white/4 p-2.5 rounded-xl self-start md:self-auto shadow-inner">
          <div className="px-3 py-0.5 border-r border-white/6">
            <p className="text-[10px] text-muted-foreground/80 uppercase font-bold tracking-wider">Peak Volume</p>
            <p className="text-sm font-black text-accent">
              {peakYear.movies} films <span className="text-xs font-normal text-white/40">({peakYear.year})</span>
            </p>
          </div>
          <div className="px-3 py-0.5">
            <p className="text-[10px] text-muted-foreground/80 uppercase font-bold tracking-wider">Timeline Spans</p>
            <p className="text-sm font-black text-white/90">{minYear} — {maxYear}</p>
          </div>
        </div>
      </div>

      {/* Line Graph Canvas Container Area */}
      <div className="w-full h-75 relative px-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={completeTimeline} margin={{ top: 15, right: 15, left: -25, bottom: 5 }}>
            <defs>
              {/* Electric Neon Accent Blur Filter Map */}
              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#44FFFF" floodOpacity="0.6" />
              </filter>
            </defs>

            <CartesianGrid strokeDasharray="8 8" stroke="var(--color-muted)" opacity={0.2} vertical={false} />
            
            <XAxis 
              dataKey="year" 
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
              animationDuration={1200}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}