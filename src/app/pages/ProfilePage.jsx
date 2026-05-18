import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import { User, Mail, Lock, Upload, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
export function ProfilePage() {
    const { user, updateUser } = useAuth();
    const fileInputRef = useRef(null);
    const [profilePicture, setProfilePicture] = useState(user?.profilePicture);
    const [formData, setFormData] = useState({
        username: user?.username || 'MovieLover2024',
        email: user?.email || 'user@example.com',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const handleProfilePictureChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageUrl = reader.result;
                setProfilePicture(imageUrl);
                if (user) {
                    updateUser({ ...user, profilePicture: imageUrl });
                    toast.success('Profile picture updated!');
                }
            };
            reader.readAsDataURL(file);
        }
    };
    const handleUpdateProfile = (e) => {
        e.preventDefault();
        if (user) {
            updateUser({ ...user, username: formData.username, email: formData.email });
            toast.success('Profile updated successfully!');
        }
    };
    const handleChangePassword = (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        if (formData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        toast.success('Password changed successfully!');
        setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
    };
    const handleDeleteAccount = () => {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            console.log('Delete account');
        }
    };
    return (_jsx("div", { className: "min-h-screen py-6 md:py-8", children: _jsxs("div", { className: "container mx-auto px-4 max-w-6xl", children: [_jsxs("div", { className: "mb-4 md:mb-6", children: [_jsx("h1", { className: "text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC] mb-1", children: "Account" }), _jsx("p", { className: "text-[#94A3B8] text-sm", children: "Manage your profile and preferences" })] }), _jsxs("div", { className: "max-w-4xl mx-auto space-y-4 md:space-y-6", children: [_jsxs("div", { className: "bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-lg md:rounded-xl p-4 md:p-6", children: [_jsx("h2", { className: "text-lg md:text-xl font-bold font-heading text-[#F8FAFC] mb-3 md:mb-4", children: "Profile Settings" }), _jsxs("div", { className: "flex items-center gap-3 md:gap-4 mb-4 md:mb-6", children: [_jsxs("div", { className: "relative", children: [profilePicture ? (_jsx("img", { src: profilePicture, alt: "Profile", className: "w-20 h-20 rounded-full object-cover border-2 border-[#BFBCFC]" })) : (_jsx("div", { className: "w-20 h-20 bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] rounded-full flex items-center justify-center", children: _jsx(User, { className: "w-10 h-10 text-[#0B0E14]" }) })), _jsx("input", { ref: fileInputRef, type: "file", accept: "image/*", onChange: handleProfilePictureChange, className: "hidden" }), _jsx("button", { type: "button", onClick: () => fileInputRef.current?.click(), className: "absolute bottom-0 right-0 bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14] p-1.5 rounded-full transition-all shadow-lg", children: _jsx(Upload, { className: "w-3.5 h-3.5" }) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-heading font-bold text-[#F8FAFC] mb-0.5", children: formData.username }), _jsx("p", { className: "text-[#94A3B8] text-sm", children: formData.email })] })] }), _jsxs("form", { onSubmit: handleUpdateProfile, className: "space-y-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-[#F8FAFC] mb-1.5 font-medium text-sm", children: [_jsx(User, { className: "w-3.5 h-3.5 inline mr-1.5" }), "Username"] }), _jsx("input", { type: "text", value: formData.username, onChange: (e) => setFormData({ ...formData, username: e.target.value }), className: "w-full bg-[#0B0E14] text-[#F8FAFC] px-3 py-2 rounded-lg border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 transition-all text-sm" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-[#F8FAFC] mb-1.5 font-medium text-sm", children: [_jsx(Mail, { className: "w-3.5 h-3.5 inline mr-1.5" }), "Email"] }), _jsx("input", { type: "email", value: formData.email, onChange: (e) => setFormData({ ...formData, email: e.target.value }), className: "w-full bg-[#0B0E14] text-[#F8FAFC] px-3 py-2 rounded-lg border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 transition-all text-sm" })] }), _jsx("button", { type: "submit", className: "bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14] px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 shadow-lg shadow-[#BFBCFC]/30 text-sm", children: "Update Profile" })] })] }), _jsxs("div", { className: "bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-lg md:rounded-xl p-4 md:p-6", children: [_jsx("h2", { className: "text-lg md:text-xl font-bold font-heading text-[#F8FAFC] mb-3 md:mb-4", children: "Change Password" }), _jsxs("form", { onSubmit: handleChangePassword, className: "space-y-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-[#F8FAFC] mb-1.5 font-medium text-sm", children: [_jsx(Lock, { className: "w-3.5 h-3.5 inline mr-1.5" }), "Current Password"] }), _jsx("input", { type: "password", value: formData.currentPassword, onChange: (e) => setFormData({ ...formData, currentPassword: e.target.value }), className: "w-full bg-[#0B0E14] text-[#F8FAFC] px-3 py-2 rounded-lg border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 transition-all text-sm", placeholder: "Enter current password" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-[#F8FAFC] mb-1.5 font-medium text-sm", children: [_jsx(Lock, { className: "w-3.5 h-3.5 inline mr-1.5" }), "New Password"] }), _jsx("input", { type: "password", value: formData.newPassword, onChange: (e) => setFormData({ ...formData, newPassword: e.target.value }), className: "w-full bg-[#0B0E14] text-[#F8FAFC] px-3 py-2 rounded-lg border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 transition-all text-sm", placeholder: "Enter new password" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-[#F8FAFC] mb-1.5 font-medium text-sm", children: [_jsx(Lock, { className: "w-3.5 h-3.5 inline mr-1.5" }), "Confirm New Password"] }), _jsx("input", { type: "password", value: formData.confirmPassword, onChange: (e) => setFormData({ ...formData, confirmPassword: e.target.value }), className: "w-full bg-[#0B0E14] text-[#F8FAFC] px-3 py-2 rounded-lg border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 transition-all text-sm", placeholder: "Confirm new password" })] }), _jsx("button", { type: "submit", className: "bg-[#44FFFF] hover:bg-[#3EEFEF] text-[#0B0E14] px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 shadow-lg shadow-[#44FFFF]/30 text-sm", children: "Change Password" })] })] }), _jsxs("div", { className: "bg-[#FF61D2]/10 border border-[#FF61D2]/30 rounded-lg md:rounded-xl p-4 md:p-6", children: [_jsx("h2", { className: "text-lg md:text-xl font-bold font-heading text-[#F8FAFC] mb-2", children: "Danger Zone" }), _jsx("p", { className: "text-[#94A3B8] mb-4 text-sm", children: "Once you delete your account, there is no going back. Please be certain." }), _jsxs("button", { onClick: handleDeleteAccount, className: "bg-[#FF61D2] hover:bg-[#FF4DC7] text-[#F8FAFC] px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1.5 shadow-lg shadow-[#FF61D2]/30 text-sm", children: [_jsx(Trash2, { className: "w-3.5 h-3.5" }), "Delete Account"] })] })] })] }) }));
}
