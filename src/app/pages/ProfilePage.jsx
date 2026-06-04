import { useState, useRef, useEffect } from 'react';
import { User, Mail, Lock, Upload, Trash2, X, AlertCircle, Loader2, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export function ProfilePage() {
    const { user, updateUser, logout } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [profilePicture, setProfilePicture] = useState(user?.profilePicture);
    const [imageModalOpen, setImageModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        location: user?.location || '',
        bio: user?.bio || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [savedData, setSavedData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        profilePicture: user?.profilePicture,
        location: user?.location || '',
        bio: user?.bio || '',
    });

    const [reAuthModal, setReAuthModal] = useState({ open: false, purpose: null });
    const [reAuthPassword, setReAuthPassword] = useState('');
    const [reAuthError, setReAuthError] = useState('');
    const [reAuthLoading, setReAuthLoading] = useState(false);

    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [locationLoading, setLocationLoading] = useState(false);
    const locationRef = useRef(null);

    // Close suggestions on outside click
    useEffect(() => {
        const handler = (e) => {
            if (locationRef.current && !locationRef.current.contains(e.target))
                setLocationSuggestions([]);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Debounced location search via Nominatim
    useEffect(() => {
        const q = formData.location?.trim();
        if (!q || q.length < 2) { setLocationSuggestions([]); return; }
        const timer = setTimeout(async () => {
            setLocationLoading(true);
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5&addressdetails=1`,
                    { headers: { 'Accept-Language': 'en' } }
                );
                const data = await res.json();
                setLocationSuggestions(data.map(item => {
                    const a = item.address;
                    const city = a.city || a.town || a.village || a.municipality || a.county || '';
                    const country = a.country || '';
                    return city && country ? `${city}, ${country}` : item.display_name.split(',').slice(0, 2).join(',').trim();
                }).filter((v, i, arr) => arr.indexOf(v) === i));
            } catch { setLocationSuggestions([]); }
            finally { setLocationLoading(false); }
        }, 400);
        return () => clearTimeout(timer);
    }, [formData.location]);

    const syncedRef = useRef(false);
    useEffect(() => {
        if (!user || syncedRef.current) return;
        syncedRef.current = true;
        setFormData((prev) => ({
            ...prev,
            username: user.username || '',
            email: user.email || '',
            location: user.location || '',
            bio: user.bio || '',
        }));
        setSavedData({
            username: user.username || '',
            email: user.email || '',
            profilePicture: user.profilePicture,
            location: user.location || '',
            bio: user.bio || '',
        });
        setProfilePicture(user.profilePicture);
    }, [user]);

    const getToken = () =>
        localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");

    const openReAuth = (purpose) => {
        setReAuthPassword('');
        setReAuthError('');
        setReAuthModal({ open: true, purpose });
    };

    const closeReAuth = () => {
        if (reAuthModal.purpose === 'update') {
            setFormData((prev) => ({
                ...prev,
                username: savedData.username,
                email: savedData.email,
            }));
        }
        setReAuthModal({ open: false, purpose: null });
        setReAuthPassword('');
        setReAuthError('');
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const imageUrl = reader.result;
            setProfilePicture(imageUrl);

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify({
                    username: formData.username || user?.username,
                    email: formData.email || user?.email,
                    location: formData.location || null,
                    bio: formData.bio || null,
                    profileImageBase64: imageUrl.split(",")[1]
                })
            });

            if (response.ok) {
                updateUser({ profilePicture: imageUrl });
                setSavedData(prev => ({ ...prev, profilePicture: imageUrl }));
                toast.success('Profielfoto opgeslagen!');
            } else {
                toast.error('Profielfoto opslaan mislukt');
            }
        };
        reader.readAsDataURL(file);
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        const usernameOrEmailChanged =
            formData.username !== savedData.username ||
            formData.email !== savedData.email;

        const locationOrBioChanged =
            (formData.location || '') !== (savedData.location || '') ||
            (formData.bio || '') !== (savedData.bio || '');

        if (!usernameOrEmailChanged && !locationOrBioChanged) {
            toast.warning("No changes to save.");
            return;
        }

        // Location/bio can be saved without password
        if (locationOrBioChanged && !usernameOrEmailChanged) {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/profile`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getToken()}`
                    },
                    body: JSON.stringify({
                        username: formData.username || user?.username,
                        email: formData.email || user?.email,
                        location: formData.location || null,
                        bio: formData.bio || null,
                    })
                });
                if (res.ok) {
                    const data = await res.json();
                    updateUser({ location: formData.location, bio: formData.bio });
                    setSavedData(prev => ({ ...prev, location: formData.location, bio: formData.bio }));
                    toast.success('Profile updated!');
                } else {
                    toast.error('Update failed.');
                }
            } catch {
                toast.error('Update failed.');
            }
            return;
        }

        // Username/email changes require password
        openReAuth('update');
    };

    const handleDeleteAccount = () => {
        openReAuth('delete');
    };

    const handleReAuthConfirm = async () => {
        if (!reAuthPassword) {
            setReAuthError('Voer je wachtwoord in');
            return;
        }

        setReAuthLoading(true);
        setReAuthError('');

        try {
            if (reAuthModal.purpose === 'update') {
                const pictureChanged = profilePicture !== savedData.profilePicture;
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/profile`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getToken()}`
                    },
                    body: JSON.stringify({
                        username: formData.username,
                        email: formData.email,
                        currentPassword: reAuthPassword,
                        location: formData.location || null,
                        bio: formData.bio || null,
                        profileImageBase64: pictureChanged
                            ? (profilePicture?.includes(",") ? profilePicture.split(",")[1] : profilePicture ?? null)
                            : null
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    const updatedUser = data.user;
                    const newPicture = profilePicture ?? user?.profilePicture;
                    updateUser({
                        username: updatedUser.userName,
                        email: updatedUser.email,
                        profilePicture: newPicture
                    });
                    setFormData((prev) => ({ ...prev, username: updatedUser.userName, email: updatedUser.email }));
                    setSavedData({ username: updatedUser.userName, email: updatedUser.email, profilePicture: newPicture });
                    setReAuthModal({ open: false, purpose: null });
                    setReAuthPassword('');
                    setReAuthError('');
                    toast.success('Profiel bijgewerkt!');
                } else {
                    const err = await response.json().catch(() => null);
                    setReAuthError(err?.message || 'Bijwerken mislukt. Controleer je wachtwoord.');
                }
            } else if (reAuthModal.purpose === 'delete') {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/delete`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getToken()}`
                    },
                    body: JSON.stringify({ currentPassword: reAuthPassword })
                });

                if (response.ok) {
                    closeReAuth();
                    logout();
                    navigate('/');
                    toast.success('Account verwijderd');
                } else {
                    const err = await response.json().catch(() => null);
                    setReAuthError(err?.message || 'Onjuist wachtwoord');
                }
            }
        } finally {
            setReAuthLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (formData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/change-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`
            },
            body: JSON.stringify({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            })
        });

        if (response.ok) {
            toast.success('Password changed successfully!');
            setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
        } else {
            const errors = await response.json().catch(() => null);
            const msg = errors?.message ?? errors?.[0]?.description ?? "Password change failed";
            toast.error(msg);
        }
    };

    const modalConfig = reAuthModal.purpose === 'update'
        ? {
            title: 'Bevestig wijzigingen',
            description: 'Voer je huidige wachtwoord in om je profielwijzigingen op te slaan.',
            confirmLabel: 'Opslaan',
            confirmClass: 'bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14]',
            iconClass: 'text-[#BFBCFC]',
            iconBg: 'bg-[#BFBCFC]/10',
            Icon: Lock,
        }
        : {
            title: 'Account verwijderen',
            description: 'Dit kan niet ongedaan worden gemaakt. Voer je wachtwoord in om je account permanent te verwijderen.',
            confirmLabel: 'Verwijderen',
            confirmClass: 'bg-[#FF61D2] hover:bg-[#FF4DC7] text-white',
            iconClass: 'text-[#FF61D2]',
            iconBg: 'bg-[#FF61D2]/10',
            Icon: Trash2,
        };

    return (
        <>
            <div className="min-h-screen py-6 md:py-8">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">

                        <div className="mb-4 md:mb-6">
                            <h1 className="text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC] mb-1">
                                Account
                            </h1>
                            <p className="text-[#94A3B8] text-sm">
                                Account Settings
                            </p>
                        </div>

                        {/* Profile Settings */}
                        <div className="bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-lg md:rounded-xl p-4 md:p-6">
                            <h2 className="text-lg md:text-xl font-bold font-heading text-[#F8FAFC] mb-3 md:mb-4">
                                Profile Settings
                            </h2>

                            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                                <div className="relative">
                                    {profilePicture ? (
                                        <img
                                            src={profilePicture}
                                            alt="Profile"
                                            onClick={() => setImageModalOpen(true)}
                                            className="w-20 h-20 rounded-full object-cover border-2 border-[#BFBCFC] cursor-pointer hover:brightness-110 transition-all"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] rounded-full flex items-center justify-center">
                                            <User className="w-10 h-10 text-[#0B0E14]" />
                                        </div>
                                    )}

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfilePictureChange}
                                        className="hidden"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute bottom-0 right-0 bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14] p-1.5 rounded-full transition-all shadow-lg"
                                    >
                                        <Upload className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                <div>
                                    <h3 className="text-lg font-heading font-bold text-[#F8FAFC] mb-0.5">
                                        {formData.username}
                                    </h3>
                                    <p className="text-[#94A3B8] text-sm">
                                        {formData.email}
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div>
                                    <label className="block text-[#F8FAFC] mb-1.5 font-medium text-sm">
                                        <User className="w-3.5 h-3.5 inline mr-1.5" />
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="w-full bg-[#0B0E14] text-[#F8FAFC] px-3 py-2 rounded-lg border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 transition-all text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[#F8FAFC] mb-1.5 font-medium text-sm">
                                        <Mail className="w-3.5 h-3.5 inline mr-1.5" />
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-[#0B0E14] text-[#F8FAFC] px-3 py-2 rounded-lg border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 transition-all text-sm"
                                    />
                                </div>

                                <div className="relative" ref={locationRef}>
                                    <label className="block text-[#F8FAFC] mb-1.5 font-medium text-sm">
                                        <MapPin className="w-3.5 h-3.5 inline mr-1.5" />
                                        Location
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8] pointer-events-none" />
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            maxLength={100}
                                            placeholder="Search your city..."
                                            className="w-full bg-[#0B0E14] text-[#F8FAFC] pl-9 pr-3 py-2 rounded-lg border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 transition-all text-sm placeholder-[#94A3B8]/50"
                                        />
                                        {locationLoading && (
                                            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8] animate-spin" />
                                        )}
                                    </div>

                                    {locationSuggestions.length > 0 && (
                                        <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-[#151921] border border-[#BFBCFC]/20 rounded-xl shadow-2xl overflow-hidden">
                                            {locationSuggestions.map((s, i) => (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData({ ...formData, location: s });
                                                        setLocationSuggestions([]);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-[#BFBCFC]/8 transition-colors border-b border-[#BFBCFC]/8 last:border-none"
                                                >
                                                    <MapPin className="w-3.5 h-3.5 text-[#BFBCFC] flex-shrink-0" />
                                                    <span className="text-[#F8FAFC]">{s}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-[#F8FAFC] mb-1.5 font-medium text-sm">
                                        Bio
                                    </label>
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        maxLength={500}
                                        rows={3}
                                        placeholder="Tell something about yourself..."
                                        className="w-full bg-[#0B0E14] text-[#F8FAFC] px-3 py-2 rounded-lg border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 transition-all text-sm placeholder-[#94A3B8]/50 resize-none"
                                    />
                                    {formData.bio.length > 400 && (
                                        <p className={`text-[10px] text-right mt-0.5 ${formData.bio.length >= 500 ? "text-red-400" : "text-[#94A3B8]/50"}`}>
                                            {formData.bio.length}/500
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14] px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 shadow-lg shadow-[#BFBCFC]/30 text-sm"
                                >
                                    Update Profile
                                </button>
                            </form>
                        </div>

                        {/* Change Password */}
                        <div className="bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-lg md:rounded-xl p-4 md:p-6">
                            <h2 className="text-lg md:text-xl font-bold font-heading text-[#F8FAFC] mb-3 md:mb-4">
                                Change Password
                            </h2>

                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <div>
                                    <label className="block text-[#F8FAFC] mb-1.5 font-medium text-sm">
                                        <Lock className="w-3.5 h-3.5 inline mr-1.5" />
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.currentPassword}
                                        onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                        className="w-full bg-[#0B0E14] text-[#F8FAFC] px-3 py-2 rounded-lg border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 transition-all text-sm"
                                        placeholder="Enter current password"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[#F8FAFC] mb-1.5 font-medium text-sm">
                                        <Lock className="w-3.5 h-3.5 inline mr-1.5" />
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.newPassword}
                                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                        className="w-full bg-[#0B0E14] text-[#F8FAFC] px-3 py-2 rounded-lg border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 transition-all text-sm"
                                        placeholder="Enter new password"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[#F8FAFC] mb-1.5 font-medium text-sm">
                                        <Lock className="w-3.5 h-3.5 inline mr-1.5" />
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        className="w-full bg-[#0B0E14] text-[#F8FAFC] px-3 py-2 rounded-lg border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 transition-all text-sm"
                                        placeholder="Confirm new password"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="bg-[#44FFFF] hover:bg-[#3EEFEF] text-[#0B0E14] px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 shadow-lg shadow-[#44FFFF]/30 text-sm"
                                >
                                    Change Password
                                </button>
                            </form>
                        </div>

                        {/* Danger Zone */}
                        <div className="bg-[#FF61D2]/10 border border-[#FF61D2]/30 rounded-lg md:rounded-xl p-4 md:p-6">
                            <h2 className="text-lg md:text-xl font-bold font-heading text-[#F8FAFC] mb-2">
                                Danger Zone
                            </h2>
                            <p className="text-[#94A3B8] mb-4 text-sm">
                                Once you delete your account, there is no going back. Please be certain.
                            </p>
                            <button
                                onClick={handleDeleteAccount}
                                className="bg-[#FF61D2] hover:bg-[#FF4DC7] text-[#F8FAFC] px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1.5 shadow-lg shadow-[#FF61D2]/30 text-sm"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete Account
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* Re-Auth Modal */}
            {reAuthModal.open && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                        onClick={closeReAuth}
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="bg-[#151921] border border-[#BFBCFC]/15 rounded-2xl p-6 w-full max-w-sm shadow-2xl">

                            {/* Header */}
                            <div className="flex items-start gap-3 mb-4">
                                <div className={`w-10 h-10 ${modalConfig.iconBg} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                    <modalConfig.Icon className={`w-5 h-5 ${modalConfig.iconClass}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-[#F8FAFC] font-bold text-lg leading-tight">
                                        {modalConfig.title}
                                    </h3>
                                    <p className="text-[#94A3B8] text-sm mt-1">
                                        {modalConfig.description}
                                    </p>
                                </div>
                                <button
                                    onClick={closeReAuth}
                                    className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors flex-shrink-0"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Password input */}
                            <div className="mb-3">
                                <label className="block text-[#F8FAFC] text-sm font-medium mb-1.5">
                                    <Lock className="w-3.5 h-3.5 inline mr-1.5" />
                                    Huidig wachtwoord
                                </label>
                                <input
                                    type="password"
                                    value={reAuthPassword}
                                    onChange={(e) => { setReAuthPassword(e.target.value); setReAuthError(''); }}
                                    onKeyDown={(e) => e.key === 'Enter' && !reAuthLoading && handleReAuthConfirm()}
                                    placeholder="Voer je wachtwoord in"
                                    autoFocus
                                    className="w-full bg-[#0B0E14] text-[#F8FAFC] px-3 py-2.5 rounded-lg border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 transition-all text-sm"
                                />
                            </div>

                            {/* Error */}
                            {reAuthError && (
                                <div className="flex items-center gap-2 bg-[#FF61D2]/10 border border-[#FF61D2]/30 rounded-lg px-3 py-2.5 mb-3">
                                    <AlertCircle className="w-4 h-4 text-[#FF61D2] flex-shrink-0" />
                                    <p className="text-[#F8FAFC] text-sm">{reAuthError}</p>
                                </div>
                            )}

                            {/* Buttons */}
                            <div className="flex gap-3 mt-5">
                                <button
                                    onClick={closeReAuth}
                                    disabled={reAuthLoading}
                                    className="flex-1 bg-[#0B0E14] border border-[#BFBCFC]/15 text-[#94A3B8] hover:text-[#F8FAFC] py-2.5 rounded-lg font-medium transition-all text-sm disabled:opacity-50"
                                >
                                    Annuleren
                                </button>
                                <button
                                    onClick={handleReAuthConfirm}
                                    disabled={reAuthLoading || !reAuthPassword}
                                    className={`flex-1 py-2.5 rounded-lg font-medium transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${modalConfig.confirmClass}`}
                                >
                                    {reAuthLoading
                                        ? <Loader2 className="w-4 h-4 animate-spin" />
                                        : modalConfig.confirmLabel
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Profile picture modal */}
            {imageModalOpen && profilePicture && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    onClick={() => setImageModalOpen(false)}
                >
                    <div
                        className="relative max-w-sm w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setImageModalOpen(false)}
                            className="absolute -top-3 -right-3 w-8 h-8 bg-[#151921] border border-[#BFBCFC]/20 rounded-full flex items-center justify-center hover:bg-[#BFBCFC]/10 transition-colors z-10"
                        >
                            <X className="w-4 h-4 text-[#F8FAFC]" />
                        </button>
                        <img
                            src={profilePicture}
                            alt="Profile"
                            className="w-full rounded-2xl border-2 border-[#BFBCFC]/30 shadow-2xl shadow-[#BFBCFC]/20 object-cover"
                        />
                    </div>
                </div>
            )}
        </>
    );
}
