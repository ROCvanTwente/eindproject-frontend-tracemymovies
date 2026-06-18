import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

export function BanUserModal({ isOpen, onClose, userName, onBan }) {
  const [duration, setDuration] = useState('7_days');
  const [reason, setReason] = useState('spam');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0E14]/80 backdrop-blur-sm">
      <div className="bg-[#151921] border border-[#FF61D2]/30 p-6 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2 text-[#FF61D2]">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-xl font-bold">Ban User</h3>
          </div>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-[#94A3B8] text-sm mb-6">Are you sure you want to ban <span className="text-[#F8FAFC] font-semibold">{userName}</span>?</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">Duration</label>
            <select value={duration} onChange={e => setDuration(e.target.value)} className="w-full bg-[#0B0E14] text-[#F8FAFC] p-2.5 rounded-xl border border-[#BFBCFC]/20 focus:border-[#FF61D2] focus:outline-none">
              <option value="24_hours">24 Hours</option>
              <option value="7_days">7 Days</option>
              <option value="30_days">30 Days</option>
              <option value="permanent">Permanent</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">Reason</label>
            <select value={reason} onChange={e => setReason(e.target.value)} className="w-full bg-[#0B0E14] text-[#F8FAFC] p-2.5 rounded-xl border border-[#BFBCFC]/20 focus:border-[#FF61D2] focus:outline-none">
              <option value="spam">Spam / Bots</option>
              <option value="harassment">Harassment / Toxicity</option>
              <option value="spoilers">Unmarked Spoilers</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">Internal Notes (Optional)</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Provide context for other admins..." className="w-full bg-[#0B0E14] text-[#F8FAFC] p-2.5 rounded-xl border border-[#BFBCFC]/20 focus:border-[#FF61D2] focus:outline-none h-24 resize-none"></textarea>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-8">
          <button onClick={onClose} className="px-4 py-2 text-sm text-[#94A3B8] hover:text-[#F8FAFC] transition-colors">Cancel</button>
          <button onClick={() => { onBan(duration, reason, notes); onClose(); }} className="px-5 py-2 text-sm bg-[#FF61D2] hover:bg-[#FF4DBD] text-white font-semibold rounded-lg shadow-lg shadow-[#FF61D2]/20 transition-all">
            Confirm Ban
          </button>
        </div>
      </div>
    </div>
  );
}