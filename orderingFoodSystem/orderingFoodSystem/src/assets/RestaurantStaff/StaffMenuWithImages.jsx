import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaCamera, FaCheck } from "react-icons/fa";
import { foodAPI } from "../../utils/api";

export default function StaffMenu() {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    // Form state
    const [form, setForm] = useState({ 
        name: "", 
        price: "", 
        description: "", 
        category: "Main",
        available: true 
    });
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);

    // Image upload state
    const [uploadingFoodId, setUploadingFoodId] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Fetch foods from API
    useEffect(() => {
        const fetchFoods = async () => {
            try {
                const response = await foodAPI.getAll();
                setMenuItems(response.data);
            } catch (err) {
                console.error("Error fetching foods:", err);
                setError("Failed to load menu items. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchFoods();
    }, []);

    // Handle form input
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ 
            ...form, 
            [name]: type === 'checkbox' ? checked : value 
        });
    };

    // Handle file selection
    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Upload food image
    const handleImageUpload = async (foodId) => {
        if (!selectedFile) {
            alert("Please select an image first");
            return;
        }

        setUploadingFoodId(foodId);
        try {
            const formData = new FormData();
            formData.append('image', selectedFile);

            const response = await foodAPI.uploadImage(foodId, formData);
            
            // Update the menu items with the new image
            setMenuItems(menuItems.map(item => 
                item.id === foodId ? response.data.food : item
            ));
            
            setSelectedFile(null);
            setImagePreview(null);
            alert("Image uploaded successfully!");
        } catch (err) {
            console.error("Error uploading image:", err);
            alert("Failed to upload image. Please try again.");
        } finally {
            setUploadingFoodId(null);
        }
    };

    // Add or update menu item
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!form.name || !form.price) {
            alert("Name and price are required!");
            return;
        }

        setSaving(true);
        
        try {
            const foodData = {
                name: form.name,
                price: parseFloat(form.price),
                description: form.description,
                category: form.category,
                available: form.available
            };

            if (editingId) {
                // Update existing item
                await foodAPI.update(editingId, foodData);
                setMenuItems(menuItems.map(item => 
                    item.id === editingId ? { ...item, ...foodData } : item
                ));
                setEditingId(null);
            } else {
                // Create new item
                const response = await foodAPI.create(foodData);
                setMenuItems([...menuItems, response.data]);
            }
            
            setForm({ 
                name: "", 
                price: "", 
                description: "", 
                category: "Main",
                available: true 
            });
        } catch (err) {
            console.error("Error saving food:", err);
            alert("Failed to save food item. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    // Edit a menu item
    const handleEdit = (item) => {
        setForm({
            name: item.name,
            price: item.price,
            description: item.description || "",
            category: item.category || "Main",
            available: item.available
        });
        setEditingId(item.id);
    };

    // Delete a menu item
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this dish?")) {
            return;
        }
        
        try {
            await foodAPI.delete(id);
            setMenuItems(menuItems.filter(item => item.id !== id));
        } catch (err) {
            console.error("Error deleting food:", err);
            alert("Failed to delete food item. Please try again.");
        }
    };

    const formatPrice = (price) => {
        return `Tzs${parseFloat(price || 0).toLocaleString()}`;
    };

    if (loading) {
        return (
            <div className="container-fluid text-center py-5">
                <div className="spinner-border text-danger" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading menu...</p>
            </div>
        );
    }

    return (
        <div className="container-fluid p-4">
            <h2 className="fw-bold mb-4">🍽️ Manage Menu</h2>

            {error && (
                <div className="alert alert-danger mb-4">
                    {error}
                </div>
            )}

            {/* ADD / EDIT FORM */}
            <div className="card p-4 mb-4 shadow-sm">
                <h5 className="mb-3">{editingId ? "Edit Dish" : "Add New Dish"}</h5>
                <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-md-3">
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="Dish Name"
                            value={form.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-2">
                        <input
                            type="number"
                            name="price"
                            step="0.01"
                            className="form-control"
                            placeholder="Price (Tzs)"
                            value={form.price}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="text"
                            name="description"
                            className="form-control"
                            placeholder="Description"
                            value={form.description}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-2">
                        <select
                            name="category"
                            className="form-select"
                            value={form.category}
                            onChange={handleChange}
                        >
                            <option value="Main">Main</option>
                            <option value="Appetizer">Appetizer</option>
                            <option value="Dessert">Dessert</option>
                            <option value="Drink">Drink</option>
                            <option value="Side">Side</option>
                        </select>
                    </div>
                    <div className="col-md-1 d-flex align-items-center">
                        <div className="form-check">
                            <input
                                type="checkbox"
                                name="available"
                                className="form-check-input"
                                id="available"
                                checked={form.available}
                                onChange={handleChange}
                            />
                            <label className="form-check-label" htmlFor="available">
                                Available
                            </label>
                        </div>
                    </div>
                    <div className="col-md-1 d-grid">
                        <button 
                            type="submit" 
                            className="btn btn-danger"
                            disabled={saving}
                        >
                            {saving ? (
                                <span className="spinner-border spinner-border-sm"></span>
                            ) : (
                                editingId ? "Update" : <><FaPlus className="me-1" /> Add</>
                            )}
                        </button>
                    </div>
                </form>
                
                {editingId && (
                    <div className="mt-3">
                        <button 
                            className="btn btn-secondary"
                            onClick={() => {
                                setEditingId(null);
                                setForm({ 
                                    name: "", 
                                    price: "", 
                                    description: "", 
                                    category: "Main",
                                    available: true 
                                });
                            }}
                        >
                            Cancel Edit
                        </button>
                    </div>
                )}
            </div>

            {/* MENU TABLE */}
            <div className="card p-4 shadow-sm">
                <h5 className="mb-3">Menu Items ({menuItems.length})</h5>
                {menuItems.length === 0 ? (
                    <div className="text-center py-4">
                        <p className="text-muted">No dishes added yet.</p>
                        <p className="text-muted small">Use the form above to add your first menu item.</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-dark">
                                <tr>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Price (Tzs)</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Image Upload</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {menuItems.map(item => (
                                    <tr key={item.id}>
                                        <td>
                                            {item.image ? (
                                                <img 
                                                    src={item.image} 
                                                    alt={item.name}
                                                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
                                                />
                                            ) : (
                                                <div style={{ width: '50px', height: '50px', backgroundColor: '#f0f0f0', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <FaCamera className="text-muted" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="fw-bold">{item.name}</td>
                                        <td>{item.category || 'Main'}</td>
                                        <td>{formatPrice(item.price)}</td>
                                        <td className="text-muted small">{item.description || '-'}</td>
                                        <td>
                                            <span className={`badge ${item.available ? 'bg-success' : 'bg-danger'}`}>
                                                {item.available ? 'Available' : 'Unavailable'}
                                            </span>
                                        </td>
                                        <td>
                                            <button 
                                                className="btn btn-sm btn-info text-white"
                                                onClick={() => setUploadingFoodId(item.id)}
                                                title="Upload Image"
                                            >
                                                <FaCamera /> Upload
                                            </button>
                                        </td>
                                        <td>
                                            <button 
                                                className="btn btn-sm btn-warning me-2" 
                                                onClick={() => handleEdit(item)}
                                                title="Edit"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-danger" 
                                                onClick={() => handleDelete(item.id)}
                                                title="Delete"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* IMAGE UPLOAD MODAL */}
            {uploadingFoodId && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-info text-white">
                                <h5 className="modal-title">
                                    <FaCamera className="me-2" />
                                    Upload Food Image
                                </h5>
                                <button 
                                    type="button" 
                                    className="btn-close btn-close-white"
                                    onClick={() => {
                                        setUploadingFoodId(null);
                                        setSelectedFile(null);
                                        setImagePreview(null);
                                    }}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>Upload an image for: <strong>{menuItems.find(i => i.id === uploadingFoodId)?.name}</strong></p>
                                
                                {/* Image Preview */}
                                {imagePreview && (
                                    <div className="mb-3 text-center">
                                        <img 
                                            src={imagePreview} 
                                            alt="Preview"
                                            style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '10px' }}
                                        />
                                    </div>
                                )}

                                {/* File Input */}
                                <div className="form-group">
                                    <label htmlFor="imageInput" className="form-label">Select Image File</label>
                                    <input 
                                        type="file" 
                                        id="imageInput"
                                        className="form-control"
                                        accept="image/*"
                                        onChange={handleImageSelect}
                                    />
                                    <small className="text-muted">Supported formats: JPG, PNG, GIF (Max 5MB)</small>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setUploadingFoodId(null);
                                        setSelectedFile(null);
                                        setImagePreview(null);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-success"
                                    onClick={() => handleImageUpload(uploadingFoodId)}
                                    disabled={!selectedFile}
                                >
                                    {uploadingFoodId ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <FaCheck className="me-2" />
                                            Upload Image
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
