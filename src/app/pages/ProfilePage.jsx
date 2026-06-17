import { useState, useRef, useEffect } from 'react';
import { User, Mail, Lock, Upload, Trash2, X, AlertCircle, Loader2, MapPin, Users } from 'lucide-react';
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
        showFriends: user?.showFriends ?? true,
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
        showFriends: user?.showFriends ?? true,
    });

    const [savingShowFriends, setSavingShowFriends] = useState(false);
    const [usernameError, setUsernameError] = useState('');

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
            showFriends: user.showFriends ?? true,
        }));
        setSavedData({
            username: user.username || '',
            email: user.email || '',
            profilePicture: user.profilePicture,
            location: user.location || '',
            bio: user.bio || '',
            showFriends: user.showFriends ?? true,
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

        if (file.size > 100 * 1024) {
            toast.error('Afbeelding is te groot. Maximum is 100KB.');
            e.target.value = '';
            return;
        }

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
                toast.success('Profile picture saved!');
            } else {
                toast.error('Failed to save profile picture');
            }
        };
        reader.readAsDataURL(file);
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        setUsernameError('');

        if (formData.username.trim().length < 3) {
            toast.error('Username must be at least 3 characters');
            return;
        }

        const usernameChanged = formData.username !== savedData.username;
        const emailChanged = formData.email !== savedData.email;
        const locationOrBioChanged =
            (formData.location || '') !== (savedData.location || '') ||
            (formData.bio || '') !== (savedData.bio || '');

        if (!usernameChanged && !emailChanged && !locationOrBioChanged) {
            toast.warning("No changes to save.");
            return;
        }

        // Email changes still require password via reAuth
        if (emailChanged) {
            openReAuth('update');
            return;
        }

        // Username and/or location/bio — save directly without password
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email || user?.email,
                    location: formData.location || null,
                    bio: formData.bio || null,
                    showFriends: formData.showFriends,
                })
            });
            if (res.ok) {
                updateUser({ username: formData.username, location: formData.location, bio: formData.bio });
                setSavedData(prev => ({ ...prev, username: formData.username, location: formData.location, bio: formData.bio }));
                toast.success('Profile updated!');
            } else {
                const err = await res.json().catch(() => null);
                if (err?.message?.toLowerCase().includes('username')) {
                    setUsernameError(err.message);
                } else {
                    toast.error(err?.message ?? 'Update failed.');
                }
            }
        } catch {
            toast.error('Update failed.');
        }
    };

    const handleToggleShowFriends = async () => {
        const newValue = !formData.showFriends;
        setSavingShowFriends(true);
        setFormData(prev => ({ ...prev, showFriends: newValue }));
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify({
                    username: savedData.username || user?.username,
                    email: savedData.email || user?.email,
                    location: savedData.location || null,
                    bio: savedData.bio || null,
                    showFriends: newValue,
                })
            });
            if (res.ok) {
                updateUser({ showFriends: newValue });
                setSavedData(prev => ({ ...prev, showFriends: newValue }));
                toast.success(newValue ? 'Friends are now visible on your profile.' : 'Friends are now hidden from your profile.');
            } else {
                setFormData(prev => ({ ...prev, showFriends: !newValue }));
                toast.error('Failed to update setting.');
            }
        } catch {
            setFormData(prev => ({ ...prev, showFriends: !newValue }));
            toast.error('Failed to update setting.');
        } finally {
            setSavingShowFriends(false);
        }
    };

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleDeleteAccount = () => {
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirmed = () => {
        setShowDeleteConfirm(false);
        openReAuth('delete');
    };

    const handleReAuthConfirm = async () => {
        if (!reAuthPassword) {
            setReAuthError('Enter your password');
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
                        showFriends: formData.showFriends,
                        profileImageBase64: pictureChanged
                            ? (profilePicture?.includes(",") ? profilePicture.split(",")[1] : profilePicture ?? null)
                            : null
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    const updatedUser = data.user;
                    const newPicture = profilePicture ?? user?.profilePicture;

                    if (data.requiresEmailConfirmation) {
                        updateUser({ username: updatedUser.userName, profilePicture: newPicture });
                        setFormData((prev) => ({ ...prev, username: updatedUser.userName, email: updatedUser.email }));
                        setSavedData({ username: updatedUser.userName, email: updatedUser.email, profilePicture: profilePicture ?? user?.profilePicture });
                        closeReAuth();
                        toast.info(`Step 1: Check your current email to confirm the request. Step 2: Your new email (${data.pendingEmail}) will also need to confirm.`, { duration: 9000 });
                    } else {
                    updateUser({
                        username: updatedUser.userName,
                        email: updatedUser.email,
                        profilePicture: newPicture
                    });
                    setFormData((prev) => ({ ...prev, username: updatedUser.userName, email: updatedUser.email }));
                    setSavedData({ username: updatedUser.userName, email: updatedUser.email, profilePicture: profilePicture ?? user?.profilePicture });
                    closeReAuth();
                    toast.success('Profile updated!');
                    }
                } else {
                    const err = await response.json().catch(() => null);
                    setReAuthError(err?.message || 'Update failed. Check your password.');
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
                    toast.info('Check your email to confirm account deletion. The link expires in 5 minutes.', { duration: 7000 });
                } else {
                    const err = await response.json().catch(() => null);
                    setReAuthError(err?.message || 'Incorrect password');
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
            title: 'Confirm changes',
            description: 'Enter your current password to save your profile changes.',
            confirmLabel: 'Save',
            confirmClass: 'bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14]',
            iconClass: 'text-[#BFBCFC]',
            iconBg: 'bg-[#BFBCFC]/10',
            Icon: Lock,
        }
        : {
            title: 'Delete account',
            description: 'This cannot be undone. Enter your password to permanently delete your account.',
            confirmLabel: 'Delete',
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

                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-heading font-bold text-[#F8FAFC] mb-0.5 break-words">
                                        {formData.username}
                                    </h3>
                                    <p className="text-[#94A3B8] text-sm break-words">
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
                                        onChange={(e) => { setFormData({ ...formData, username: e.target.value }); setUsernameError(''); }}
                                        maxLength={20}
                                        className="w-full bg-[#0B0E14] text-[#F8FAFC] px-3 py-2 rounded-lg border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 transition-all text-sm"
                                    />
                                    <p className={`text-[10px] text-right mt-0.5 ${formData.username.length >= 20 ? "text-red-400" : "text-[#94A3B8]/50"}`}>
                                        {formData.username.length}/20
                                    </p>
                                    {usernameError && (
                                        <p className="text-red-400 text-xs mt-1">{usernameError}</p>
                                    )}
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
                                        maxLength={254}
                                        disabled={!!user?.isGoogleUser}
                                        className={`w-full bg-[#0B0E14] text-[#F8FAFC] px-3 py-2 rounded-lg border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 transition-all text-sm ${user?.isGoogleUser ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    />
                                    {user?.isGoogleUser && (
                                        <div className="flex items-center gap-1.5 mt-1.5">
                                            <svg viewBox="0 0 24 24" className="w-3 h-3 shrink-0" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                            </svg>
                                            <p className="text-[#64748B] text-xs">Managed by your Google account</p>
                                        </div>
                                    )}
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
                                        maxLength={70}
                                        rows={3}
                                        placeholder="Tell something about yourself..."
                                        className="w-full bg-[#0B0E14] text-[#F8FAFC] px-3 py-2 rounded-lg border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 transition-all text-sm placeholder-[#94A3B8]/50 resize-none"
                                    />
                                    <p className={`text-[10px] text-right mt-0.5 ${formData.bio.length >= 70 ? "text-red-400" : "text-[#94A3B8]/50"}`}>
                                        {formData.bio.length}/70
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    className="bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14] px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 shadow-lg shadow-[#BFBCFC]/30 text-sm"
                                >
                                    Update Profile
                                </button>
                            </form>
                        </div>

                        {/* Privacy */}
                        <div className="bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-lg md:rounded-xl p-4 md:p-6">
                            <h2 className="text-lg md:text-xl font-bold font-heading text-[#F8FAFC] mb-3 md:mb-4">
                                Privacy
                            </h2>

                            <button
                                type="button"
                                onClick={handleToggleShowFriends}
                                disabled={savingShowFriends}
                                className="w-full flex items-center justify-between gap-3 disabled:opacity-60"
                            >
                                <div className="flex items-center gap-3 text-left">
                                    <Users className="w-4 h-4 text-[#94A3B8] flex-shrink-0" />
                                    <div>
                                        <p className="text-[#F8FAFC] text-sm font-medium">Show friends on profile</p>
                                        <p className="text-[#94A3B8] text-xs mt-0.5">
                                            When off, your friends list is hidden from everyone except you.
                                        </p>
                                    </div>
                                </div>
                                <div className={`w-9 h-5 rounded-full relative flex-shrink-0 transition-colors ${formData.showFriends ? "bg-[#BFBCFC]" : "bg-[#94A3B8]/30"}`}>
                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.showFriends ? "left-5" : "left-1"}`} />
                                </div>
                            </button>
                        </div>

                        {/* Change Password */}
                        <div className="bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-lg md:rounded-xl p-4 md:p-6">
                            <h2 className="text-lg md:text-xl font-bold font-heading text-[#F8FAFC] mb-3 md:mb-4">
                                Change Password
                            </h2>

                            {user?.isGoogleUser ? (
                                <div className="flex items-start gap-2.5">
                                    <svg viewBox="0 0 24 24" className="w-4 h-4 mt-0.5 shrink-0" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                    </svg>
                                    <div>
                                        <p className="text-[#F8FAFC] text-sm font-medium">You're signed in with Google</p>
                                        <p className="text-[#64748B] text-xs mt-0.5">Password changes are not available for Google accounts. Manage your password through your Google account settings.</p>
                                    </div>
                                </div>
                            ) : (
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
                                            maxLength={128}
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
                                            maxLength={128}
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
                                            maxLength={128}
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
                            )}
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

            {/* Delete Confirmation Dialog */}
            {showDeleteConfirm && (
                <>
                    <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="bg-[#151921] border border-[#FF61D2]/30 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                            <div className="flex items-start gap-3 mb-4">
                                <div className="w-10 h-10 bg-[#FF61D2]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Trash2 className="w-5 h-5 text-[#FF61D2]" />
                                </div>
                                <div>
                                    <h3 className="text-[#F8FAFC] font-bold text-lg leading-tight">Delete account?</h3>
                                    <p className="text-[#94A3B8] text-sm mt-1">This will send a confirmation email. Your account will only be deleted after you click the link.</p>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 px-4 py-2 rounded-lg border border-[#BFBCFC]/20 text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#BFBCFC]/40 transition-all text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteConfirmed}
                                    className="flex-1 px-4 py-2 rounded-lg bg-[#FF61D2] hover:bg-[#FF4DC7] text-white font-bold transition-all shadow-lg shadow-[#FF61D2]/30 text-sm"
                                >
                                    Yes, continue
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

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
                                    Current password
                                </label>
                                <input
                                    type="password"
                                    value={reAuthPassword}
                                    onChange={(e) => { setReAuthPassword(e.target.value); setReAuthError(''); }}
                                    onKeyDown={(e) => e.key === 'Enter' && !reAuthLoading && handleReAuthConfirm()}
                                    placeholder="Enter your password"
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
                                    Cancel
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
