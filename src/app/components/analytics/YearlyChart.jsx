import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function YearlyChart({ yearlyData }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-lg md:rounded-xl p-3 md:p-4">
        <h2 className="text-lg md:text-xl font-bold font-heading text-[#F8FAFC] mb-4">
          Movies Watched Per Year
        </h2>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={yearlyData}>
            <defs>
              <linearGradient id="yearlyBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#BFBCFC" stopOpacity={1} />
                <stop offset="100%" stopColor="#44FFFF" stopOpacity={0.6} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#151921" opacity={0.3} />
            <XAxis dataKey="year" stroke="#94A3B8" />
            <YAxis stroke="#94A3B8" />

            <Tooltip
              contentStyle={{
                backgroundColor: "#151921",
                border: "1px solid rgba(191, 188, 252, 0.3)",
                borderRadius: "12px",
                color: "#F8FAFC",
              }}
            />

            <Bar dataKey="movies" fill="url(#yearlyBarGradient)" radius={[12, 12, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}