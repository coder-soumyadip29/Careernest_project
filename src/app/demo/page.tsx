'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Bell,
  ChevronDown,
  LayoutDashboard,
  User,
  LogOut,
  Camera,
  Lock,
  Save,
} from 'lucide-react';

// ============================================
// RESPONSIVE NAVBAR COMPONENT (LIGHT THEME)
// ============================================

const navLinks = [
  { label: 'Home', href: '/demo' },
  { label: 'Services', href: '/demo#services' },
  { label: 'Contact', href: '/demo#contact' },
];

function LightNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('/demo');

  // Simulated authenticated state
  const isAuthenticated = true;
  const user = {
    name: 'Soumyadip Dey',
    avatar: null,
    initials: 'SD',
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/demo" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="font-bold text-xl text-slate-900 group-hover:text-blue-600 transition-colors">
              CarrierNest
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setActiveLink(link.href)}
                className={`relative text-sm font-semibold py-2 transition-colors ${
                  activeLink === link.href
                    ? 'text-blue-600'
                    : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                {link.label}
                {activeLink === link.href && (
                  <motion.span
                    layoutId="activeNavLink"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Side - Auth State */}
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <>
                {/* Notification Bell */}
                <button
                  type="button"
                  className="hidden sm:flex relative h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-blue-600 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
                </button>

                {/* User Avatar Dropdown */}
                <div className="relative hidden sm:block">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 rounded-full bg-slate-100 pl-1 pr-3 py-1 hover:bg-slate-200 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                      {user.initials}
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-500 transition-transform ${
                        dropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-48 rounded-xl bg-white border border-slate-200 shadow-lg py-2 z-50"
                      >
                        <div className="px-4 py-2 border-b border-slate-100">
                          <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                          <p className="text-xs text-slate-500">Web Developer Intern</p>
                        </div>
                        <Link
                          href="#dashboard"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Link>
                        <Link
                          href="#profile"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <User className="h-4 w-4" />
                          Profile
                        </Link>
                        <div className="border-t border-slate-100 mt-1 pt-1">
                          <button
                            type="button"
                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <LogOut className="h-4 w-4" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              type="button"
              aria-label="Toggle menu"
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-slate-200 bg-white"
          >
            <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    setActiveLink(link.href);
                    setMobileOpen(false);
                  }}
                  className={`py-3 px-4 rounded-xl text-sm font-semibold transition-colors ${
                    activeLink === link.href
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && (
                <>
                  <div className="border-t border-slate-100 my-2" />
                  <Link
                    href="#dashboard"
                    className="flex items-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    href="#profile"
                    className="flex items-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                  <button
                    type="button"
                    className="flex items-center gap-2 w-full py-3 px-4 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ============================================
// PROFILE PAGE COMPONENT (LIGHT THEME)
// ============================================

function ProfilePage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: 'Soumyadip Dey',
    email: 'soumyadip.dey@example.com',
    phone: '+91 98765 43210',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  const inputClassName =
    'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10';

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar with Camera Overlay */}
            <div className="relative">
              <div className="h-24 w-24 rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-200">
                {avatar ? (
                  <Image
                    src={avatar}
                    alt="User Avatar"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-3xl font-bold text-slate-400">
                    SD
                  </div>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-2 -right-2 h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
                aria-label="Upload profile image"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>

            {/* User Info */}
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-slate-900">Soumyadip Dey</h1>
              <p className="text-slate-500 mt-1">Web Developer Intern</p>
            </div>
          </div>
        </div>

        {/* Account Information Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Account Details</h2>
          </div>

          <form className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="fullName"
                className="block text-sm font-semibold text-slate-700"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                className={inputClassName}
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-700"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className={inputClassName}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="block text-sm font-semibold text-slate-700"
              >
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                className={inputClassName}
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Lock className="h-5 w-5 text-amber-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Change Password</h2>
          </div>

          <form className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="currentPassword"
                className="block text-sm font-semibold text-slate-700"
              >
                Current Password
              </label>
              <input
                id="currentPassword"
                type="password"
                className={inputClassName}
                placeholder="Enter current password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="newPassword"
                className="block text-sm font-semibold text-slate-700"
              >
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                className={inputClassName}
                placeholder="Enter new password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-slate-700"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className={inputClassName}
                placeholder="Confirm new password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 hover:border-slate-400 focus:ring-4 focus:ring-slate-200 transition-all duration-200"
            >
              <Lock className="h-4 w-4" />
              Update Password
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

// ============================================
// COMBINED PAGE EXPORT
// ============================================

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <LightNavbar />
      <ProfilePage />
    </div>
  );
}
