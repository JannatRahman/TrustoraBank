
"use client";

import { useState, type FormEvent } from "react";
import {
  UserRound,
  Mail,
  Phone,
  ShieldCheck,
  Lock,
  Bell,
  Camera,
  Save,
  Eye,
  EyeOff,
  CheckCircle2,
  Settings,
  KeyRound,
  Clock,
  Globe,
  Monitor,
  AlertCircle,
} from "lucide-react";

type Tab = "profile" | "security" | "notifications";

// Toggle component declared outside AdminProfilePage
function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
        checked ? "bg-[#3F72AF]" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
          checked ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}

function Building2Icon() {
  return <Globe size={18} />;
}

function FileIcon() {
  return <Clock size={18} />;
}

export default function AdminProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@trustora.com",
    phone: "+880 1700-000000",
    designation: "System Administrator",
    department: "Administration",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [notifications, setNotifications] = useState({
    loanApplications: true,
    suspiciousActivity: true,
    accountUpdates: true,
    systemAlerts: true,
    emailNotifications: true,
  });

  const [security, setSecurity] = useState({
    twoFactor: true,
    loginAlerts: true,
    sessionAlerts: true,
  });

  const [notice, setNotice] = useState("");

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  };

  const handleProfileSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    showNotice("Profile updated successfully in this demo.");
  };

  const handlePasswordChange = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!passwords.current || !passwords.new || !passwords.confirm) {
      showNotice("Please complete all password fields.");
      return;
    }

    if (passwords.new.length < 8) {
      showNotice("New password must contain at least 8 characters.");
      return;
    }

    if (passwords.new !== passwords.confirm) {
      showNotice("New password and confirmation do not match.");
      return;
    }

    setPasswords({ current: "", new: "", confirm: "" });
    showNotice("Password updated in this demo.");
  };

  const togglePasswordVisibility = (
    field: keyof typeof showPasswords
  ) => {
    setShowPasswords((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));
  };

  const toggleNotification = (
    key: keyof typeof notifications
  ) => {
    setNotifications((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  };

  const toggleSecurity = (key: keyof typeof security) => {
    setSecurity((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  };

  const inputClass =
    "h-12 w-full rounded-xl border border-[#DBE2EF] bg-white px-4 text-sm text-[#112D4E] outline-none transition focus:border-[#3F72AF]";

  const tabs: { id: Tab; label: string; icon: typeof UserRound }[] = [
    { id: "profile", label: "Profile Information", icon: UserRound },
    { id: "security", label: "Security", icon: ShieldCheck },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-[#F9F7F7] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-7">

        {/* Header */}
        <div>
          <p className="mb-1 text-sm font-semibold uppercase tracking-[0.15em] text-[#3F72AF]">
            Administration / Profile & Settings
          </p>

          <h1 className="text-2xl font-bold text-[#112D4E] sm:text-3xl">
            Profile & Settings
          </h1>

          <p className="mt-2 text-sm text-[#6B7280]">
            Manage your administrator profile, security, and preferences.
          </p>
        </div>

        {/* Success Notice */}
        {notice && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            <CheckCircle2 size={18} />
            {notice}
          </div>
        )}

        {/* Profile Overview */}
        <section className="overflow-hidden rounded-2xl border border-[#DBE2EF] bg-white shadow-sm">
          <div className="h-28 bg-gradient-to-r from-[#112D4E] via-[#1D4168] to-[#3F72AF]" />

          <div className="px-5 pb-6 sm:px-7">
            <div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-[#DBE2EF] text-[#112D4E] shadow-sm">
                  <UserRound size={35} />
                </div>

                <div className="pb-1">
                  <h2 className="text-lg font-bold text-[#112D4E]">
                    {profile.name}
                  </h2>
                  <p className="mt-0.5 text-sm text-[#6B7280]">
                    {profile.designation}
                  </p>
                </div>
              </div>

              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                <ShieldCheck size={15} />
                Administrator Account
              </span>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 border-t border-[#DBE2EF] pt-5 sm:grid-cols-3">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2.5 text-[#3F72AF]">
                  <Mail size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-[#9CA3AF]">Email Address</p>
                  <p className="break-all text-sm font-medium text-[#112D4E]">
                    {profile.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2.5 text-[#3F72AF]">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-xs text-[#9CA3AF]">Phone Number</p>
                  <p className="text-sm font-medium text-[#112D4E]">
                    {profile.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2.5 text-[#3F72AF]">
                  <Building2Icon />
                </div>
                <div>
                  <p className="text-xs text-[#9CA3AF]">Department</p>
                  <p className="text-sm font-medium text-[#112D4E]">
                    {profile.department}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Settings Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">

          {/* Sidebar Tabs */}
          <aside className="h-fit rounded-2xl border border-[#DBE2EF] bg-white p-3 shadow-sm">
            <p className="px-3 pb-3 pt-2 text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
              Account Settings
            </p>

            <div className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
                      isActive
                        ? "bg-[#112D4E] text-white"
                        : "text-[#6B7280] hover:bg-[#F9F7F7] hover:text-[#112D4E]"
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Main Content */}
          <main className="min-w-0 rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm sm:p-7">

            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-[#112D4E]">
                    Profile Information
                  </h2>
                  <p className="mt-1 text-sm text-[#6B7280]">
                    Update your personal and administrator information.
                  </p>
                </div>

                <div className="mb-7 flex items-center gap-4 rounded-xl bg-[#F9FAFB] p-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#DBE2EF] text-[#112D4E]">
                    <UserRound size={26} />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#112D4E]">
                      Profile Picture
                    </p>
                    <p className="mt-1 text-xs text-[#9CA3AF]">
                      Profile photo upload will be connected later.
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled
                    className="flex cursor-not-allowed items-center gap-2 rounded-lg border border-[#DBE2EF] bg-white px-3 py-2 text-xs font-semibold text-[#9CA3AF]"
                  >
                    <Camera size={15} />
                    Upload
                  </button>
                </div>

                <form onSubmit={handleProfileSave} className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#112D4E]">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) =>
                          setProfile({ ...profile, name: e.target.value })
                        }
                        required
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#112D4E]">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) =>
                          setProfile({ ...profile, email: e.target.value })
                        }
                        required
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#112D4E]">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) =>
                          setProfile({ ...profile, phone: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#112D4E]">
                        Designation
                      </label>
                      <input
                        type="text"
                        value={profile.designation}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            designation: e.target.value,
                          })
                        }
                        className={inputClass}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-semibold text-[#112D4E]">
                        Department
                      </label>
                      <input
                        type="text"
                        value={profile.department}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            department: e.target.value,
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end border-t border-[#DBE2EF] pt-5">
                    <button
                      type="submit"
                      className="flex items-center gap-2 rounded-xl bg-[#112D4E] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4168]"
                    >
                      <Save size={17} />
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === "security" && (
              <div className="space-y-7">
                <div>
                  <h2 className="text-lg font-bold text-[#112D4E]">
                    Security Settings
                  </h2>
                  <p className="mt-1 text-sm text-[#6B7280]">
                    Manage your password and account security preferences.
                  </p>
                </div>

                {/* Password Form */}
                <section>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-lg bg-blue-50 p-2.5 text-[#3F72AF]">
                      <KeyRound size={19} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#112D4E]">
                        Change Password
                      </h3>
                      <p className="text-xs text-[#9CA3AF]">
                        Choose a strong password for your account.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    {(
                      [
                        ["current", "Current Password"],
                        ["new", "New Password"],
                        ["confirm", "Confirm New Password"],
                      ] as const
                    ).map(([field, label]) => (
                      <div key={field}>
                        <label className="mb-2 block text-sm font-semibold text-[#112D4E]">
                          {label}
                        </label>

                        <div className="relative">
                          <input
                            type={showPasswords[field] ? "text" : "password"}
                            value={passwords[field]}
                            onChange={(e) =>
                              setPasswords({
                                ...passwords,
                                [field]: e.target.value,
                              })
                            }
                            required
                            minLength={field === "current" ? undefined : 8}
                            placeholder={`Enter ${label.toLowerCase()}`}
                            className={`${inputClass} pr-12`}
                          />

                          <button
                            type="button"
                            onClick={() =>
                              togglePasswordVisibility(field)
                            }
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#112D4E]"
                            aria-label={`Toggle ${label}`}
                          >
                            {showPasswords[field] ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}

                    <button
                      type="submit"
                      className="flex items-center gap-2 rounded-xl bg-[#112D4E] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4168]"
                    >
                      <Lock size={16} />
                      Update Password
                    </button>
                  </form>
                </section>

                <div className="border-t border-[#DBE2EF]" />

                {/* Security Preferences */}
                <section>
                  <h3 className="mb-4 text-sm font-bold text-[#112D4E]">
                    Security Preferences
                  </h3>

                  <div className="space-y-5">
                    {[
                      {
                        key: "twoFactor" as const,
                        title: "Two-Factor Authentication",
                        description:
                          "Require an additional verification step when signing in.",
                      },
                      {
                        key: "loginAlerts" as const,
                        title: "Login Alerts",
                        description:
                          "Receive alerts when a new login is detected.",
                      },
                      {
                        key: "sessionAlerts" as const,
                        title: "Session Notifications",
                        description:
                          "Receive notifications about account session activity.",
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between gap-4"
                      >
                        <div>
                          <p className="text-sm font-semibold text-[#112D4E]">
                            {item.title}
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-[#6B7280]">
                            {item.description}
                          </p>
                        </div>

                        <Toggle
                          checked={security[item.key]}
                          onChange={() => toggleSecurity(item.key)}
                        />
                      </div>
                    ))}
                  </div>
                </section>

                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-start gap-2 text-amber-800">
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold">
                        Security Demonstration
                      </p>
                      <p className="mt-1 text-xs leading-relaxed">
                        These controls currently update the interface only.
                        Actual password changes and two-factor authentication
                        must be implemented securely on the server.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === "notifications" && (
              <div>
                <div className="mb-7">
                  <h2 className="text-lg font-bold text-[#112D4E]">
                    Notification Preferences
                  </h2>
                  <p className="mt-1 text-sm text-[#6B7280]">
                    Choose which administrative updates you want to receive.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
                      Administrative Notifications
                    </h3>

                    <div className="space-y-5">
                      {[
                        {
                          key: "loanApplications" as const,
                          title: "Loan Applications",
                          description:
                            "Updates about new and pending loan applications.",
                          icon: FileIcon,
                        },
                        {
                          key: "suspiciousActivity" as const,
                          title: "Suspicious Activity",
                          description:
                            "Alerts about suspicious transactions and account activity.",
                          icon: ShieldCheck,
                        },
                        {
                          key: "accountUpdates" as const,
                          title: "Account Updates",
                          description:
                            "Notifications about customer and bank account changes.",
                          icon: UserRound,
                        },
                        {
                          key: "systemAlerts" as const,
                          title: "System Alerts",
                          description:
                            "Important system announcements and administrative updates.",
                          icon: Settings,
                        },
                      ].map((item) => {
                        const Icon = item.icon;

                        return (
                          <div
                            key={item.key}
                            className="flex items-center justify-between gap-4"
                          >
                            <div className="flex items-start gap-3">
                              <div className="rounded-lg bg-blue-50 p-2.5 text-[#3F72AF]">
                                <Icon size={18} />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-[#112D4E]">
                                  {item.title}
                                </p>
                                <p className="mt-1 text-xs leading-relaxed text-[#6B7280]">
                                  {item.description}
                                </p>
                              </div>
                            </div>

                            <Toggle
                              checked={notifications[item.key]}
                              onChange={() => toggleNotification(item.key)}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border-t border-[#DBE2EF] pt-6">
                    <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
                      Delivery Preferences
                    </h3>

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-blue-50 p-2.5 text-[#3F72AF]">
                          <Mail size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#112D4E]">
                            Email Notifications
                          </p>
                          <p className="mt-1 text-xs text-[#6B7280]">
                            Receive administrative updates through email.
                          </p>
                        </div>
                      </div>

                      <Toggle
                        checked={notifications.emailNotifications}
                        onChange={() =>
                          toggleNotification("emailNotifications")
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-7 flex justify-end border-t border-[#DBE2EF] pt-5">
                  <button
                    type="button"
                    onClick={() =>
                      showNotice("Notification preferences updated in this demo.")
                    }
                    className="flex items-center gap-2 rounded-xl bg-[#112D4E] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4168]"
                  >
                    <Save size={17} />
                    Save Preferences
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Account Information */}
        <section className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-bold text-[#112D4E]">
            Account Information
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2.5 text-[#3F72AF]">
                <ShieldCheck size={19} />
              </div>
              <div>
                <p className="text-xs text-[#9CA3AF]">Account Role</p>
                <p className="mt-1 text-sm font-semibold text-[#112D4E]">
                  Administrator
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2.5 text-[#3F72AF]">
                <Clock size={19} />
              </div>
              <div>
                <p className="text-xs text-[#9CA3AF]">Last Login</p>
                <p className="mt-1 text-sm font-semibold text-[#112D4E]">
                  22 Nov 2026, 09:30 AM
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2.5 text-[#3F72AF]">
                <Monitor size={19} />
              </div>
              <div>
                <p className="text-xs text-[#9CA3AF]">Account Status</p>
                <p className="mt-1 text-sm font-semibold text-emerald-600">
                  Active
                </p>
              </div>
            </div>
          </div>
        </section>

        <p className="pb-3 text-center text-xs text-[#9CA3AF]">
          Trustora Bank · Administrator Portal · Demo interface
        </p>
      </div>
    </div>
  );
}
