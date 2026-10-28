const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export async function getBooks(search = "") {
  const response = await fetch(
    `${API_URL}/api/books?search=${encodeURIComponent(search)}`
  );

  if (!response.ok) {
    throw new Error("Không thể tải danh sách sách");
  }

  return response.json();
}

export async function addBook(book) {
  const response = await fetch(`${API_URL}/api/books`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(book),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Không thể thêm sách");
  }

  return result;
}

export async function updateBook(id, book) {
  const response = await fetch(`${API_URL}/api/books/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(book),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Không thể cập nhật sách");
  }

  return result;
}

export async function deleteBook(id) {
  const response = await fetch(`${API_URL}/api/books/${id}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Không thể xóa sách");
  }

  return result;
}

export async function getBookById(id) {
  const response = await fetch(`${API_URL}/api/books/${id}`);

  if (!response.ok) {
    throw new Error("Không thể tải chi tiết sách");
  }

  return response.json();
}