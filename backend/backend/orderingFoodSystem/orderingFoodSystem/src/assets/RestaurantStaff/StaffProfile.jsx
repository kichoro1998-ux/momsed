import { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSave, FaEdit } from "react-icons/fa";
import { profileAPI } from "../../utils/api";

export default function StaffProfile() {
    const [profile, setProfile] = useState({
        full_name: "",
        username: "",
        email: "",
        role: "",
        first_name: "",
        last_name: "",
        phone: "",
        address: "",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // Fetch profile on mount
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await profileAPI.getProfile();
            setProfile(response.data);
        } catch (err) {
            console.error("Error fetching profile:", err);
            setError("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    // Get display role
    const getRoleDisplay = (role) => {
        switch(role) {
            case 'restaurant': return 'Restaurant Staff';
            default: return 'Staff';
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            const response = await profileAPI.updateProfile({
                first_name: profile.first_name,
                last_name: profile.last_name,
                phone: profile.phone,
                address: profile.address,
            });
            setProfile(response.data);
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (err) {
            console.error("Error updating profile:", err);
            setError(err.response?.data?.error || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="container-fluid d-flex align-items-center justify-content-center" style={{ minHeight: "50vh" }}>
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid p-4">
            <h2 className="fw-bold mb-4">My Profile</h2>

            {/* Error Message */}
            {error && (
                <div className="alert alert-danger mb-4">{error}</div>
            )}

            <div className="row">
                {/* Profile Form */}
                <div className="col-md-8">
                    <div className="card p-4 shadow-sm">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0">Edit Profile Information</h5>
                            <button
                                className="btn btn-primary"
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                <FaEdit className="me-2" />
                                {isEditing ? "Cancel" : "Edit Profile"}
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                {/* Full Name (auto-generated) */}
                                <div className="col-md-6">
                                    <label className="form-label">Full Name</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><FaUser /></span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={profile.full_name || `${profile.first_name} ${profile.last_name}`.trim() || "N/A"}
                                            disabled
                                        />
                                    </div>
                                    <small className="text-muted">Auto-generated from first and last name</small>
                                </div>

                                {/* Username */}
                                <div className="col-md-6">
                                    <label className="form-label">Username</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><FaUser /></span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={profile.username || ""}
                                            disabled
                                        />
                                    </div>
                                </div>

                                {/* Role */}
                                <div className="col-md-6">
                                    <label className="form-label">Position</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={getRoleDisplay(profile.role)}
                                        disabled
                                    />
                                </div>

                                {/* Email */}
                                <div className="col-md-6">
                                    <label className="form-label">Email</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><FaEnvelope /></span>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={profile.email || ""}
                                            disabled
                                        />
                                    </div>
                                </div>

                                {/* First Name */}
                                <div className="col-md-6">
                                    <label className="form-label">First Name</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><FaUser /></span>
                                        <input
                                            type="text"
                                            name="first_name"
                                            className="form-control"
                                            value={profile.first_name || ""}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Last Name */}
                                <div className="col-md-6">
                                    <label className="form-label">Last Name</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><FaUser /></span>
                                        <input
                                            type="text"
                                            name="last_name"
                                            className="form-control"
                                            value={profile.last_name || ""}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="col-md-6">
                                    <label className="form-label">Phone</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><FaPhone /></span>
                                        <input
                                            type="tel"
                                            name="phone"
                                            className="form-control"
                                            value={profile.phone || ""}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="col-12">
                                    <label className="form-label">Address</label>
                                    <div className="input-group">
                                        <span className="input-group-text" style={{ height: 'auto', minHeight: '45px' }}><FaMapMarkerAlt /></span>
                                        <textarea
                                            name="address"
                                            className="form-control"
                                            rows="3"
                                            value={profile.address || ""}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                        ></textarea>
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="col-12">
                                        <button type="submit" className="btn btn-primary me-2" disabled={saving}>
                                            {saving ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <FaSave className="me-2" />
                                                    Save Changes
                                                </>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => {
                                                setIsEditing(false);
                                                fetchProfile(); // Reset to original values
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

