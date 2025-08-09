"use client";

import React, { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";

const LS_KEY = "app_settings_v1";
const LS_TINYMCE_KEY = "tiny_mce_api_key";

function useLocalSettings(defaults) {
  const [state, setState] = useState(() => {
    try {
      const raw = typeof window !== "undefined" && localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : defaults;
    } catch {
      return defaults;
    }
  });

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(LS_KEY, JSON.stringify(state));
      }
    } catch (e) {
      console.error("Failed to persist settings", e);
    }
  }, [state]);

  return [state, setState];
}

export default function SettingsPage() {
  const defaultSettings = {
    profile: {
      name: "Rahul",
      email: "rahul@example.com",
      avatar: null,
    },
    security: { twoFactor: false, passwordSet: true },
    notifications: { email: true, push: false },
    appearance: { theme: "system" },
    ui: { sidebarCollapsedByDefault: false },
    secureShare: { defaultExpiryMinutes: 60, requirePasswordByDefault: true },
    rooms: { privateByDefault: false },
    editor: {
      tinyMceApiKey:
        (typeof window !== "undefined" &&
          localStorage.getItem(LS_TINYMCE_KEY)) ||
        "",
    },
  };

  const [settings, setSettings] = useLocalSettings(defaultSettings);
  const [avatarFile, setAvatarFile] = useState(null);
  const avatarInputRef = useRef(null);

  const [sessions, setSessions] = useState([
    {
      id: "s1",
      device: "Chrome — Windows",
      ip: "203.0.113.4",
      lastActive: Date.now() - 1000 * 60 * 5,
    },
    {
      id: "s2",
      device: "Mobile Safari — iPhone",
      ip: "198.51.100.22",
      lastActive: Date.now() - 1000 * 60 * 60 * 24,
    },
  ]);

  const [editorKeyDraft, setEditorKeyDraft] = useState(
    settings.editor.tinyMceApiKey || ""
  );

  useEffect(() => {
    setEditorKeyDraft(settings.editor.tinyMceApiKey || "");
    // sync avatarFile from settings on mount
    setAvatarFile(settings.profile?.avatar || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveSection = (sectionName, newValues) => {
    setSettings((s) => ({
      ...s,
      [sectionName]: { ...s[sectionName], ...newValues },
    }));
    toast.success("Settings saved");
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    saveSection("profile", { ...settings.profile });
  };

  const handleAvatarChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarFile(reader.result);
      setSettings((s) => ({
        ...s,
        profile: { ...s.profile, avatar: reader.result },
      }));
      toast.success("Avatar updated (preview)");
    };
    reader.readAsDataURL(f);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    const current = e.target.currentPassword.value;
    const next = e.target.newPassword.value;
    const confirm = e.target.confirmPassword.value;
    if (!next || next.length < 6)
      return toast.error("New password must be at least 6 characters");
    if (next !== confirm) return toast.error("Passwords do not match");
    toast.success("Password changed (demo)");
    setSettings((s) => ({
      ...s,
      security: { ...s.security, passwordSet: true },
    }));
    e.target.reset();
  };

  const handleTwoFactorToggle = () => {
    setSettings((s) => ({
      ...s,
      security: { ...s.security, twoFactor: !s.security.twoFactor },
    }));
    toast.success(
      `Two-factor ${
        settings.security.twoFactor ? "disabled" : "enabled"
      } (demo)`
    );
  };

  const handleNotificationsSave = (e) => {
    e.preventDefault();
    const email = e.target.email.checked;
    const push = e.target.push.checked;
    saveSection("notifications", { email, push });
  };

  const handleAppearanceSave = (e) => {
    e.preventDefault();
    const theme = e.target.theme.value;
    saveSection("appearance", { theme });
  };

  const handleUiSave = (e) => {
    e.preventDefault();
    const sidebarCollapsedByDefault = e.target.sidebarCollapsed.checked;
    saveSection("ui", { sidebarCollapsedByDefault });
  };

  const handleSecureShareSave = (e) => {
    e.preventDefault();
    const defaultExpiryMinutes =
      Number(e.target.defaultExpiryMinutes.value) || 60;
    const requirePasswordByDefault = e.target.requirePasswordByDefault.checked;
    saveSection("secureShare", {
      defaultExpiryMinutes,
      requirePasswordByDefault,
    });
  };

  const handleRoomsSave = (e) => {
    e.preventDefault();
    const privateByDefault = e.target.privateByDefault.checked;
    saveSection("rooms", { privateByDefault });
  };

  const handleEditorSave = (e) => {
    e.preventDefault();
    try {
      if (typeof window !== "undefined")
        localStorage.setItem(LS_TINYMCE_KEY, editorKeyDraft || "");
    } catch (err) {
      console.error(err);
    }
    setSettings((s) => ({
      ...s,
      editor: { ...s.editor, tinyMceApiKey: editorKeyDraft || "" },
    }));
    toast.success("Editor settings saved (saved in localStorage)");
  };

  const handleSignOutSession = (sessionId) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    toast.success("Signed out session");
  };

  const handleSignOutAll = () => {
    setSessions([]);
    toast.success("Signed out all sessions");
  };

  const handleExportData = async () => {
    const data = { settings, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "account-export.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success("Export started");
  };

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const handleDeleteAccount = () => {
    if (deleteConfirmation !== "DELETE") {
      toast.error("Type DELETE to confirm");
      return;
    }
    if (typeof window !== "undefined") localStorage.clear();
    toast.success("Account deleted (demo) — local storage cleared");
    setTimeout(() => {
      window.location.href = "/";
    }, 800);
  };

  const timeAgo = (ts) => {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="p-4 lg:p-8 min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-sm text-gray-500">
              Manage account, security, and app preferences
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6 lg:col-span-1">
            <section className="bg-white rounded-xl p-4 shadow overflow-hidden">
              <h2 className="text-lg font-semibold mb-3">Profile</h2>
              <form onSubmit={handleProfileSave} className="space-y-3">
                <div className="flex gap-3 items-start">
                  <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {settings.profile.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={settings.profile.avatar}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400 text-xs">No avatar</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <label className="block text-sm font-medium text-gray-700">
                      Full name
                    </label>
                    <input
                      className="mt-1 block w-full border border-gray-200 rounded px-3 py-2"
                      value={settings.profile.name}
                      onChange={(e) =>
                        setSettings((s) => ({
                          ...s,
                          profile: { ...s.profile, name: e.target.value },
                        }))
                      }
                    />

                    <label className="block text-sm font-medium text-gray-700 mt-2">
                      Email
                    </label>
                    <input
                      className="mt-1 block w-full border border-gray-200 rounded px-3 py-2"
                      value={settings.profile.email}
                      onChange={(e) =>
                        setSettings((s) => ({
                          ...s,
                          profile: { ...s.profile, email: e.target.value },
                        }))
                      }
                    />

                    <div className="flex gap-2 items-center mt-3">
                      <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSettings((s) => ({
                            ...s,
                            profile: { ...s.profile, avatar: null },
                          }));
                          setAvatarFile(null);
                          if (avatarInputRef.current)
                            avatarInputRef.current.value = "";
                          toast("Avatar removed");
                        }}
                        className="px-3 py-1 text-sm rounded bg-red-50 text-red-600">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md bg-blue-600 text-white">
                    Save profile
                  </button>
                </div>
              </form>
            </section>

            <section className="bg-white rounded-xl p-4 shadow overflow-hidden">
              <h2 className="text-lg font-semibold mb-3">Security</h2>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">
                      Two-factor authentication
                    </div>
                    <div className="text-xs text-gray-500">
                      Add an extra layer of security
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={handleTwoFactorToggle}
                      className={`px-3 py-1 rounded ${
                        settings.security.twoFactor
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                      {settings.security.twoFactor ? "Enabled" : "Enable"}
                    </button>
                  </div>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-2">
                  <label className="text-sm font-medium">Change password</label>
                  <input
                    name="currentPassword"
                    type="password"
                    placeholder="Current password"
                    className="w-full border border-gray-200 rounded px-3 py-2"
                  />
                  <input
                    name="newPassword"
                    type="password"
                    placeholder="New password"
                    className="w-full border border-gray-200 rounded px-3 py-2"
                  />
                  <input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full border border-gray-200 rounded px-3 py-2"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-3 py-1 rounded bg-blue-600 text-white">
                      Change
                    </button>
                  </div>
                </form>
              </div>
            </section>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-xl p-4 shadow overflow-hidden">
              <h2 className="text-lg font-semibold mb-3">Notifications</h2>
              <form
                onSubmit={handleNotificationsSave}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="email"
                    checked={settings.notifications.email}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        notifications: {
                          ...s.notifications,
                          email: e.target.checked,
                        },
                      }))
                    }
                  />
                  <div>
                    <div className="font-medium">Email notifications</div>
                    <div className="text-xs text-gray-500">
                      Receive updates and activity via email
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="push"
                    checked={settings.notifications.push}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        notifications: {
                          ...s.notifications,
                          push: e.target.checked,
                        },
                      }))
                    }
                  />
                  <div>
                    <div className="font-medium">Push notifications</div>
                    <div className="text-xs text-gray-500">
                      Browser push for important events
                    </div>
                  </div>
                </label>

                <div className="sm:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-3 py-1 rounded bg-blue-600 text-white">
                    Save notifications
                  </button>
                </div>
              </form>
            </section>

            <section className="bg-white rounded-xl p-4 shadow overflow-hidden">
              <h2 className="text-lg font-semibold mb-3">Appearance & UI</h2>
              <form
                onSubmit={handleAppearanceSave}
                className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                <div>
                  <label className="text-sm font-medium">Theme</label>
                  <select
                    name="theme"
                    value={settings.appearance.theme}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        appearance: { ...s.appearance, theme: e.target.value },
                      }))
                    }
                    className="mt-1 block w-full border border-gray-200 rounded px-3 py-2">
                    <option value="system">System</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Sidebar behavior
                  </label>
                  <div className="mt-1">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="sidebarCollapsed"
                        checked={settings.ui.sidebarCollapsedByDefault}
                        onChange={(e) =>
                          setSettings((s) => ({
                            ...s,
                            ui: {
                              ...s.ui,
                              sidebarCollapsedByDefault: e.target.checked,
                            },
                          }))
                        }
                      />
                      <span className="text-sm">
                        Collapse sidebar by default
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex items-end justify-end">
                  <button
                    type="submit"
                    className="px-3 py-1 rounded bg-blue-600 text-white">
                    Save UI
                  </button>
                </div>
              </form>
            </section>

            <section className="bg-white rounded-xl p-4 shadow overflow-hidden">
              <h2 className="text-lg font-semibold mb-3">
                Secure Share Defaults
              </h2>
              <form
                onSubmit={handleSecureShareSave}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                <div>
                  <label className="text-sm font-medium">
                    Default expiry (minutes)
                  </label>
                  <input
                    name="defaultExpiryMinutes"
                    type="number"
                    value={settings.secureShare.defaultExpiryMinutes}
                    min={1}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        secureShare: {
                          ...s.secureShare,
                          defaultExpiryMinutes: Number(e.target.value) || 1,
                        },
                      }))
                    }
                    className="mt-1 block w-full border border-gray-200 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Require password by default
                  </label>
                  <div className="mt-1">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="requirePasswordByDefault"
                        checked={settings.secureShare.requirePasswordByDefault}
                        onChange={(e) =>
                          setSettings((s) => ({
                            ...s,
                            secureShare: {
                              ...s.secureShare,
                              requirePasswordByDefault: e.target.checked,
                            },
                          }))
                        }
                      />
                      <span className="text-sm">Require password</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-end justify-end">
                  <button
                    type="submit"
                    className="px-3 py-1 rounded bg-blue-600 text-white">
                    Save Secure Share
                  </button>
                </div>
              </form>
            </section>

            <section className="bg-white rounded-xl p-4 shadow overflow-hidden">
              <h2 className="text-lg font-semibold mb-3">Room Defaults</h2>
              <form
                onSubmit={handleRoomsSave}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                <div>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="privateByDefault"
                      checked={settings.rooms.privateByDefault}
                      onChange={(e) =>
                        setSettings((s) => ({
                          ...s,
                          rooms: {
                            ...s.rooms,
                            privateByDefault: e.target.checked,
                          },
                        }))
                      }
                    />
                    <span className="text-sm">
                      Make new rooms private by default
                    </span>
                  </label>
                </div>

                <div className="sm:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-3 py-1 rounded bg-blue-600 text-white">
                    Save Room Defaults
                  </button>
                </div>
              </form>
            </section>

            <section className="bg-white rounded-xl p-4 shadow overflow-hidden">
              <h2 className="text-lg font-semibold mb-3">Editor (TinyMCE)</h2>
              <form
                onSubmit={handleEditorSave}
                className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                <div>
                  <label className="text-sm font-medium">TinyMCE API Key</label>
                  <input
                    className="mt-1 block w-full border border-gray-200 rounded px-3 py-2"
                    value={editorKeyDraft}
                    onChange={(e) => setEditorKeyDraft(e.target.value)}
                    placeholder="Paste your TinyMCE key (NEXT_PUBLIC_TINY_MCE_API_KEY for dev)"
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    Saved in localStorage for this browser (demo).
                  </div>
                </div>

                <div className="flex items-end justify-end">
                  <button
                    type="submit"
                    className="px-3 py-1 rounded bg-blue-600 text-white">
                    Save Editor
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow overflow-hidden">
          <h3 className="text-lg font-semibold mb-3">Sessions & Account</h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <div className="space-y-2 mb-3">
                {sessions.length === 0 ? (
                  <div className="text-sm text-gray-500">
                    No active sessions
                  </div>
                ) : (
                  sessions.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="min-w-0">
                        <div className="font-medium truncate">{s.device}</div>
                        <div className="text-xs text-gray-500 truncate">
                          {s.ip} • {timeAgo(s.lastActive)}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSignOutSession(s.id)}
                          className="px-3 py-1 rounded bg-gray-100 text-sm">
                          Sign out
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={handleSignOutAll}
                  className="px-3 py-1 rounded bg-red-50 text-red-600">
                  Sign out everywhere
                </button>
                <button
                  onClick={() =>
                    toast.info("You will be notified for new logins (demo)")
                  }
                  className="px-3 py-1 rounded bg-gray-100">
                  Login alerts
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Export data</div>
                  <div className="text-xs text-gray-500">
                    Download a JSON copy of your settings
                  </div>
                </div>
                <div>
                  <button
                    onClick={handleExportData}
                    className="px-3 py-1 rounded bg-blue-600 text-white">
                    Export
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-red-600">Delete account</div>
                  <div className="text-xs text-gray-500">
                    This will remove your data (demo local only)
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => setDeleteModalOpen(true)}
                    className="px-3 py-1 rounded bg-red-50 text-red-600">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {deleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setDeleteModalOpen(false)}
            />
            <div className="relative max-w-lg w-full bg-white rounded-xl shadow-lg p-6 z-10 max-h-[90vh] overflow-auto">
              <h3 className="text-xl font-semibold mb-2 text-red-600">
                Delete account
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                This action is irreversible in production — for this demo it
                clears localStorage and redirects home. Type{" "}
                <strong>DELETE</strong> to confirm.
              </p>

              <input
                className="w-full border border-gray-200 rounded px-3 py-2 mb-4"
                placeholder="Type DELETE to confirm"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-4 py-2 rounded border">
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 rounded bg-red-600 text-white">
                  Delete account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
