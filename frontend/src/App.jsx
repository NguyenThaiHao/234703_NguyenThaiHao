import { useCallback, useEffect, useState } from "react";
import {
  addDevice,
  deleteDevice,
  getDeviceById,
  getDevices,
  updateDevice
} from "./services/api";
import "./App.css";

const emptyDevice = {
  deviceId: "",
  name: "",
  deviceType: "",
  room: "",
  brand: "",
  model: "",
  quantity: 1,
  status: "Dang su dung",
  purchaseDate: "",
  description: ""
};

const fields = [
  { name: "deviceId", label: "Mã thiết bị", required: true },
  { name: "name", label: "Tên thiết bị", required: true },
  { name: "deviceType", label: "Loại thiết bị", required: true },
  { name: "room", label: "Phòng học", required: true },
  { name: "brand", label: "Hãng sản xuất" },
  { name: "model", label: "Model" },
  { name: "quantity", label: "Số lượng", type: "number", required: true },
  { name: "purchaseDate", label: "Ngày mua/tiếp nhận", type: "date" },
  { name: "description", label: "Mô tả, ghi chú", type: "textarea" }
];

const statuses = ["Dang su dung", "Hu hong", "Dang sua chua", "Ngung su dung"];
const statusLabels = {
  "Dang su dung": "Đang sử dụng",
  "Hu hong": "Hư hỏng",
  "Dang sua chua": "Đang sửa chữa",
  "Ngung su dung": "Ngừng sử dụng"
};

function App() {
  const [devices, setDevices] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyDevice);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const loadDevices = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getDevices(search);
      setDevices(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const refresh = async () => {
      await loadDevices();
    };
    refresh();
  }, [loadDevices]);

  function openAdd() {
    setForm({ ...emptyDevice });
    setModal("add");
    setError("");
  }

  function openEdit(device) {
    setForm({ ...emptyDevice, ...device, purchaseDate: device.purchaseDate?.slice(0, 10) || "" });
    setModal("edit");
    setError("");
  }

  async function openDetail(device) {
    setModal("detail");
    setSelectedDevice(device);
    setError("");
    try {
      const result = await getDeviceById(device._id);
      setSelectedDevice(result.data);
    } catch (err) {
      setError(err.message);
    }
  }

  function closeModal() {
    if (saving) return;
    setModal(null);
    setSelectedDevice(null);
    setError("");
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        deviceId: form.deviceId.trim(),
        name: form.name.trim(),
        deviceType: form.deviceType.trim(),
        room: form.room.trim(),
        brand: form.brand.trim(),
        model: form.model.trim(),
        quantity: Number(form.quantity),
        purchaseDate: form.purchaseDate || null,
        description: form.description.trim()
      };
      if (modal === "edit") {
        await updateDevice(form._id, payload);
        setNotice("Cập nhật thiết bị thành công!");
      } else {
        await addDevice(payload);
        setNotice("Thêm thiết bị thành công!");
      }
      setModal(null);
      await loadDevices();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(device) {
    if (!window.confirm(`Bạn có chắc muốn xóa thiết bị "${device.name}" không?`)) return;
    setError("");
    setNotice("");
    try {
      await deleteDevice(device._id);
      setNotice("Xóa thiết bị thành công!");
      await loadDevices();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleSearch(event) {
    event.preventDefault();
    setSearch(searchInput.trim());
  }

  return (
    <div className="page">
      <header className="header">
        <div className="header-content">
          <div className="brand">
            <div className="brand-icon">🖥️</div>
            <div>
              <h1>QUẢN LÝ THIẾT BỊ PHÒNG HỌC</h1>
              <p>Theo dõi tài sản và tình trạng thiết bị</p>
            </div>
          </div>
          <span className="header-badge">CLASSROOM DEVICES</span>
        </div>
      </header>

      <main className="container">
        <section className="page-heading">
          <div>
            <h2>Danh sách thiết bị</h2>
            <p>Quản lý thiết bị trong các phòng học</p>
          </div>
          <button className="btn btn-primary" onClick={openAdd}>+ Thêm thiết bị</button>
        </section>

        {notice && <div className="alert alert-success">{notice}<button onClick={() => setNotice("")}>×</button></div>}
        {error && !modal && <div className="alert alert-error">{error}<button onClick={() => setError("")}>×</button></div>}

        <section className="card">
          <form className="toolbar" onSubmit={handleSearch}>
            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Tìm theo mã, tên, loại, phòng học..."
            />
            <button className="btn btn-primary" type="submit">Tìm kiếm</button>
            <button className="btn btn-outline" type="button" onClick={() => { setSearchInput(""); setSearch(""); }}>Làm mới</button>
          </form>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Mã thiết bị</th><th>Tên thiết bị</th><th>Loại</th><th>Phòng</th>
                  <th>Số lượng</th><th>Tình trạng</th><th className="actions-heading">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? <tr><td colSpan="7" className="empty">Đang tải dữ liệu...</td></tr> :
                  devices.length === 0 ? <tr><td colSpan="7" className="empty">Chưa có thiết bị nào trong hệ thống.</td></tr> :
                  devices.map((device) => (
                    <tr key={device._id}>
                      <td><span className="book-code">{device.deviceId}</span></td>
                      <td className="book-title">{device.name}</td>
                      <td>{device.deviceType}</td><td>{device.room}</td><td>{device.quantity}</td>
                      <td><span className={`status status-${device.status.replaceAll(" ", "-")}`}>{statusLabels[device.status] || device.status}</span></td>
                      <td><div className="action-buttons">
                        <button className="btn btn-view" onClick={() => openDetail(device)}>Chi tiết</button>
                        <button className="btn btn-edit" onClick={() => openEdit(device)}>Sửa</button>
                        <button className="btn btn-delete" onClick={() => handleDelete(device)}>Xóa</button>
                      </div></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
        <footer>Quản lý thiết bị phòng học | React • Express • MongoDB Atlas</footer>
      </main>

      {modal && <div className="modal-overlay" onClick={closeModal}>
        <div className="modal" onClick={(event) => event.stopPropagation()}>
          <div className="modal-header">
            <h3>{modal === "add" ? "Thêm thiết bị mới" : modal === "edit" ? "Cập nhật thiết bị" : "Chi tiết thiết bị"}</h3>
            <button className="close-btn" onClick={closeModal}>×</button>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          {modal === "detail" ? <div className="detail-content">
            {selectedDevice && [...fields, { name: "status", label: "Tình trạng" }].map((field) => (
              <div className="detail-row" key={field.name}><strong>{field.label}</strong>
                <span>{field.name === "status" ? (statusLabels[selectedDevice[field.name]] || selectedDevice[field.name]) : selectedDevice[field.name] || "—"}</span>
              </div>
            ))}
            <div className="modal-footer"><button className="btn btn-outline" onClick={closeModal}>Đóng</button></div>
          </div> : <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {fields.map((field) => <label className="form-field" key={field.name}>
                <span>{field.label}{field.required && <em> *</em>}</span>
                {field.name === "description" ? <textarea name={field.name} value={form[field.name] || ""} onChange={handleChange} rows="3" /> :
                  <input name={field.name} type={field.type || "text"} value={form[field.name] ?? ""} onChange={handleChange} required={field.required} min={field.type === "number" ? 0 : undefined} step={field.type === "number" ? 1 : undefined} />}
              </label>)}
              <label className="form-field"><span>Tình trạng <em>*</em></span>
                <select name="status" value={form.status} onChange={handleChange} required>
                  {statuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}
                </select>
              </label>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline" onClick={closeModal}>Hủy</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Đang lưu..." : modal === "edit" ? "Lưu thay đổi" : "Thêm thiết bị"}</button>
            </div>
          </form>}
        </div>
      </div>}
    </div>
  );
}

export default App;
