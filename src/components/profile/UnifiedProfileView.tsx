"use client";

import { useState, useEffect, useRef, type FormEvent, type ChangeEvent } from "react";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Bell,
  Camera,
  Save,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sun,
  Moon,
  Laptop,
  KeyRound,
} from "lucide-react";
import PinManagementSection from "./PinManagementSection";
import type { UserRole, CustomerStatus } from "@/types";

interface UserProfileData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: CustomerStatus;
  image: string | null;
  phone?: string | null;
  address?: string | null;
  preferences?: {
    theme?: "light" | "dark" | "system";
    transactionAlerts?: boolean;
    depositUpdates?: boolean;
    withdrawalUpdates?: boolean;
    loanUpdates?: boolean;
    securityAlerts?: boolean;
    promotionalEmails?: boolean;
  } | null;
}

interface UnifiedProfileProps {
  role: UserRole;
}

export default function UnifiedProfileView({ role }: UnifiedProfileProps) {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Preferences
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [notifications, setNotifications] = useState({
    transactionAlerts: true,
    depositUpdates: true,
    withdrawalUpdates: true,
    loanUpdates: true,
    securityAlerts: true,
    promotionalEmails: false,
  });

  // Avatar file upload & preview
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  // Status feedback
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/me");
      const data = await res.json();

      if (data.success && data.user) {
        const u = data.user as UserProfileData;
        setProfile(u);
        setName(u.name || "");
        setPhone(u.phone || "");
        setAddress(u.address || "");
        if (u.preferences) {
          if (u.preferences.theme) setTheme(u.preferences.theme);
          setNotifications((prev) => ({
            ...prev,
            ...u.preferences,
          }));
        }
      } else {
        setErrorMessage(data.error || "Failed to load profile.");
      }
    } catch {
      setErrorMessage("Network error loading profile. Please refresh.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const clearMessages = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  // Handle personal information save
  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!name.trim() || name.trim().length < 2) {
      setErrorMessage("Name must be at least 2 characters.");
      return;
    }

    try {
      setIsSaving(true);
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          preferences: {
            theme,
            ...notifications,
          },
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        setErrorMessage(result.error || "Failed to save profile changes.");
        return;
      }

      setProfile(result.user);
      setIsEditing(false);
      setSuccessMessage("Profile information updated successfully.");
    } catch {
      setErrorMessage("Network error saving profile changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Avatar file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    clearMessages();
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setErrorMessage("Only JPEG, PNG, or WebP images are supported.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage("Image file cannot exceed 2MB.");
      return;
    }

    setPendingFile(file);
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);
  };

  // Confirm avatar upload
  const handleUploadAvatar = async () => {
    if (!pendingFile) return;
    clearMessages();

    try {
      setIsUploadingAvatar(true);
      const formData = new FormData();
      formData.append("file", pendingFile);

      const res = await fetch("/api/auth/me/avatar", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        setErrorMessage(result.error || "Failed to upload avatar.");
        return;
      }

      setProfile((prev) => (prev ? { ...prev, image: result.image } : null));
      setPendingFile(null);
      setAvatarPreview(null);
      setSuccessMessage("Profile picture updated successfully.");
    } catch {
      setErrorMessage("Network error uploading profile image.");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Cancel avatar preview
  const handleCancelAvatar = () => {
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarPreview(null);
    setPendingFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Remove profile picture
  const handleRemoveAvatar = async () => {
    if (!confirm("Are you sure you want to remove your profile picture?")) return;
    clearMessages();

    try {
      setIsUploadingAvatar(true);
      const res = await fetch("/api/auth/me/avatar", {
        method: "DELETE",
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        setErrorMessage(result.error || "Failed to remove avatar.");
        return;
      }

      setProfile((prev) => (prev ? { ...prev, image: null } : null));
      setSuccessMessage("Profile picture removed successfully.");
    } catch {
      setErrorMessage("Network error removing avatar.");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Toggle notification preference
  const toggleNotification = async (key: keyof typeof notifications) => {
    const updated = {
      ...notifications,
      [key]: !notifications[key],
    };
    setNotifications(updated);

    try {
      await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferences: {
            theme,
            ...updated,
          },
        }),
      });
      setSuccessMessage("Preference updated.");
    } catch {
      // silently keep local state
    }
  };

  // Save theme preference
  const selectTheme = async (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    try {
      await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferences: {
            theme: newTheme,
            ...notifications,
          },
        }),
      });
      setSuccessMessage("Theme preference saved.");
    } catch {
      // silently keep local state
    }
  };

  const portalTitle =
    role === "admin"
      ? "Admin Portal / Profile"
      : role === "banking-staff"
        ? "Staff Portal / Profile"
        : "Customer Portal / Profile";

  const roleBadge =
    role === "admin"
      ? "Administrator"
      : role === "banking-staff"
        ? "Banking Staff"
        : "Bank Customer";

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-[#3F72AF]">
          <Loader2 className="animate-spin" size={24} />
          <span className="text-sm font-medium">Loading profile...</span>
        </div>
      </div>
    );
  }

  const currentImage = avatarPreview || profile?.image || null;
  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="min-h-screen bg-[#F9F7F7] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Header */}
        <div>
          <p className="mb-1 text-sm font-semibold uppercase tracking-[0.15em] text-[#3F72AF]">
            {portalTitle}
          </p>
          <h1 className="text-2xl font-bold text-[#112D4E] sm:text-3xl">
            Profile & Settings
          </h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            Manage your personal profile, security preferences, and account settings.
          </p>
        </div>

        {/* Feedback Alerts */}
        {successMessage && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <AlertCircle size={18} className="shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Profile Card & Avatar */}
        <section className="overflow-hidden rounded-2xl border border-[#DBE2EF] bg-white shadow-sm">
          <div className="h-28 bg-gradient-to-r from-[#112D4E] via-[#1D4168] to-[#3F72AF]" />

          <div className="px-5 pb-6 sm:px-7">
            <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                {/* Avatar container */}
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-[#DBE2EF] text-3xl font-bold text-[#112D4E] shadow-sm">
                  {currentImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={currentImage}
                      alt={profile?.name || "User Avatar"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>{initials}</span>
                  )}

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  {/* Camera button trigger */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Upload profile photo"
                    title="Upload profile photo"
                    disabled={isUploadingAvatar}
                    className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-[#3F72AF] text-white shadow-md transition hover:bg-[#112D4E]"
                  >
                    <Camera size={14} />
                  </button>
                </div>

                <div className="pb-1">
                  <h2 className="text-xl font-bold text-[#112D4E]">
                    {profile?.name}
                  </h2>
                  <p className="mt-0.5 text-sm text-[#6B7280]">
                    {profile?.email}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-[#3F72AF]">
                      {roleBadge}
                    </span>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                      <ShieldCheck size={12} className="mr-1 inline" />
                      Status: {profile?.status || "ACTIVE"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Avatar action buttons (Save preview or Remove) */}
              <div className="flex flex-wrap items-center gap-2">
                {pendingFile ? (
                  <>
                    <button
                      type="button"
                      onClick={handleUploadAvatar}
                      disabled={isUploadingAvatar}
                      className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#3F72AF] px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#112D4E]"
                    >
                      {isUploadingAvatar ? (
                        <Loader2 className="animate-spin" size={14} />
                      ) : (
                        <Save size={14} />
                      )}
                      Save Picture
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelAvatar}
                      disabled={isUploadingAvatar}
                      className="cursor-pointer rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  profile?.image && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      disabled={isUploadingAvatar}
                      className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 size={13} />
                      Remove Picture
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
          {/* Main Column: Personal Info Form */}
          <div className="space-y-6 xl:col-span-2">
            <section className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-50 p-3 text-[#3F72AF]">
                    <UserRound size={20} />
                  </div>
                  <div>
                    <h2 className="font-bold text-[#112D4E]">
                      Personal Information
                    </h2>
                    <p className="mt-0.5 text-xs text-[#9CA3AF]">
                      Update your contact details and authoritative profile
                    </p>
                  </div>
                </div>

                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => {
                      clearMessages();
                      setIsEditing(true);
                    }}
                    className="cursor-pointer rounded-xl border border-[#DBE2EF] px-4 py-2 text-xs font-semibold text-[#3F72AF] transition hover:bg-blue-50"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setName(profile?.name || "");
                      setPhone(profile?.phone || "");
                      setAddress(profile?.address || "");
                    }}
                    className="cursor-pointer rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* Full Name */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-[#112D4E]">
                      <UserRound size={14} className="text-[#3F72AF]" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition outline-none ${
                        isEditing
                          ? "border-[#3F72AF] bg-white text-[#112D4E] focus:ring-2 focus:ring-[#3F72AF]/20"
                          : "border-gray-200 bg-gray-50 text-gray-600"
                      }`}
                    />
                  </div>

                  {/* Registered Email (read only) */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-[#112D4E]">
                      <Mail size={14} className="text-[#3F72AF]" />
                      Account Email
                    </label>
                    <input
                      type="email"
                      disabled
                      value={profile?.email || ""}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-500 cursor-not-allowed"
                    />
                    <p className="mt-1 text-[11px] text-gray-400">
                      Primary sign-in identifier (read-only)
                    </p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-[#112D4E]">
                      <Phone size={14} className="text-[#3F72AF]" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      disabled={!isEditing}
                      placeholder="+880 1XXX-XXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition outline-none ${
                        isEditing
                          ? "border-[#3F72AF] bg-white text-[#112D4E] focus:ring-2 focus:ring-[#3F72AF]/20"
                          : "border-gray-200 bg-gray-50 text-gray-600"
                      }`}
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-[#112D4E]">
                      <MapPin size={14} className="text-[#3F72AF]" />
                      Residential Address
                    </label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      placeholder="Street, City, Postal Code"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition outline-none ${
                        isEditing
                          ? "border-[#3F72AF] bg-white text-[#112D4E] focus:ring-2 focus:ring-[#3F72AF]/20"
                          : "border-gray-200 bg-gray-50 text-gray-600"
                      }`}
                    />
                  </div>
                </div>

                {/* Save button */}
                {isEditing && (
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#112D4E] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1D4168]"
                    >
                      {isSaving ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <Save size={16} />
                      )}
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            </section>

            {/* Transaction PIN Management for Customer */}
            {role === "customer" && <PinManagementSection />}

            {/* Notification Preferences */}
            <section className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                  <Bell size={20} />
                </div>
                <div>
                  <h2 className="font-bold text-[#112D4E]">
                    Communication Preferences
                  </h2>
                  <p className="mt-0.5 text-xs text-[#9CA3AF]">
                    Choose which notifications you receive
                  </p>
                </div>
              </div>

              <div className="space-y-3.5">
                {[
                  {
                    key: "transactionAlerts" as const,
                    title: "Transaction Alerts",
                    desc: "Real-time updates on transfers, debits, and credits",
                  },
                  {
                    key: "depositUpdates" as const,
                    title: "Deposit Updates",
                    desc: "Notifications when deposits are reviewed and credited",
                  },
                  {
                    key: "withdrawalUpdates" as const,
                    title: "Withdrawal Updates",
                    desc: "Notifications on withdrawal approval and processing",
                  },
                  {
                    key: "loanUpdates" as const,
                    title: "Loan Updates",
                    desc: "Status alerts on loan applications and installments",
                  },
                  {
                    key: "securityAlerts" as const,
                    title: "Security Alerts",
                    desc: "Immediate notices for password changes and new device logins",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between rounded-xl border border-gray-100 p-3.5 transition hover:bg-gray-50"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#112D4E]">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>

                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={notifications[item.key]}
                        onChange={() => toggleNotification(item.key)}
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#3F72AF] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                    </label>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Side Column: Theme & Account Status */}
          <div className="space-y-6">
            {/* Theme Preference */}
            <section className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm sm:p-6">
              <h3 className="font-bold text-[#112D4E]">Theme Preference</h3>
              <p className="mt-1 text-xs text-gray-500">
                Choose your preferred interface appearance
              </p>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  { id: "light" as const, label: "Light", icon: Sun },
                  { id: "dark" as const, label: "Dark", icon: Moon },
                  { id: "system" as const, label: "System", icon: Laptop },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = theme === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => selectTheme(item.id)}
                      className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border p-3 text-xs font-semibold transition ${
                        isSelected
                          ? "border-[#3F72AF] bg-blue-50 text-[#3F72AF]"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon size={18} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Account Security Information */}
            <section className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm sm:p-6">
              <h3 className="font-bold text-[#112D4E]">Account Security</h3>
              <p className="mt-1 text-xs text-gray-500">
                Authority, permissions, and identity
              </p>

              <div className="mt-4 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                  <span className="text-gray-500">Role Authority</span>
                  <span className="font-semibold uppercase text-[#112D4E]">
                    {profile?.role}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                  <span className="text-gray-500">Account Status</span>
                  <span className="font-semibold text-emerald-600">
                    {profile?.status || "ACTIVE"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Account ID</span>
                  <span className="font-mono text-gray-700">
                    {profile?.id?.slice(0, 10)}...
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
