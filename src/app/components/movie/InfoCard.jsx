export function InfoCard({ icon, label, value }) {
    return (
        <div className="bg-[#151921] border border-[#BFBCFC]/15 rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
                {icon}
                <span className="text-[#94A3B8] text-xs">{label}</span>
            </div>

            <p className="text-[#F8FAFC] font-data text-sm">{value}</p>
        </div>
    );
}