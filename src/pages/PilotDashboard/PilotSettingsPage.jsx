/**
 * PilotSettingsPage — Full page view for route `/dashboard/pilot/settings`.
 *
 * Displays profile info, notification toggles, and security settings.
 * Feature: pilot-dashboard
 */

import { useState } from 'react';
import { mockData } from './mock-data.js';
import PilotDashboardShell from './shell/PilotDashboardShell.jsx';
import {
  Settings,
  User,
  Mail,
  Radio,
  Bell,
  Shield,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Activity,
} from 'lucide-react';
import './PilotSettingsPage.css';

function PilotSettingsPage() {
  const profile = mockData.pilot_profile;

  // Notification toggles state
  const [notifications, setNotifications] = useState({
    bidUpdates: true,
    projectMessages: true,
    paymentAlerts: true,
    systemUpdates: false,
    emailDigest: true,
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleToggle = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="pilot-settings-page">
      <PilotDashboardShell
        pilotProfile={mockData.pilot_profile}
        notifUnread={mockData.notifications.unread_count}
        activeMissionCount={mockData.proyek_berjalan.length}
      >
        {/* Page Header */}
        <div className="settings-page__header">
          <div className="settings-page__title-row">
            <Settings size={28} className="settings-page__icon" />
            <div>
              <h1 className="settings-page__title">Pengaturan</h1>
              <p className="settings-page__subtitle">Kelola profil, notifikasi, dan keamanan akun</p>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <section className="settings-section">
          <div className="settings-section__header">
            <User size={20} />
            <h2 className="settings-section__title">Informasi Profil</h2>
          </div>
          <div className="settings-section__content">
            <div className="settings-profile">
              <div className="settings-profile__avatar">
                <img
                  src={profile.avatar}
                  alt={profile.nama}
                  className="settings-profile__avatar-img"
                />
                {profile.is_verified && (
                  <span className="settings-profile__verified">
                    <CheckCircle2 size={16} />
                  </span>
                )}
              </div>
              <div className="settings-profile__fields">
                <div className="settings-field">
                  <label className="settings-field__label">
                    <User size={14} />
                    Nama
                  </label>
                  <div className="settings-field__value">{profile.nama}</div>
                </div>
                <div className="settings-field">
                  <label className="settings-field__label">
                    <Mail size={14} />
                    Email
                  </label>
                  <div className="settings-field__value">{profile.email}</div>
                </div>
                <div className="settings-field">
                  <label className="settings-field__label">
                    <Radio size={14} />
                    Tipe Drone
                  </label>
                  <div className="settings-field__value">{profile.drone_type}</div>
                </div>
                <div className="settings-field">
                  <label className="settings-field__label">
                    <Activity size={14} />
                    Status Ketersediaan
                  </label>
                  <div className="settings-field__value settings-field__value--status">
                    <span className="settings-availability-dot" />
                    {profile.availability_status}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Notification Section */}
        <section className="settings-section">
          <div className="settings-section__header">
            <Bell size={20} />
            <h2 className="settings-section__title">Notifikasi</h2>
          </div>
          <div className="settings-section__content">
            <div className="settings-toggles">
              <div className="settings-toggle">
                <div className="settings-toggle__info">
                  <span className="settings-toggle__label">Update Bid</span>
                  <span className="settings-toggle__desc">Notifikasi saat bid diterima atau ditolak</span>
                </div>
                <button
                  className={`settings-toggle__switch ${notifications.bidUpdates ? 'settings-toggle__switch--on' : ''}`}
                  onClick={() => handleToggle('bidUpdates')}
                  aria-label="Toggle bid updates"
                >
                  <span className="settings-toggle__knob" />
                </button>
              </div>
              <div className="settings-toggle">
                <div className="settings-toggle__info">
                  <span className="settings-toggle__label">Pesan Proyek</span>
                  <span className="settings-toggle__desc">Pesan dari client terkait proyek aktif</span>
                </div>
                <button
                  className={`settings-toggle__switch ${notifications.projectMessages ? 'settings-toggle__switch--on' : ''}`}
                  onClick={() => handleToggle('projectMessages')}
                  aria-label="Toggle project messages"
                >
                  <span className="settings-toggle__knob" />
                </button>
              </div>
              <div className="settings-toggle">
                <div className="settings-toggle__info">
                  <span className="settings-toggle__label">Alert Pembayaran</span>
                  <span className="settings-toggle__desc">Notifikasi pembayaran masuk dan escrow release</span>
                </div>
                <button
                  className={`settings-toggle__switch ${notifications.paymentAlerts ? 'settings-toggle__switch--on' : ''}`}
                  onClick={() => handleToggle('paymentAlerts')}
                  aria-label="Toggle payment alerts"
                >
                  <span className="settings-toggle__knob" />
                </button>
              </div>
              <div className="settings-toggle">
                <div className="settings-toggle__info">
                  <span className="settings-toggle__label">Update Sistem</span>
                  <span className="settings-toggle__desc">Pembaruan fitur dan maintenance platform</span>
                </div>
                <button
                  className={`settings-toggle__switch ${notifications.systemUpdates ? 'settings-toggle__switch--on' : ''}`}
                  onClick={() => handleToggle('systemUpdates')}
                  aria-label="Toggle system updates"
                >
                  <span className="settings-toggle__knob" />
                </button>
              </div>
              <div className="settings-toggle">
                <div className="settings-toggle__info">
                  <span className="settings-toggle__label">Email Digest</span>
                  <span className="settings-toggle__desc">Ringkasan mingguan aktivitas akun via email</span>
                </div>
                <button
                  className={`settings-toggle__switch ${notifications.emailDigest ? 'settings-toggle__switch--on' : ''}`}
                  onClick={() => handleToggle('emailDigest')}
                  aria-label="Toggle email digest"
                >
                  <span className="settings-toggle__knob" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="settings-section">
          <div className="settings-section__header">
            <Shield size={20} />
            <h2 className="settings-section__title">Keamanan</h2>
          </div>
          <div className="settings-section__content">
            <div className="settings-security">
              <h3 className="settings-security__subtitle">
                <Lock size={16} />
                Ubah Password
              </h3>
              <div className="settings-password-form">
                <div className="settings-password-field">
                  <label className="settings-password-field__label">Password Saat Ini</label>
                  <div className="settings-password-field__input-wrap">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      className="settings-password-field__input"
                      value={passwordForm.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      placeholder="Masukkan password saat ini"
                    />
                    <button
                      type="button"
                      className="settings-password-field__toggle"
                      onClick={() => togglePasswordVisibility('current')}
                      aria-label="Toggle password visibility"
                    >
                      {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="settings-password-field">
                  <label className="settings-password-field__label">Password Baru</label>
                  <div className="settings-password-field__input-wrap">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      className="settings-password-field__input"
                      value={passwordForm.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      placeholder="Masukkan password baru"
                    />
                    <button
                      type="button"
                      className="settings-password-field__toggle"
                      onClick={() => togglePasswordVisibility('new')}
                      aria-label="Toggle password visibility"
                    >
                      {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="settings-password-field">
                  <label className="settings-password-field__label">Konfirmasi Password Baru</label>
                  <div className="settings-password-field__input-wrap">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      className="settings-password-field__input"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      placeholder="Ulangi password baru"
                    />
                    <button
                      type="button"
                      className="settings-password-field__toggle"
                      onClick={() => togglePasswordVisibility('confirm')}
                      aria-label="Toggle password visibility"
                    >
                      {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <button className="settings-password-form__submit" type="button">
                  Simpan Password
                </button>
              </div>
            </div>
          </div>
        </section>
      </PilotDashboardShell>
    </div>
  );
}

export default PilotSettingsPage;
