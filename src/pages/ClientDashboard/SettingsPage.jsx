/**
 * SettingsPage — Client Account Settings
 *
 * Route: /dashboard/client/settings
 * Role: client only
 *
 * Premium settings page with tabbed sections:
 * - Profil Perusahaan
 * - Notifikasi
 * - Keamanan
 * - Preferensi Platform
 */

import { useState, useCallback } from 'react';
import {
  Settings,
  Building2,
  Bell,
  Shield,
  Palette,
  Save,
  Camera,
  Mail,
  Phone,
  MapPin,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Check,
  Clock,
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { mockData } from './mock-data.js';
import { selectCompanyByEmail } from './utils/selectors.js';
import DashboardShell from './shell/DashboardShell';
import './SettingsPage.css';

const TABS = [
  { id: 'profile', label: 'Profil', icon: Building2 },
  { id: 'notifications', label: 'Notifikasi', icon: Bell },
  { id: 'security', label: 'Keamanan', icon: Shield },
  { id: 'preferences', label: 'Preferensi', icon: Palette },
];

export default function SettingsPage() {
  const { session } = useAuth();
  const company = selectCompanyByEmail(mockData, session?.email);
  const companyName = company.nama || session?.email || 'Client';

  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form states (demo — not persisted)
  const [profile, setProfile] = useState({
    companyName: companyName,
    email: session?.email || 'hendra@pln.co.id',
    phone: '+62 812-3456-7890',
    address: 'Jl. Trunojoyo No. 135, Bandung, Jawa Barat',
    website: 'www.pln.co.id',
    industry: 'Energi & Kelistrikan',
  });

  const [notifications, setNotifications] = useState({
    emailBidNew: true,
    emailProjectUpdate: true,
    emailReportReady: true,
    emailNewsletter: false,
    pushBidNew: true,
    pushProjectUpdate: true,
    pushReportReady: false,
    pushPromo: false,
  });

  const [preferences, setPreferences] = useState({
    language: 'id',
    timezone: 'Asia/Jakarta',
    currency: 'IDR',
    mapStyle: 'dark',
    autoAssign: false,
  });

  const handleSave = useCallback(() => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }, []);

  const handleProfileChange = useCallback((field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleNotifToggle = useCallback((field) => {
    setNotifications((prev) => ({ ...prev, [field]: !prev[field] }));
  }, []);

  const handlePrefChange = useCallback((field, value) => {
    setPreferences((prev) => ({ ...prev, [field]: value }));
  }, []);

  return (
    <DashboardShell
      session={session}
      mockData={mockData}
      companyName={companyName}
      notifUnread={mockData.notifications.unread_count}
    >
      <div className="settings-page">
        {/* Header */}
        <div className="settings-page__header">
          <div className="settings-page__header-text">
            <h1 className="settings-page__title">
              <Settings size={22} />
              Pengaturan
            </h1>
            <p className="settings-page__subtitle">
              Kelola profil, notifikasi, dan preferensi akun Anda
            </p>
          </div>
          <button
            type="button"
            className={`settings-page__save-btn ${saved ? 'settings-page__save-btn--saved' : ''}`}
            onClick={handleSave}
          >
            {saved ? <Check size={16} /> : <Save size={16} />}
            <span>{saved ? 'Tersimpan!' : 'Simpan Perubahan'}</span>
          </button>
        </div>

        {/* Layout: Tabs + Content */}
        <div className="settings-page__layout">
          {/* Tab Navigation */}
          <nav className="settings-tabs" aria-label="Pengaturan">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`settings-tab ${activeTab === tab.id ? 'settings-tab--active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Tab Content */}
          <div className="settings-content">
            {activeTab === 'profile' && (
              <div className="settings-section">
                <h2 className="settings-section__title">Profil Perusahaan</h2>
                <p className="settings-section__desc">
                  Informasi perusahaan yang ditampilkan kepada pilot dan partner
                </p>

                {/* Avatar */}
                <div className="settings-avatar">
                  <div className="settings-avatar__img">
                    <img src="/images/avatars/avatar-engineer.png" alt="Company" />
                  </div>
                  <div className="settings-avatar__info">
                    <span className="settings-avatar__name">{profile.companyName}</span>
                    <button type="button" className="settings-avatar__change">
                      <Camera size={14} />
                      Ganti Foto
                    </button>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="settings-form">
                  <div className="settings-field">
                    <label className="settings-field__label">
                      <Building2 size={14} />
                      Nama Perusahaan
                    </label>
                    <input
                      type="text"
                      value={profile.companyName}
                      onChange={(e) => handleProfileChange('companyName', e.target.value)}
                      className="settings-field__input"
                    />
                  </div>

                  <div className="settings-field">
                    <label className="settings-field__label">
                      <Mail size={14} />
                      Email
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      className="settings-field__input"
                    />
                  </div>

                  <div className="settings-field">
                    <label className="settings-field__label">
                      <Phone size={14} />
                      Telepon
                    </label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => handleProfileChange('phone', e.target.value)}
                      className="settings-field__input"
                    />
                  </div>

                  <div className="settings-field settings-field--full">
                    <label className="settings-field__label">
                      <MapPin size={14} />
                      Alamat
                    </label>
                    <input
                      type="text"
                      value={profile.address}
                      onChange={(e) => handleProfileChange('address', e.target.value)}
                      className="settings-field__input"
                    />
                  </div>

                  <div className="settings-field">
                    <label className="settings-field__label">
                      <Globe size={14} />
                      Website
                    </label>
                    <input
                      type="url"
                      value={profile.website}
                      onChange={(e) => handleProfileChange('website', e.target.value)}
                      className="settings-field__input"
                    />
                  </div>

                  <div className="settings-field">
                    <label className="settings-field__label">
                      <Building2 size={14} />
                      Industri
                    </label>
                    <input
                      type="text"
                      value={profile.industry}
                      onChange={(e) => handleProfileChange('industry', e.target.value)}
                      className="settings-field__input"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="settings-section">
                <h2 className="settings-section__title">Notifikasi</h2>
                <p className="settings-section__desc">
                  Atur bagaimana Anda ingin menerima pemberitahuan dari SIAGA
                </p>

                <div className="settings-notif-group">
                  <h3 className="settings-notif-group__title">
                    <Mail size={16} />
                    Email
                  </h3>
                  <div className="settings-toggles">
                    <ToggleRow
                      label="Penawaran baru masuk"
                      desc="Notifikasi saat pilot mengajukan bid"
                      checked={notifications.emailBidNew}
                      onChange={() => handleNotifToggle('emailBidNew')}
                    />
                    <ToggleRow
                      label="Update proyek"
                      desc="Perubahan status dan milestone proyek"
                      checked={notifications.emailProjectUpdate}
                      onChange={() => handleNotifToggle('emailProjectUpdate')}
                    />
                    <ToggleRow
                      label="Laporan siap"
                      desc="Notifikasi saat laporan inspeksi selesai"
                      checked={notifications.emailReportReady}
                      onChange={() => handleNotifToggle('emailReportReady')}
                    />
                    <ToggleRow
                      label="Newsletter & tips"
                      desc="Update fitur baru dan tips inspeksi"
                      checked={notifications.emailNewsletter}
                      onChange={() => handleNotifToggle('emailNewsletter')}
                    />
                  </div>
                </div>

                <div className="settings-notif-group">
                  <h3 className="settings-notif-group__title">
                    <Bell size={16} />
                    Push Notification
                  </h3>
                  <div className="settings-toggles">
                    <ToggleRow
                      label="Penawaran baru"
                      desc="Push saat ada bid masuk"
                      checked={notifications.pushBidNew}
                      onChange={() => handleNotifToggle('pushBidNew')}
                    />
                    <ToggleRow
                      label="Update proyek"
                      desc="Push untuk perubahan status"
                      checked={notifications.pushProjectUpdate}
                      onChange={() => handleNotifToggle('pushProjectUpdate')}
                    />
                    <ToggleRow
                      label="Laporan siap"
                      desc="Push saat report bisa diunduh"
                      checked={notifications.pushReportReady}
                      onChange={() => handleNotifToggle('pushReportReady')}
                    />
                    <ToggleRow
                      label="Promo & event"
                      desc="Informasi promo dan event SIAGA"
                      checked={notifications.pushPromo}
                      onChange={() => handleNotifToggle('pushPromo')}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="settings-section">
                <h2 className="settings-section__title">Keamanan</h2>
                <p className="settings-section__desc">
                  Kelola password dan keamanan akun Anda
                </p>

                <div className="settings-form">
                  <div className="settings-field settings-field--full">
                    <label className="settings-field__label">
                      <Lock size={14} />
                      Password Saat Ini
                    </label>
                    <div className="settings-field__password-wrap">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Masukkan password saat ini"
                        className="settings-field__input"
                      />
                      <button
                        type="button"
                        className="settings-field__eye"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Sembunyikan' : 'Tampilkan'}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="settings-field settings-field--full">
                    <label className="settings-field__label">
                      <Lock size={14} />
                      Password Baru
                    </label>
                    <input
                      type="password"
                      placeholder="Minimal 8 karakter"
                      className="settings-field__input"
                    />
                  </div>

                  <div className="settings-field settings-field--full">
                    <label className="settings-field__label">
                      <Lock size={14} />
                      Konfirmasi Password Baru
                    </label>
                    <input
                      type="password"
                      placeholder="Ulangi password baru"
                      className="settings-field__input"
                    />
                  </div>
                </div>

                <div className="settings-security-info">
                  <div className="settings-security-card">
                    <Shield size={20} className="settings-security-card__icon" />
                    <div>
                      <span className="settings-security-card__title">Two-Factor Authentication</span>
                      <span className="settings-security-card__desc">Tambahkan lapisan keamanan ekstra</span>
                    </div>
                    <span className="settings-security-card__badge">Coming Soon</span>
                  </div>
                  <div className="settings-security-card">
                    <Globe size={20} className="settings-security-card__icon" />
                    <div>
                      <span className="settings-security-card__title">Login Sessions</span>
                      <span className="settings-security-card__desc">1 sesi aktif saat ini</span>
                    </div>
                    <span className="settings-security-card__badge settings-security-card__badge--active">Aktif</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="settings-section">
                <h2 className="settings-section__title">Preferensi Platform</h2>
                <p className="settings-section__desc">
                  Sesuaikan tampilan dan perilaku platform
                </p>

                <div className="settings-form">
                  <div className="settings-field">
                    <label className="settings-field__label">
                      <Globe size={14} />
                      Bahasa
                    </label>
                    <select
                      value={preferences.language}
                      onChange={(e) => handlePrefChange('language', e.target.value)}
                      className="settings-field__select"
                    >
                      <option value="id">Bahasa Indonesia</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  <div className="settings-field">
                    <label className="settings-field__label">
                      <Clock size={14} />
                      Timezone
                    </label>
                    <select
                      value={preferences.timezone}
                      onChange={(e) => handlePrefChange('timezone', e.target.value)}
                      className="settings-field__select"
                    >
                      <option value="Asia/Jakarta">WIB (UTC+7)</option>
                      <option value="Asia/Makassar">WITA (UTC+8)</option>
                      <option value="Asia/Jayapura">WIT (UTC+9)</option>
                    </select>
                  </div>

                  <div className="settings-field">
                    <label className="settings-field__label">
                      <Palette size={14} />
                      Map Style
                    </label>
                    <select
                      value={preferences.mapStyle}
                      onChange={(e) => handlePrefChange('mapStyle', e.target.value)}
                      className="settings-field__select"
                    >
                      <option value="dark">Dark (Default)</option>
                      <option value="satellite">Satellite</option>
                      <option value="light">Light</option>
                    </select>
                  </div>

                  <div className="settings-field">
                    <label className="settings-field__label">
                      <Building2 size={14} />
                      Mata Uang
                    </label>
                    <select
                      value={preferences.currency}
                      onChange={(e) => handlePrefChange('currency', e.target.value)}
                      className="settings-field__select"
                    >
                      <option value="IDR">IDR (Rupiah)</option>
                      <option value="USD">USD (Dollar)</option>
                    </select>
                  </div>
                </div>

                <div className="settings-toggles" style={{ marginTop: '1.5rem' }}>
                  <ToggleRow
                    label="Auto-assign pilot"
                    desc="Otomatis pilih pilot dengan rating tertinggi saat deadline dekat"
                    checked={preferences.autoAssign}
                    onChange={() => handlePrefChange('autoAssign', !preferences.autoAssign)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

/* Toggle Row Component */
function ToggleRow({ label, desc, checked, onChange }) {
  return (
    <div className="toggle-row">
      <div className="toggle-row__text">
        <span className="toggle-row__label">{label}</span>
        <span className="toggle-row__desc">{desc}</span>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={`toggle-switch ${checked ? 'toggle-switch--on' : ''}`}
        onClick={onChange}
      >
        <span className="toggle-switch__thumb" />
      </button>
    </div>
  );
}
