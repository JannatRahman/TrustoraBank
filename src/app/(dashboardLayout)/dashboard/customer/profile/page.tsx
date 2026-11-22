
"use client";

import { useState, type FormEvent } from "react";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
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
  Monitor,
  AlertCircle,
  Globe,
  CreditCard,
  Smartphone,
} from "lucide-react";

type Profile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  postalCode: string;
  occupation: string;
};

export default function CustomerProfilePage() {
  const [profile, setProfile] = useState<Profile>({
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@example.com",
    phone: "+880 1712-345678",
    dateOfBirth: "1998-05-14",
    address: "House 24, Road 7, Dhanmondi",
    city: "Dhaka",
    postalCode: "1205",
    occupation: "Software Engineer",
  });

  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [notifications, setNotifications] = useState({
    transactionAlerts: true,
    depositUpdates: true,
    withdrawalUpdates: true,
    loanUpdates: true,
    securityAlerts: true,
    promotionalEmails: false,
    monthlyStatements: true,
  });

  const [preferences, setPreferences] = useState({
    language: "English",
    currency: "BDT (৳)",
    theme: "Light",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const updateProfile = (field: keyof Profile, value: string) => {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const updateNotification = (
    field: keyof typeof notifications,
    checked: boolean
  ) => {
    setNotifications((previous) => ({
      ...previous,
      [field]: checked,
    }));
  };

  const handleProfileSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !profile.firstName.trim() ||
      !profile.lastName.trim() ||
      !profile.email.trim() ||
      !profile.phone.trim()
    ) {
      setErrorMessage("Please complete all required personal information.");
      return;
    }

    setErrorMessage("");
    setEditing(false);
    setSuccessMessage("Profile information updated successfully.");
  };

  const handlePasswordChange = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setErrorMessage("Please complete all password fields.");
      return;
    }

    if (passwords.new.length < 8) {
      setErrorMessage("Your new password must be at least 8 characters.");
      return;
    }

    if (passwords.new !== passwords.confirm) {
      setErrorMessage("New password and confirmation do not match.");
      return;
    }

    setPasswords({
      current: "",
      new: "",
      confirm: "",
    });

    setSuccessMessage("Demo password change completed.");
  };

  const showSuccess = (message: string) => {
    setErrorMessage("");
    setSuccessMessage(message);
  };

  return (
    <div className="min-h-screen bg-[#F9F7F7] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Header */}
        <div>
          <p className="mb-1 text-sm font-semibold uppercase tracking-[0.15em] text-[#3F72AF]">
            Customer Portal / Profile
          </p>

          <h1 className="text-2xl font-bold text-[#112D4E] sm:text-3xl">
            Profile & Settings
          </h1>

          <p className="mt-2 text-sm text-[#6B7280]">
            Manage your personal information, security, and banking preferences.
          </p>
        </div>

        {/* Profile Overview */}
        <section className="overflow-hidden rounded-2xl border border-[#DBE2EF] bg-white shadow-sm">
          <div className="h-28 bg-gradient-to-r from-[#112D4E] via-[#1D4168] to-[#3F72AF]" />

          <div className="px-5 pb-6 sm:px-7">
            <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-[#DBE2EF] text-3xl font-bold text-[#112D4E] shadow-sm">
                  {profile.firstName.charAt(0)}
                  {profile.lastName.charAt(0)}

                  <button
                    type="button"
                    onClick={() =>
                      showSuccess("Profile photo upload is a demo feature.")
                    }
                    aria-label="Upload profile photo"
                    className="absolute -bottom-2 -right-2 rounded-full border-2 border-white bg-[#3F72AF] p-2 text-white shadow-sm hover:bg-[#112D4E]"
                  >
                    <Camera size={14} />
                  </button>
                </div>

                <div className="pb-1">
                  <h2 className="text-xl font-bold text-[#112D4E]">
                    {profile.firstName} {profile.lastName}
                  </h2>
                  <p className="mt-1 text-sm text-[#6B7280]">
                    {profile.email}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                      Active Customer
                    </span>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-[#3F72AF]">
                      <ShieldCheck size={12} className="mr-1 inline" />
                      Verified Account
                    </span>
                  </div>
                </div>
              </div>

              <div className="pb-1">
                <p className="text-xs text-[#9CA3AF]">Customer ID</p>
                <p className="mt-1 font-semibold text-[#112D4E]">
                  CUS-2026-00125
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 xl:col-span-2">
            {/* Personal Information */}
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
                    <p className="mt-1 text-xs text-[#9CA3AF]">
                      Your personal and contact details
                    </p>
                  </div>
                </div>

                {!editing && (
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage("");
                      setEditing(true);
                    }}
                    className="rounded-lg border border-[#DBE2EF] px-4 py-2 text-xs font-semibold text-[#3F72AF] hover:bg-blue-50"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              <form onSubmit={handleProfileSave}>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <ProfileField
                    label="First Name"
                    icon={<UserRound size={16} />}
                    value={profile.firstName}
                    editing={editing}
                    onChange={(value) => updateProfile("firstName", value)}
                  />

                  <ProfileField
                    label="Last Name"
                    icon={<UserRound size={16} />}
                    value={profile.lastName}
                    editing={editing}
                    onChange={(value) => updateProfile("lastName", value)}
                  />

                  <ProfileField
                    label="Email Address"
                    icon={<Mail size={16} />}
                    value={profile.email}
                    editing={editing}
                    onChange={(value) => updateProfile("email", value)}
                    type="email"
                  />

                  <ProfileField
                    label="Phone Number"
                    icon={<Phone size={16} />}
                    value={profile.phone}
                    editing={editing}
                    onChange={(value) => updateProfile("phone", value)}
                  />

                  <ProfileField
                    label="Date of Birth"
                    icon={<CalendarDays size={16} />}
                    value={profile.dateOfBirth}
                    editing={editing}
                    onChange={(value) => updateProfile("dateOfBirth", value)}
                    type="date"
                  />

                  <ProfileField
                    label="Occupation"
                    icon={<BriefcaseIcon />}
                    value={profile.occupation}
                    editing={editing}
                    onChange={(value) => updateProfile("occupation", value)}
                  />

                  <div className="sm:col-span-2">
                    <ProfileField
                      label="Street Address"
                      icon={<MapPin size={16} />}
                      value={profile.address}
                      editing={editing}
                      onChange={(value) => updateProfile("address", value)}
                    />
                  </div>

                  <ProfileField
                    label="City"
                    icon={<Globe size={16} />}
                    value={profile.city}
                    editing={editing}
                    onChange={(value) => updateProfile("city", value)}
                  />

                  <ProfileField
                    label="Postal Code"
                    icon={<MapPin size={16} />}
                    value={profile.postalCode}
                    editing={editing}
                    onChange={(value) => updateProfile("postalCode", value)}
                  />
                </div>

                {errorMessage && editing && (
                  <p className="mt-5 rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600">
                    {errorMessage}
                  </p>
                )}

                {editing && (
                  <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setErrorMessage("");
                      }}
                      className="rounded-xl border border-[#DBE2EF] px-5 py-3 text-sm font-semibold text-[#6B7280] hover:bg-gray-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#112D4E] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1D4168]"
                    >
                      <Save size={16} />
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            </section>

            {/* Security */}
            <section className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-[#3F72AF]">
                  <Lock size={20} />
                </div>
                <div>
                  <h2 className="font-bold text-[#112D4E]">
                    Security & Password
                  </h2>
                  <p className="mt-1 text-xs text-[#9CA3AF]">
                    Keep your banking account secure
                  </p>
                </div>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <PasswordField
                  label="Current Password"
                  value={passwords.current}
                  visible={showPassword}
                  onChange={(value) =>
                    setPasswords((previous) => ({
                      ...previous,
                      current: value,
                    }))
                  }
                  onToggle={() => setShowPassword((previous) => !previous)}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <PasswordField
                    label="New Password"
                    value={passwords.new}
                    visible={showNewPassword}
                    onChange={(value) =>
                      setPasswords((previous) => ({
                        ...previous,
                        new: value,
                      }))
                    }
                    onToggle={() =>
                      setShowNewPassword((previous) => !previous)
                    }
                  />

                  <PasswordField
                    label="Confirm New Password"
                    value={passwords.confirm}
                    visible={showNewPassword}
                    onChange={(value) =>
                      setPasswords((previous) => ({
                        ...previous,
                        confirm: value,
                      }))
                    }
                    onToggle={() =>
                      setShowNewPassword((previous) => !previous)
                    }
                  />
                </div>

                <p className="text-xs text-[#9CA3AF]">
                  Use at least 8 characters for your new password.
                </p>

                {errorMessage && !editing && (
                  <p className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600">
                    {errorMessage}
                  </p>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#112D4E] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1D4168]"
                  >
                    <KeyRound size={16} />
                    Update Password
                  </button>
                </div>
              </form>

              <div className="mt-6 border-t border-[#DBE2EF] pt-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                      <ShieldCheck size={19} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#112D4E]">
                        Two-Factor Authentication
                      </p>
                      <p className="mt-1 text-xs text-[#9CA3AF]">
                        Add another layer of account security
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                    Not Enabled
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    showSuccess("Two-factor authentication setup is a demo feature.")
                  }
                  className="mt-4 w-full rounded-xl border border-[#DBE2EF] px-4 py-3 text-sm font-semibold text-[#3F72AF] hover:bg-blue-50"
                >
                  Enable Two-Factor Authentication
                </button>
              </div>
            </section>

            {/* Notification Preferences */}
            <section className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-[#3F72AF]">
                  <Bell size={20} />
                </div>
                <div>
                  <h2 className="font-bold text-[#112D4E]">
                    Notification Preferences
                  </h2>
                  <p className="mt-1 text-xs text-[#9CA3AF]">
                    Choose which notifications you want to receive
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <NotificationToggle
                  title="Transaction Alerts"
                  description="Receive alerts when money enters or leaves your account."
                  checked={notifications.transactionAlerts}
                  onChange={(checked) =>
                    updateNotification("transactionAlerts", checked)
                  }
                />

                <NotificationToggle
                  title="Deposit Updates"
                  description="Get updates about deposit requests and approvals."
                  checked={notifications.depositUpdates}
                  onChange={(checked) =>
                    updateNotification("depositUpdates", checked)
                  }
                />

                <NotificationToggle
                  title="Withdrawal Updates"
                  description="Get updates about withdrawal requests."
                  checked={notifications.withdrawalUpdates}
                  onChange={(checked) =>
                    updateNotification("withdrawalUpdates", checked)
                  }
                />

                <NotificationToggle
                  title="Loan Notifications"
                  description="Receive loan application and repayment reminders."
                  checked={notifications.loanUpdates}
                  onChange={(checked) =>
                    updateNotification("loanUpdates", checked)
                  }
                />

                <NotificationToggle
                  title="Security Alerts"
                  description="Important notifications about account security."
                  checked={notifications.securityAlerts}
                  onChange={(checked) =>
                    updateNotification("securityAlerts", checked)
                  }
                />

                <NotificationToggle
                  title="Monthly Statements"
                  description="Receive a monthly account statement reminder."
                  checked={notifications.monthlyStatements}
                  onChange={(checked) =>
                    updateNotification("monthlyStatements", checked)
                  }
                />

                <NotificationToggle
                  title="Promotional Emails"
                  description="Receive product announcements and special offers."
                  checked={notifications.promotionalEmails}
                  onChange={(checked) =>
                    updateNotification("promotionalEmails", checked)
                  }
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  showSuccess("Notification preferences saved in this demo.")
                }
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#112D4E] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1D4168]"
              >
                <Save size={16} />
                Save Notification Preferences
              </button>
            </section>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-6">
            {/* Banking Preferences */}
            <section className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-[#3F72AF]">
                  <Settings size={19} />
                </div>
                <div>
                  <h2 className="font-bold text-[#112D4E]">
                    Preferences
                  </h2>
                  <p className="mt-1 text-xs text-[#9CA3AF]">
                    Customize your portal
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <PreferenceSelect
                  label="Language"
                  value={preferences.language}
                  options={["English", "বাংলা"]}
                  onChange={(value) =>
                    setPreferences((previous) => ({
                      ...previous,
                      language: value,
                    }))
                  }
                />

                <PreferenceSelect
                  label="Currency"
                  value={preferences.currency}
                  options={["BDT (৳)", "USD ($)"]}
                  onChange={(value) =>
                    setPreferences((previous) => ({
                      ...previous,
                      currency: value,
                    }))
                  }
                />

                <PreferenceSelect
                  label="Appearance"
                  value={preferences.theme}
                  options={["Light", "Dark", "System"]}
                  onChange={(value) =>
                    setPreferences((previous) => ({
                      ...previous,
                      theme: value,
                    }))
                  }
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  showSuccess("Your demo preferences have been saved.")
                }
                className="mt-5 w-full rounded-xl border border-[#DBE2EF] px-4 py-3 text-sm font-semibold text-[#3F72AF] hover:bg-blue-50"
              >
                Save Preferences
              </button>
            </section>

            {/* Account Information */}
            <section className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-[#3F72AF]">
                  <CreditCard size={19} />
                </div>
                <div>
                  <h2 className="font-bold text-[#112D4E]">
                    Account Information
                  </h2>
                  <p className="mt-1 text-xs text-[#9CA3AF]">
                    Your banking profile
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <InfoRow label="Customer ID" value="CUS-2026-00125" />
                <InfoRow label="Customer Type" value="Individual" />
                <InfoRow label="Primary Account" value="TRS-1000-4521" />
                <InfoRow label="Account Type" value="Savings" />
                <InfoRow label="Branch" value="Dhanmondi Branch" />
                <InfoRow label="Member Since" value="March 2024" />
              </div>

              <div className="mt-5 flex items-start gap-2 rounded-xl bg-blue-50 p-3">
                <ShieldCheck
                  size={16}
                  className="mt-0.5 shrink-0 text-[#3F72AF]"
                />
                <p className="text-xs leading-5 text-[#4B5563]">
                  Your banking information is protected. Contact your branch
                  for changes to verified account details.
                </p>
              </div>
            </section>

            {/* Recent Activity */}
            <section className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-[#3F72AF]">
                  <Clock size={19} />
                </div>
                <div>
                  <h2 className="font-bold text-[#112D4E]">
                    Recent Activity
                  </h2>
                  <p className="mt-1 text-xs text-[#9CA3AF]">
                    Recent sign-in activity
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <ActivityItem
                  icon={<Monitor size={17} />}
                  title="Windows Desktop"
                  detail="Chrome · Dhaka, Bangladesh"
                  time="Today, 10:42 AM"
                  current
                />

                <ActivityItem
                  icon={<Smartphone size={17} />}
                  title="Mobile Device"
                  detail="Android · Dhaka, Bangladesh"
                  time="Yesterday, 8:15 PM"
                />

                <ActivityItem
                  icon={<Monitor size={17} />}
                  title="Windows Desktop"
                  detail="Chrome · Dhaka, Bangladesh"
                  time="Nov 18, 2026"
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  showSuccess("Full login activity is a demo feature.")
                }
                className="mt-5 w-full rounded-xl border border-[#DBE2EF] px-4 py-3 text-xs font-semibold text-[#3F72AF] hover:bg-blue-50"
              >
                View All Activity
              </button>
            </section>

            {/* Help */}
            <section className="rounded-2xl bg-[#112D4E] p-5 text-white">
              <div className="flex items-center gap-2">
                <AlertCircle size={19} />
                <h3 className="font-bold">Need Help?</h3>
              </div>
              <p className="mt-2 text-xs leading-5 text-blue-100">
                For account security concerns or personal information
                corrections, contact your nearest Trustora branch.
              </p>
              <button
                type="button"
                onClick={() =>
                  showSuccess("Customer support contact is a demo feature.")
                }
                className="mt-4 w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#112D4E] hover:bg-blue-50"
              >
                Contact Support
              </button>
            </section>
          </div>
        </div>

        <p className="pb-3 text-center text-xs text-[#9CA3AF]">
          Trustora Bank · Customer Portal · Illustrative demo data
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#112D4E]/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-7 text-center shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={30} />
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#112D4E]">
              Successful
            </h3>
            <p className="mt-2 text-sm text-[#6B7280]">
              {successMessage}
            </p>
            <button
              type="button"
              onClick={() => setSuccessMessage("")}
              className="mt-6 w-full rounded-xl bg-[#112D4E] px-4 py-3 text-sm font-semibold text-white"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function BriefcaseIcon() {
  return <CreditCard size={16} />;
}

function ProfileField({
  label,
  icon,
  value,
  editing,
  onChange,
  type = "text",
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  editing: boolean;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-[#6B7280]">
        {label}
      </label>

      {editing ? (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-xl border border-[#DBE2EF] bg-white px-4 py-3 text-sm text-[#112D4E] outline-none focus:border-[#3F72AF] focus:ring-2 focus:ring-blue-100"
        />
      ) : (
        <div className="flex items-center gap-3 rounded-xl bg-[#F9F7F7] px-4 py-3">
          <span className="text-[#3F72AF]">{icon}</span>
          <span className="break-all text-sm font-medium text-[#112D4E]">
            {value || "Not provided"}
          </span>
        </div>
      )}
    </div>
  );
}

function PasswordField({
  label,
  value,
  visible,
  onChange,
  onToggle,
}: {
  label: string;
  value: string;
  visible: boolean;
  onChange: (value: string) => void;
  onToggle: () => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-[#6B7280]">
        {label}
      </label>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Enter password"
          className="w-full rounded-xl border border-[#DBE2EF] bg-white px-4 py-3 pr-11 text-sm outline-none focus:border-[#3F72AF]"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#3F72AF]"
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </div>
  );
}

function NotificationToggle({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-[#112D4E]">{title}</p>
        <p className="mt-1 text-xs leading-5 text-[#9CA3AF]">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
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
    </div>
  );
}

function PreferenceSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-[#6B7280]">
        {label}
      </label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-[#DBE2EF] bg-white px-4 py-3 text-sm text-[#112D4E] outline-none focus:border-[#3F72AF]"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-[#F1F5F9] pb-3 last:border-0 last:pb-0">
      <span className="text-xs text-[#9CA3AF]">{label}</span>
      <span className="text-right text-xs font-semibold text-[#112D4E]">
        {value}
      </span>
    </div>
  );
}

function ActivityItem({
  icon,
  title,
  detail,
  time,
  current = false,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  time: string;
  current?: boolean;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#3F72AF]">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-semibold text-[#112D4E]">{title}</p>
          {current && (
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-700">
              Current
            </span>
          )}
        </div>
        <p className="mt-1 text-[11px] text-[#6B7280]">{detail}</p>
        <p className="mt-1 text-[10px] text-[#9CA3AF]">{time}</p>
      </div>
    </div>
  );
}
