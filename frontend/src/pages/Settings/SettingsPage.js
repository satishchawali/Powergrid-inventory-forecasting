import { useState, useEffect } from "react";
import "./SettingsPage.css";
import { getUserProfile, updateUserProfile } from "../../services/api";

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

            {/* Content */}
            <div className="settings-content">
                {activeTab === "profile" && <ProfileTab />}
                {activeTab === "notifications" && (
                    <div className="card">Notifications coming soon</div>
                )}
                {activeTab === "preferences" && (
                    <div className="card">Preferences coming soon</div>
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
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await getUserProfile();
            setFormData({
                full_name: data.full_name,
                email: data.email,
                role: data.role || "",
            });
        } catch (err) {
            setError(err.message || "Failed to load profile");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            const updated = await updateUserProfile({
                full_name: formData.full_name,
                email: formData.email,
            });

            // ✅ Update localStorage
            localStorage.setItem("full_name", updated.full_name);
            localStorage.setItem("email", updated.email);

            setSuccess("Profile updated successfully");

            // 🔁 Force sidebar refresh
            window.dispatchEvent(new Event("profileUpdated"));

        } catch (err) {
            setError("Failed to update profile");
            console.error(err);
        } finally {
            setSaving(false);
        }
    };


    if (loading) return <div className="card">Loading profile...</div>;

    return (
        <div className="card">
            <h3>Profile Information</h3>
            <p className="card-subtitle">
                Update your personal information and contact details
            </p>

            {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
            {success && <div className="success-message" style={{ color: 'green', marginBottom: '1rem' }}>{success}</div>}

            <div className="form-grid">
                <div className="form-group">
                    <label>Full Name</label>
                    <input
                        type="text"
                        value={formData.full_name}
                        onChange={(e) =>
                            setFormData({ ...formData, full_name: e.target.value })
                        }
                    />
                </div>

                <div className="form-group">
                    <label>Email Address</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                    />
                </div>

                <div className="form-group">
                    <label>Role</label>
                    <input type="text" value={formData.role} disabled />
                </div>
            </div>

            <div className="save-container" style={{ marginTop: '2rem' }}>
                <button
                    className="save-btn"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            {/*divider*/}
            {/* <div className="section_divider"></div> */}

            {/* Security */}
            {/* <div className="security-section">
                <h3>Security</h3>
                <div className="security-actions">
                    <button className="secondary-btn">Change Password</button>
                    <button className="secondary-btn">Enable 2FA</button>
                </div>
            </div> */}
        </div>
    );
}
