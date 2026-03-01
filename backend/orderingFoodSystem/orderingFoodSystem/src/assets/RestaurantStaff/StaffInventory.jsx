import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { inventoryAPI } from "../../utils/api";

export default function StaffInventory() {
    const [inventoryItems, setInventoryItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    // Form state
    const [form, setForm] = useState({ 
        name: "", 
        quantity: "", 
        unit: "kg", 
        supplier: "" 
    });
    const [editingId, setEditingId] = useState(null);

    const UNIT_CHOICES = ['kg', 'g', 'l', 'ml', 'pcs', 'boxes', 'packs'];

    // Fetch inventory from API
    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const response = await inventoryAPI.getAll();
                setInventoryItems(response.data || []);
            } catch (err) {
                console.error("Error fetching inventory:", err);
                setError("Failed to load inventory. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchInventory();
    }, []);

    // Handle form input
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Add or update inventory item
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!form.name || !form.quantity || !form.unit) {
            alert("Name, quantity, and unit are required!");
            return;
        }

        setSaving(true);
        
        try {
            const inventoryData = {
                name: form.name,
                quantity: parseFloat(form.quantity),
                unit: form.unit,
                supplier: form.supplier
            };

            if (editingId) {
                // Update existing item
                await inventoryAPI.update(editingId, inventoryData);
                setInventoryItems(inventoryItems.map(item => 
                    item.id === editingId ? { ...item, ...inventoryData } : item
                ));
                setEditingId(null);
            } else {
                // Create new item
                const response = await inventoryAPI.create(inventoryData);
                setInventoryItems([...inventoryItems, response.data]);
            }
            
            setForm({ 
                name: "", 
                quantity: "", 
                unit: "kg", 
                supplier: "" 
            });
        } catch (err) {
            console.error("Error saving inventory:", err);
            alert("Failed to save inventory item. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    // Edit an inventory item
    const handleEdit = (item) => {
        setForm({
            name: item.name,
            quantity: item.quantity,
            unit: item.unit,
            supplier: item.supplier || ""
        });
        setEditingId(item.id);
    };

    // Delete an inventory item
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this item?")) {
            return;
        }
        
        try {
            await inventoryAPI.delete(id);
            setInventoryItems(inventoryItems.filter(item => item.id !== id));
        } catch (err) {
            console.error("Error deleting inventory:", err);
            alert("Failed to delete inventory item. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="container-fluid text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading inventory...</p>
            </div>
        );
    }

    return (
        <div className="container-fluid p-4">
            <h2 className="fw-bold mb-4">Manage Inventory</h2>

            {error && (
                <div className="alert alert-danger mb-4">
                    {error}
                </div>
            )}

            {/* ADD / EDIT FORM */}
            <div className="card p-4 mb-4 shadow-sm">
                <h5 className="mb-3">{editingId ? "Edit Item" : "Add New Item"}</h5>
                <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-md-3">
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="Item Name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-2">
                        <input
                            type="number"
                            name="quantity"
                            step="0.01"
                            className="form-control"
                            placeholder="Quantity"
                            value={form.quantity}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-2">
                        <select
                            name="unit"
                            className="form-select"
                            value={form.unit}
                            onChange={handleChange}
                        >
                            {UNIT_CHOICES.map(unit => (
                                <option key={unit} value={unit}>{unit}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <input
                            type="text"
                            name="supplier"
                            className="form-control"
                            placeholder="Supplier"
                            value={form.supplier}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-2">
                        <button 
                            type="submit" 
                            className="btn btn-primary w-100"
                            disabled={saving}
                        >
                            {saving ? (
                                <span className="spinner-border spinner-border-sm"></span>
                            ) : (
                                <>
                                    <FaPlus className="me-2" />
                                    {editingId ? "Update" : "Add"}
                                </>
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
                                    quantity: "", 
                                    unit: "kg", 
                                    supplier: "" 
                                });
                            }}
                        >
                            Cancel Edit
                        </button>
                    </div>
                )}
            </div>

            {/* INVENTORY LIST */}
            <div className="card p-4 shadow-sm">
                <h5 className="mb-3">Current Inventory ({inventoryItems.length} items)</h5>
                
                {inventoryItems.length === 0 ? (
                    <div className="text-center py-4">
                        <p className="text-muted">No inventory items added yet.</p>
                        <p className="text-muted small">Use the form above to add your first inventory item.</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Quantity</th>
                                    <th>Unit</th>
                                    <th>Supplier</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventoryItems.map((item) => (
                                    <tr key={item.id}>
                                        <td className="fw-bold">{item.name}</td>
                                        <td>{parseFloat(item.quantity).toLocaleString()}</td>
                                        <td>{item.unit}</td>
                                        <td>{item.supplier || '-'}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-primary me-2"
                                                onClick={() => handleEdit(item)}
                                                title="Edit"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
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
        </div>
    );
}
