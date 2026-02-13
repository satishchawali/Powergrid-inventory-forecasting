import { useState, useEffect } from "react";
import "./SettingsPage.css";
import { getUserProfile, updateUserProfile, changePassword } from "../../services/api";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");

    useEffect(() => {
        document.title = "Settings - Forecasting System";
    }, []);

    return (
        <div className="settings-container">
            {/* Page Header */}
            <div className="settings-header">
                <h1>Settings</h1>
                <p>Manage your account settings and preferences</p>
            </div>

            {/* Tabs */}
            <div className="settings-tabs">
                <button
                    className={activeTab === "profile" ? "active" : ""}
                    onClick={() => setActiveTab("profile")}
                >
                    Profile
                </button>
                <button
                    className={activeTab === "notifications" ? "active" : ""}
                    onClick={() => setActiveTab("notifications")}
                >
                    Notifications
                </button>
                <button
                    className={activeTab === "preferences" ? "active" : ""}
                    onClick={() => setActiveTab("preferences")}
                >
                    Preferences
                </button>
            </div>

            {/* Content Area */}
            <div className="settings-content">
                {activeTab === "profile" && <ProfileTab />}
                {activeTab === "notifications" && (
                    <div className="settings-card">
                        <h3>Notification Settings</h3>
                        <p className="card-subtitle">Coming Soon</p>
                    </div>
                )}
                {activeTab === "preferences" && (
                    <div className="settings-card">
                        <h3>Preferences</h3>
                        <p className="card-subtitle">Coming Soon</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function ProfileTab() {
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        role: "",
    });
    const [editData, setEditData] = useState({
        full_name: "",
        email: "",
    });
    const [pwdData, setPwdData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changingPwd, setChangingPwd] = useState(false);
    const [status, setStatus] = useState({ type: "", msg: "" });
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await getUserProfile();
            const profile = {
                full_name: data.full_name,
                email: data.email,
                role: data.role || "User",
            };
            setFormData(profile);
            setEditData({
                full_name: data.full_name,
                email: data.email,
            });
        } catch (err) {
            setStatus({ type: "error", msg: "Failed to load profile" });
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        setStatus({ type: "", msg: "" });
        try {
            const updated = await updateUserProfile({
                full_name: editData.full_name,
                email: editData.email,
            });
            localStorage.setItem("full_name", updated.full_name);
            localStorage.setItem("email", updated.email);
            window.dispatchEvent(new Event("profileUpdated"));
            setFormData({ ...formData, full_name: updated.full_name, email: updated.email });
            setStatus({ type: "success", msg: "Profile updated successfully" });
            setShowEditModal(false);
        } catch (err) {
            setStatus({ type: "error", msg: err.message || "Failed to update profile" });
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (pwdData.newPassword !== pwdData.confirmPassword) {
            setStatus({ type: "error", msg: "New passwords do not match" });
            return;
        }
        setChangingPwd(true);
        setStatus({ type: "", msg: "" });
        try {
            await changePassword({
                old_password: pwdData.oldPassword,
                new_password: pwdData.newPassword
            });
            setStatus({ type: "success", msg: "Password changed successfully" });
            setPwdData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            setStatus({ type: "error", msg: err.message || "Failed to change password" });
        } finally {
            setChangingPwd(false);
        }
    };

    if (loading) return <div className="settings-card"><p>Loading profile...</p></div>;

    return (
        <div className="settings-card">
            <div className="section-header">
                <div>
                    <h3>Profile Information</h3>
                    <span className="card-subtitle">Manage your personal details and account role</span>
                </div>
                <button className="edit-profile-btn" onClick={() => setShowEditModal(true)}>
                    Edit Profile
                </button>
            </div>

            {status.msg && (
                <div className={`status-message ${status.type}`}>
                    {status.msg}
                </div>
            )}

            <div className="profile-details-grid">
                <div className="detail-item">
                    <label>Full Name</label>
                    <p>{formData.full_name || "Not set"}</p>
                </div>
                <div className="detail-item">
                    <label>Email Address</label>
                    <p>{formData.email || "Not set"}</p>
                </div>
                <div className="detail-item full-width">
                    <label>Role</label>
                    <p className="role-badge">{formData.role}</p>
                </div>
            </div>

            <div className="section-divider"></div>

            <div className="security-section">
                <h3>Security</h3>
                <span className="card-subtitle" style={{ textAlign: 'left', marginBottom: '24px' }}>
                    Change your account password
                </span>

                <form className="change-password-form" onSubmit={handleChangePassword}>
                    <div className="form-group">
                        <label>Current Password</label>
                        <input
                            type="password"
                            required
                            value={pwdData.oldPassword}
                            onChange={(e) => setPwdData({ ...pwdData, oldPassword: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            required
                            value={pwdData.newPassword}
                            onChange={(e) => setPwdData({ ...pwdData, newPassword: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm New Password</label>
                        <input
                            type="password"
                            required
                            value={pwdData.confirmPassword}
                            onChange={(e) => setPwdData({ ...pwdData, confirmPassword: e.target.value })}
                        />
                    </div>
                    <div className="save-container" style={{ marginTop: '12px' }}>
                        <button
                            type="submit"
                            className="save-btn"
                            disabled={changingPwd}
                            style={{ background: '#4b5563' }}
                        >
                            {changingPwd ? "Updating..." : "Update Password"}
                        </button>
                    </div>
                </form>
            </div>

            {/* EDIT MODAL */}
            {showEditModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Edit Profile</h2>
                            <button className="close-btn" onClick={() => setShowEditModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleSaveProfile}>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={editData.full_name}
                                    onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={editData.email}
                                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={() => setShowEditModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="save-btn" disabled={saving}>
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

