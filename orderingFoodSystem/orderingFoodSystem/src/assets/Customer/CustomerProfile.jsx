import { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSave, FaEdit } from "react-icons/fa";
import { profileAPI } from "../../utils/api";

export default function CustomerProfile() {
  const [profile, setProfile] = useState({
    full_name: "",
    username: "",
    email: "",
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
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold" style={{ color: "#3a3433ff" }}>My Profile</h1>
        <button
          className="btn"
          onClick={() => setIsEditing(!isEditing)}
          style={{ backgroundColor: "#ff5722", borderColor: "#ff5722", color: "white" }}
        >
          <FaEdit className="me-2" />
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger mb-4">{error}</div>
      )}

      <div className="row g-4">

        {/* Profile Information */}
        <div className="col-md-8">
          <div className="card shadow-sm" style={{ borderRadius: "15px", border: "none", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
            <div className="card-header bg-white">
              <h5 className="mb-0" style={{ color: "#3a3433ff" }}>Personal Information</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="row g-3">
                  {/* Full Name (auto-generated from first + last name) */}
                  <div className="col-md-6">
                    <label className="form-label">Full Name</label>
                    <div className="input-group">
                      <span className="input-group-text" style={{ backgroundColor: "#f8f9fa", borderColor: "#dee2e6" }}>
                        <FaUser style={{ color: "#ff5722" }} />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        value={profile.full_name || `${profile.first_name} ${profile.last_name}`.trim() || "N/A"}
                        disabled
                        style={{ borderColor: "#dee2e6", backgroundColor: "#f8f9fa", color: "#212529", opacity: 1, WebkitTextFillColor: "#212529" }}
                      />
                    </div>
                    <small className="text-muted">Full name is automatically generated from first and last name</small>
                  </div>

                  {/* Username */}
                  <div className="col-md-6">
                    <label className="form-label">Username</label>
                    <div className="input-group">
                      <span className="input-group-text" style={{ backgroundColor: "#f8f9fa", borderColor: "#dee2e6" }}>
                        <FaUser style={{ color: "#ff5722" }} />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        value={profile.username || ""}
                        disabled
                        style={{ borderColor: "#dee2e6", backgroundColor: "#f8f9fa", color: "#212529", opacity: 1, WebkitTextFillColor: "#212529" }}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <div className="input-group">
                      <span className="input-group-text" style={{ backgroundColor: "#f8f9fa", borderColor: "#dee2e6" }}>
                        <FaEnvelope style={{ color: "#ff5722" }} />
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        value={profile.email || ""}
                        disabled
                        style={{ borderColor: "#dee2e6", backgroundColor: "#f8f9fa", color: "#212529", opacity: 1, WebkitTextFillColor: "#212529" }}
                      />
                    </div>
                  </div>

                  {/* First Name */}
                  <div className="col-md-6">
                    <label className="form-label">First Name</label>
                    <div className="input-group">
                      <span className="input-group-text" style={{ backgroundColor: "#f8f9fa", borderColor: "#dee2e6" }}>
                        <FaUser style={{ color: "#ff5722" }} />
                      </span>
                      <input
                        type="text"
                        name="first_name"
                        className="form-control"
                        value={profile.first_name || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        required
                        style={{ borderColor: "#dee2e6" }}
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="col-md-6">
                    <label className="form-label">Last Name</label>
                    <div className="input-group">
                      <span className="input-group-text" style={{ backgroundColor: "#f8f9fa", borderColor: "#dee2e6" }}>
                        <FaUser style={{ color: "#ff5722" }} />
                      </span>
                      <input
                        type="text"
                        name="last_name"
                        className="form-control"
                        value={profile.last_name || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        required
                        style={{ borderColor: "#dee2e6" }}
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="col-md-6">
                    <label className="form-label">Phone</label>
                    <div className="input-group">
                      <span className="input-group-text" style={{ backgroundColor: "#f8f9fa", borderColor: "#dee2e6" }}>
                        <FaPhone style={{ color: "#ff5722" }} />
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        className="form-control"
                        value={profile.phone || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        style={{ borderColor: "#dee2e6" }}
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="col-12">
                    <label className="form-label">Address</label>
                    <div className="input-group">
                      <span className="input-group-text" style={{ backgroundColor: "#f8f9fa", borderColor: "#dee2e6", height: "auto", minHeight: "45px" }}>
                        <FaMapMarkerAlt style={{ color: "#ff5722" }} />
                      </span>
                      <textarea
                        name="address"
                        className="form-control"
                        rows="3"
                        value={profile.address || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        style={{ borderColor: "#dee2e6" }}
                      ></textarea>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="col-12">
                      <button type="submit" className="btn me-2" style={{ backgroundColor: "#ff5722", borderColor: "#ff5722", color: "white" }} disabled={saving}>
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

    </div>
  );
}
