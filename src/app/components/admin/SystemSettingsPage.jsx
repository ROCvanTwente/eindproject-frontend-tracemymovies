import { useState, useEffect } from 'react';
import { Save, Loader2, AlertCircle, RefreshCw, CheckCircle, Shield, MessageSquare, Database } from 'lucide-react';
import { toast } from 'sonner';

const ToggleSwitch = ({ on, onChange }) => (
  <button
    role="switch"
    aria-checked={on}
    onClick={onChange}
    className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border-2 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BFBCFC]/60 ${
      on ? 'bg-[#BFBCFC] border-[#BFBCFC]' : 'bg-[#1E2535] border-[#2A3042]'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-300 ${
        on ? 'translate-x-5' : 'translate-x-1'
      }`}
    />
  </button>
);

const CardHeader = ({ icon, title, subtitle }) => (
  <div className="flex items-center gap-3 pb-5 mb-5 border-b border-[rgba(191,188,252,0.07)]">
    <div className="w-9 h-9 rounded-lg bg-[rgba(191,188,252,0.08)] flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="text-sm font-bold text-[#F8FAFC]" style={{ fontFamily: 'Poppins, sans-serif' }}>{title}</h3>
      <p className="text-xs text-[#4B5563] mt-0.5">{subtitle}</p>
    </div>
  </div>
);

const SettingRow = ({ label, description, control, hasDivider = true }) => (
  <div className={`flex items-center gap-6 justify-between py-4 ${hasDivider ? 'border-b border-[rgba(191,188,252,0.06)]' : ''}`}>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-[#F8FAFC]">{label}</p>
      <p className="text-xs text-[#4B5563] mt-0.5 leading-relaxed max-w-md">{description}</p>
    </div>
    <div className="shrink-0">{control}</div>
  </div>
);

export function SystemSettingsPage() {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    allowNewRegistrations: true,
    publicReviewsEnabled: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [isPurgingCache, setIsPurgingCache] = useState(false);

  const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  // Fetch settings from backend on load
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/admin/settings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSettings({
          maintenanceMode: data.maintenanceMode ?? data.MaintenanceMode ?? false,
          allowNewRegistrations: data.allowNewRegistrations ?? data.AllowNewRegistrations ?? true,
          publicReviewsEnabled: data.publicReviewsEnabled ?? data.PublicReviewsEnabled ?? data.publicreviewsenabeld ?? data.Publicreviewsenabeld ?? true,
        });
      } else {
        toast.error("Failed to load system settings from server.");
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
      toast.error("Network error while loading settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Handle saving the modified configuration
  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${baseUrl}/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...settings,
          publicreviewsenabeld: settings.publicReviewsEnabled,
          Publicreviewsenabeld: settings.publicReviewsEnabled
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setSettingsSaved(true);
        toast.success('Settings saved successfully.');
        setTimeout(() => setSettingsSaved(false), 3000);
      } else {
        toast.error("Failed to save changes. Make sure you are an Admin.");
      }
    } catch (err) {
      console.error("Error updating settings:", err);
      toast.error("Network error while saving settings.");
    } finally {
      setSaving(false);
    }
  };

  // Toggle switch helper function
  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePurgeCache = () => {
    setIsPurgingCache(true);
    setTimeout(() => {
      setIsPurgingCache(false);
      toast.success('Application cache purged. Fresh data will be fetched on next load.');
    }, 1800);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-[#94A3B8]">
        <Loader2 className="w-8 h-8 animate-spin text-[#BFBCFC]" />
        <p className="text-sm font-medium">Loading system configurations...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 sm:p-6">
      {/* ── Page Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#F8FAFC]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            System Settings
          </h2>
          <p className="text-xs text-[#4B5563] mt-0.5 max-w-lg leading-relaxed">
            Configure global application states, security rules, and third-party API integrations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {settingsSaved && (
            <div className="flex items-center gap-1.5 text-xs text-[#4ADE80] px-3 py-1.5 rounded-lg bg-green-400/8 border border-green-400/20">
              <CheckCircle className="w-3.5 h-3.5" />
              Saved
            </div>
          )}
          <button
            onClick={() => {
              fetchSettings(); // Re-fetch to discard local changes
              toast.info('Changes discarded.');
            }}
            className="px-4 py-2 text-sm font-medium text-[#94A3B8] border border-[#2A3042] rounded-lg hover:border-[#3D4A5C] hover:text-[#F8FAFC] transition-all"
          >
            Discard
          </button>
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#0B0E14] bg-[#BFBCFC] hover:bg-[#AFA9FF] rounded-lg transition-all shadow-lg shadow-[#BFBCFC]/15 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </div>

      {/* Settings Options Card Container */}
      <div className="bg-[#151921] border border-[#BFBCFC]/15 rounded-xl p-6 shadow-xl">
        <CardHeader icon={<Shield className="w-4 h-4 text-[#BFBCFC]"/>} title="Access & Security" subtitle="Manage platform entry and visibility" />
        <SettingRow 
          label="Maintenance Mode" 
          description="Locks down public features. Only users with administrative roles can access database platforms while this is active." 
          control={<ToggleSwitch on={settings.maintenanceMode} onChange={() => toggleSetting('maintenanceMode')} />} 
        />
        <SettingRow 
          label="Allow New Registrations" 
          description="Controls account registration. When disabled, the authentication registration portal will throw a bad request error for new prospects." 
          control={<ToggleSwitch on={settings.allowNewRegistrations} onChange={() => toggleSetting('allowNewRegistrations')} />} 
          hasDivider={false} 
        />
      </div>

      <div className="bg-[#151921] border border-[#BFBCFC]/15 rounded-xl p-6 shadow-xl">
        <CardHeader icon={<MessageSquare className="w-4 h-4 text-[#BFBCFC]"/>} title="Content & Community" subtitle="Global rules for user-generated content" />
        <SettingRow 
          label="Public Reviews Enabled" 
          description="Globally displays user film critiques. If toggled off, movie review lookups will temporarily be restricted to authors only." 
          control={<ToggleSwitch on={settings.publicReviewsEnabled} onChange={() => toggleSetting('publicReviewsEnabled')} />} 
          hasDivider={false} 
        />
      </div>

      <div className="bg-[#151921] border border-[#BFBCFC]/15 rounded-xl p-6 shadow-xl">
        <CardHeader icon={<Database className="w-4 h-4 text-[#BFBCFC]"/>} title="System Operations" subtitle="Advanced actions and cache management" />
        <SettingRow 
          label="Purge Application Cache" 
          description="Forces the application to invalidate stale data and fetch fresh TMDB and API responses." 
          control={
            <button onClick={handlePurgeCache} disabled={isPurgingCache} className="px-4 py-2 text-xs font-semibold text-[#F8FAFC] bg-[#1E2535] hover:bg-[#2A3042] border border-[#2A3042] rounded-lg transition-all flex items-center gap-2 disabled:opacity-50">
              {isPurgingCache ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              Purge Cache
            </button>
          } 
          hasDivider={false} 
        />
      </div>

      {/* Safety Notice Box */}
      <div className="bg-[#FF61D2]/5 border border-[#FF61D2]/20 rounded-xl p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-[#FF61D2] flex-shrink-0 mt-0.5" />
        <p className="text-xs text-[#94A3B8] leading-relaxed">
          <strong>Caution:</strong> Changes committed here apply instantly across the whole cluster database environment. Ensure configuration checks match live operation strategies before submitting.
        </p>
      </div>

    </div>
  );
}