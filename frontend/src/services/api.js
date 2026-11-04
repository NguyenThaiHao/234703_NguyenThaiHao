const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

async function request(path, options) {
  const response = await fetch(`${API_URL}${path}`, options);
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Yeu cau khong thanh cong");
  }
  return result;
}

export function getDevices(search = "") {
  return request(`/api/devices?search=${encodeURIComponent(search)}`);
}

export function getDeviceById(id) {
  return request(`/api/devices/${id}`);
}

export function addDevice(device) {
  return request("/api/devices", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(device)
  });
}

export function updateDevice(id, device) {
  return request(`/api/devices/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(device)
  });
}

export function deleteDevice(id) {
  return request(`/api/devices/${id}`, { method: "DELETE" });
}
