
"use client";

import { useState, type FormEvent } from "react";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  BriefcaseBusiness,
  CalendarDays,
  ShieldCheck,
  Pencil,
  Save,
  X,
  Bell,
  LockKeyhole,
  Eye,
  EyeOff,
  Monitor,
  Smartphone,
  CheckCircle2,
  Settings,
} from "lucide-react";

type Tab = "profile" | "settings";

export default function StaffProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");

  const [profile, setProfile] = useState({
    name: "Alex Morgan",
    email: "alex.morgan@trustora.com",
    phone: "+1 202 555 0145",
    address: "Central Branch, New York",
    department: "Customer Operations",
    employeeId: "TRS-STAFF-001",
    role: "Banking Staff",
    joined: "January 15, 2024",
  });

  const [form, setForm] = useState(profile);

  const [notifications, setNotifications] = useState({
    email: true,
    application: true,
    transaction: true,
    security: true,
  });

  const [appearance, setAppearance] = useState("light");

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const fields = [
    { label: "Full Name", key: "name", icon: UserRound },
    { label: "Email Address", key: "email", icon: Mail },
    { label: "Phone Number", key: "phone", icon: Phone },
    { label: "Branch / Address", key: "address", icon: MapPin },
    { label: "Department", key: "department", icon: BriefcaseBusiness },
  ] as const;

  const notificationItems = [
    {
      key: "email" as const,
      title: "Email Notifications",
      description: "Receive important updates through your registered email.",
      icon: Mail,
    },
    {
      key: "application" as const,
      title: "Loan Application Updates",
      description: "Get notified about new and updated loan applications.",
      icon: Bell,
    },
    {
      key: "transaction" as const,
      title: "Transaction Alerts",
      description: "Receive notifications about pending transaction reviews.",
      icon: Smartphone,
    },
    {
      key: "security" as const,
      title: "Security Notifications",
      description: "Receive alerts about important account security events.",
      icon: ShieldCheck,
    },
  ];

  const handleProfileSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfile(form);
    setEditing(false);
    setSaved(true);
  };

  const handlePasswordSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password.new.length < 8) {
      setPasswordMessage("New password must be at least 8 characters.");
      return;
    }

    if (password.new !== password.confirm) {
      setPasswordMessage("New password and confirmation do not match.");
      return;
    }

    setPasswordMessage(
      "This is a UI prototype. Password changes are not connected to authentication yet."
    );
    setPassword({ current: "", new: "", confirm: "" });
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((current) => ({
      ...current,
      [key]: !current[key],
    }));
    setSaved(false);
  };

  return (
    <div className="min-h-screen bg-[#F9F7F7] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-7">

        {/* Page Header */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#3F72AF]">
            Banking Staff / Account
          </p>
          <h1 className="mt-2 text-2xl font-bold text-[#112D4E] sm:text-3xl">
            My Account
          </h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            Manage your profile information, preferences, and account security.
          </p>
        </div>

        {/* Profile Banner */}
        <div className="overflow-hidden rounded-2xl bg-[#112D4E] p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 text-white">
              <UserRound size={38} />
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
              <p className="mt-1 text-sm text-blue-100">{profile.role}</p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white">
                <ShieldCheck size={14} />
                Staff Account
              </div>
            </div>

            <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3">
              <p className="text-xs text-blue-100">Employee ID</p>
              <p className="mt-1 font-semibold text-white">{profile.employeeId}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 rounded-xl border border-[#DBE2EF] bg-white p-2 shadow-sm">
          <button
            onClick={() => {
              setActiveTab("profile");
              setSaved(false);
            }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition ${
              activeTab === "profile"
                ? "bg-[#112D4E] text-white"
                : "text-[#6B7280] hover:bg-[#F9F7F7]"
            }`}
          >
            <UserRound size={17} />
            Profile
          </button>

          <button
            onClick={() => {
              setActiveTab("settings");
              setSaved(false);
            }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition ${
              activeTab === "settings"
                ? "bg-[#112D4E] text-white"
                : "text-[#6B7280] hover:bg-[#F9F7F7]"
            }`}
          >
            <Settings size={17} />
            Settings
          </button>
        </div>

        {saved && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            <CheckCircle2 size={17} />
            Changes have been saved locally.
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="overflow-hidden rounded-2xl border border-[#DBE2EF] bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-[#DBE2EF] p-5 sm:p-6">
              <div>
                <h3 className="font-bold text-[#112D4E]">Personal Information</h3>
                <p className="mt-1 text-sm text-[#6B7280]">
                  Your contact and work details.
                </p>
              </div>

              {!editing && (
                <button
                  onClick={() => {
                    setForm(profile);
                    setEditing(true);
                    setSaved(false);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#DBE2EF] px-4 py-2.5 text-sm font-semibold text-[#3F72AF] transition hover:bg-blue-50"
                >
                  <Pencil size={15} />
                  Edit
                </button>
              )}
            </div>

            <form onSubmit={handleProfileSave} className="p-5 sm:p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                {fields.map(({ label, key, icon: Icon }) => (
                  <div key={key}>
                    <label className="mb-2 block text-sm font-medium text-[#4B5563]">
                      {label}
                    </label>
                    <div className="relative">
                      <Icon
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
                      />
                      <input
                        value={editing ? form[key] : profile[key]}
                        disabled={!editing}
                        onChange={(e) =>
                          setForm((current) => ({
                            ...current,
                            [key]: e.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-[#DBE2EF] bg-[#F9F7F7] py-3 pl-10 pr-4 text-sm text-[#112D4E] outline-none transition focus:border-[#3F72AF] disabled:opacity-90"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="my-8 border-t border-[#DBE2EF]" />

              <h3 className="mb-5 font-bold text-[#112D4E]">
                Employment Information
              </h3>

              <div className="grid gap-5 sm:grid-cols-2">
                {[
                  { label: "Employee ID", value: profile.employeeId, icon: BriefcaseBusiness },
                  { label: "Staff Role", value: profile.role, icon: ShieldCheck },
                  { label: "Joining Date", value: profile.joined, icon: CalendarDays },
                  { label: "Account Type", value: "Employee Account", icon: ShieldCheck },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label}>
                    <label className="mb-2 block text-sm font-medium text-[#4B5563]">
                      {label}
                    </label>
                    <div className="flex items-center gap-3 rounded-xl border border-[#DBE2EF] bg-[#F9F7F7] px-4 py-3 text-sm text-[#112D4E]">
                      <Icon size={17} className="text-[#3F72AF]" />
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              {editing && (
                <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#DBE2EF] pt-6 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setForm(profile);
                      setEditing(false);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#DBE2EF] px-5 py-3 text-sm font-semibold text-[#4B5563] hover:bg-[#F9F7F7]"
                  >
                    <X size={16} />
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#112D4E] px-5 py-3 text-sm font-semibold text-white hover:bg-[#172554]"
                  >
                    <Save size={16} />
                    Save Changes
                  </button>
                </div>
              )}
            </form>

            <div className="border-t border-[#DBE2EF] bg-blue-50 p-5">
              <div className="flex gap-3">
                <ShieldCheck size={21} className="shrink-0 text-blue-700" />
                <div>
                  <h3 className="text-sm font-semibold text-blue-900">
                    Account security
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-blue-800">
                    Your employee ID, assigned role, and joining date are managed
                    by the bank. Contact an administrator if these details need to change.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "settings" && (
          <div className="space-y-6">

            {/* Notifications */}
            <section className="overflow-hidden rounded-2xl border border-[#DBE2EF] bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-[#DBE2EF] p-5 sm:p-6">
                <div className="rounded-xl bg-blue-50 p-3 text-[#3F72AF]">
                  <Bell size={21} />
                </div>
                <div>
                  <h2 className="font-bold text-[#112D4E]">Notifications</h2>
                  <p className="mt-1 text-sm text-[#6B7280]">
                    Choose which updates you want to receive.
                  </p>
                </div>
              </div>

              <div className="divide-y divide-[#DBE2EF] px-5 sm:px-6">
                {notificationItems.map(({ key, title, description, icon: Icon }) => (
                  <div
                    key={key}
                    className="flex items-center justify-between gap-4 py-5"
                  >
                    <div className="flex items-start gap-3">
                      <Icon size={19} className="mt-1 shrink-0 text-[#3F72AF]" />
                      <div>
                        <p className="text-sm font-semibold text-[#112D4E]">
                          {title}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-[#6B7280]">
                          {description}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={notifications[key]}
                      onClick={() => toggleNotification(key)}
                      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                        notifications[key] ? "bg-[#3F72AF]" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                          notifications[key] ? "left-6" : "left-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Appearance */}
            <section className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-[#3F72AF]">
                  <Monitor size={21} />
                </div>
                <div>
                  <h2 className="font-bold text-[#112D4E]">Appearance</h2>
                  <p className="mt-1 text-sm text-[#6B7280]">
                    Choose your preferred dashboard appearance.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  { value: "light", label: "Light Mode", description: "Bright and clean interface" },
                  { value: "dark", label: "Dark Mode", description: "A darker viewing experience" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setAppearance(option.value);
                      setSaved(false);
                    }}
                    className={`rounded-xl border p-4 text-left transition ${
                      appearance === option.value
                        ? "border-[#3F72AF] bg-blue-50"
                        : "border-[#DBE2EF] hover:border-[#9CA3AF]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#112D4E]">
                        {option.label}
                      </span>
                      <span
                        className={`h-4 w-4 rounded-full border-2 ${
                          appearance === option.value
                            ? "border-[#3F72AF] bg-[#3F72AF] ring-2 ring-blue-100"
                            : "border-gray-300"
                        }`}
                      />
                    </div>
                    <p className="mt-2 text-xs text-[#6B7280]">
                      {option.description}
                    </p>
                  </button>
                ))}
              </div>

              {appearance === "dark" && (
                <p className="mt-3 text-xs text-amber-700">
                  Dark mode is a visual selection only; the dashboard theme is not connected yet.
                </p>
              )}
            </section>

            {/* Change Password */}
            <section className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-[#3F72AF]">
                  <LockKeyhole size={21} />
                </div>
                <div>
                  <h2 className="font-bold text-[#112D4E]">Change Password</h2>
                  <p className="mt-1 text-sm text-[#6B7280]">
                    Update your account password.
                  </p>
                </div>
              </div>

              <form onSubmit={handlePasswordSave} className="mt-6 space-y-4">
                {[
                  { key: "current" as const, label: "Current Password" },
                  { key: "new" as const, label: "New Password" },
                  { key: "confirm" as const, label: "Confirm New Password" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="mb-2 block text-sm font-medium text-[#4B5563]">
                      {field.label}
                    </label>
                    <div className="relative">
                      <input
                        required
                        type={showPassword ? "text" : "password"}
                        value={password[field.key]}
                        onChange={(e) =>
                          setPassword((current) => ({
                            ...current,
                            [field.key]: e.target.value,
                          }))
                        }
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        className="w-full rounded-xl border border-[#DBE2EF] bg-[#F9F7F7] px-4 py-3 pr-12 text-sm outline-none focus:border-[#3F72AF]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                ))}

                {passwordMessage && (
                  <p className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
                    {passwordMessage}
                  </p>
                )}

                <button
                  type="submit"
                  className="rounded-xl bg-[#112D4E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#172554]"
                >
                  Update Password
                </button>
              </form>
            </section>

            {/* Security */}
            <section className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
                  <ShieldCheck size={21} />
                </div>
                <div>
                  <h2 className="font-bold text-[#112D4E]">Account Security</h2>
                  <p className="mt-1 text-sm leading-6 text-[#6B7280]">
                    Your account permissions are assigned by the bank administrator.
                    Contact your administrator for role changes or account access issues.
                  </p>
                </div>
              </div>
              <div className="mt-5 rounded-xl bg-[#F9F7F7] p-4">
                <p className="text-sm font-semibold text-[#112D4E]">
                  Banking Staff Access
                </p>
                <p className="mt-1 text-xs leading-5 text-[#6B7280]">
                  Your access is limited to authorized staff operations.
                  Administrative approvals and bank-wide configuration remain restricted.
                </p>
              </div>
            </section>

            <div className="flex justify-end">
              <button
                onClick={() => setSaved(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-[#112D4E] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#172554]"
              >
                <Save size={17} />
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
