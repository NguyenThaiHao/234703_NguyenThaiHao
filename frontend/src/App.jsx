import { useCallback, useEffect, useState } from "react";
import {
  getBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
} from "./services/api";
import "./App.css";

const emptyBook = {
  bookId: "",
  title: "",
  author: "",
  category: "",
  publisher: "",
  publishYear: "",
  isbn: "",
  quantity: 0,
};

const fields = [
  { name: "bookId", label: "Mã sách", required: true },
  { name: "title", label: "Tên sách", required: true },
  { name: "author", label: "Tác giả", required: true },
  { name: "category", label: "Thể loại", required: true },
  { name: "publisher", label: "Nhà xuất bản" },
  { name: "publishYear", label: "Năm xuất bản", type: "number", required: true },
  { name: "isbn", label: "ISBN" },
  { name: "quantity", label: "Số lượng", type: "number", required: true },
];

function App() {
  const [books, setBooks] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyBook);
  const [selectedBook, setSelectedBook] = useState(null);

  const loadBooks = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getBooks(search);
      setBooks(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  function openAdd() {
    setForm({ ...emptyBook });
    setModal("add");
    setError("");
  }

  function openEdit(book) {
    setForm({
      ...emptyBook,
      ...book,
    });
    setModal("edit");
    setError("");
  }

  async function openDetail(book) {
    setModal("detail");
    setSelectedBook(book);
    setError("");

    try {
      const result = await getBookById(book._id);
      setSelectedBook(result.data);
    } catch (err) {
      setError(err.message);
    }
  }

  function closeModal() {
    if (saving) return;
    setModal(null);
    setSelectedBook(null);
    setError("");
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        bookId: form.bookId.trim(),
        title: form.title.trim(),
        author: form.author.trim(),
        category: form.category.trim(),
        publisher: form.publisher.trim(),
        publishYear: Number(form.publishYear),
        isbn: form.isbn.trim(),
        quantity: Number(form.quantity),
      };

      if (modal === "edit") {
        await updateBook(form._id, payload);
        setNotice("Cập nhật sách thành công!");
      } else {
        await addBook(payload);
        setNotice("Thêm sách thành công!");
      }

      setModal(null);
      await loadBooks();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(book) {
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa sách "${book.title}" không?`
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    try {
      await deleteBook(book._id);
      setNotice("Xóa sách thành công!");
      await loadBooks();
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
            <div className="brand-icon">📚</div>
            <div>
              <h1>HỆ THỐNG QUẢN LÝ SÁCH</h1>
              <p>Quản lý thư viện trực tuyến</p>
            </div>
          </div>
          <span className="header-badge">BOOK MANAGEMENT</span>
        </div>
      </header>

      <main className="container">
        <section className="page-heading">
          <div>
            <h2>Danh sách sách</h2>
            <p>Quản lý và cập nhật thông tin sách trong hệ thống</p>
          </div>
          <button className="btn btn-primary" onClick={openAdd}>
            + Thêm sách
          </button>
        </section>

        {notice && (
          <div className="alert alert-success">
            {notice}
            <button onClick={() => setNotice("")}>×</button>
          </div>
        )}

        {error && !modal && (
          <div className="alert alert-error">
            {error}
            <button onClick={() => setError("")}>×</button>
          </div>
        )}

        <section className="card">
          <form className="toolbar" onSubmit={handleSearch}>
            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Tìm kiếm theo tên sách, tác giả, thể loại..."
            />
            <button className="btn btn-primary" type="submit">
              Tìm kiếm
            </button>
            <button
              className="btn btn-outline"
              type="button"
              onClick={() => {
                setSearchInput("");
                setSearch("");
                if (!search) loadBooks();
              }}
            >
              Làm mới
            </button>
          </form>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Mã sách</th>
                  <th>Tên sách</th>
                  <th>Tác giả</th>
                  <th>Thể loại</th>
                  <th>Năm XB</th>
                  <th>Số lượng</th>
                  <th className="actions-heading">Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="empty">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : books.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty">
                      Chưa có sách nào trong hệ thống.
                    </td>
                  </tr>
                ) : (
                  books.map((book) => (
                    <tr key={book._id}>
                      <td>
                        <span className="book-code">{book.bookId}</span>
                      </td>
                      <td className="book-title">{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.category}</td>
                      <td>{book.publishYear}</td>
                      <td>{book.quantity}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-view"
                            onClick={() => openDetail(book)}
                          >
                            Chi tiết
                          </button>
                          <button
                            className="btn btn-edit"
                            onClick={() => openEdit(book)}
                          >
                            Sửa
                          </button>
                          <button
                            className="btn btn-delete"
                            onClick={() => handleDelete(book)}
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <footer>
          Hệ thống quản lý sách | React • Express • MongoDB Atlas
        </footer>
      </main>

      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {modal === "add"
                  ? "Thêm sách mới"
                  : modal === "edit"
                    ? "Cập nhật thông tin sách"
                    : "Chi tiết sách"}
              </h3>
              <button className="close-btn" onClick={closeModal}>
                ×
              </button>
            </div>

            {error && (
              <div className="alert alert-error">{error}</div>
            )}

            {modal === "detail" ? (
              <div className="detail-content">
                {selectedBook &&
                  fields.map((field) => (
                    <div className="detail-row" key={field.name}>
                      <strong>{field.label}</strong>
                      <span>{selectedBook[field.name] ?? "—"}</span>
                    </div>
                  ))}

                <div className="modal-footer">
                  <button className="btn btn-outline" onClick={closeModal}>
                    Đóng
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  {fields.map((field) => (
                    <label className="form-field" key={field.name}>
                      <span>
                        {field.label}
                        {field.required && <em> *</em>}
                      </span>
                      <input
                        name={field.name}
                        type={field.type || "text"}
                        value={form[field.name] ?? ""}
                        onChange={handleChange}
                        required={field.required}
                        min={field.type === "number" ? 0 : undefined}
                        max={field.name === "publishYear" ? 2100 : undefined}
                        step={field.type === "number" ? 1 : undefined}
                      />
                    </label>
                  ))}
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={closeModal}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving
                      ? "Đang lưu..."
                      : modal === "edit"
                        ? "Lưu thay đổi"
                        : "Thêm sách"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;