import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddBookModal, setShowAddBookModal] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:5041/api/books", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, [books]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleUpdate = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };
  const handleAddition = () => {
    setShowAddBookModal(true);
  };

  const closeModal = () => {
    setSelectedBook(null);
    setShowModal(false);
    setShowAddBookModal(false);
  };

  const handleSaveChanges = async () => {
    if (!selectedBook) return;

    try {
      await axios.put(
        `http://localhost:5041/api/books/${selectedBook.id}`,
        selectedBook,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === selectedBook.id ? selectedBook : book
        )
      );
      closeModal();
      alert("Book updated successfully");
    } catch (error) {
      console.error("Error updating book:", error);
      alert("Failed to update the book");
    }
  };
  
  const handleSubmit = async () => {
    if (!selectedBook) return;

    try {
      await axios.post(
        `http://localhost:5041/api/books/`,
        selectedBook,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === selectedBook.id ? selectedBook : book
        )
      );
      closeModal();
      alert("Book Added successfully");
    } catch (error) {
      console.error("Error Adding new book:", error);
      alert("Failed to add the book");
    }
  };

  const handleDelete = async (bookId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this book?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5041/api/books/${bookId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setBooks(books.filter((book) => book.id !== bookId));
        alert("Book deleted successfully");
      } catch (error) {
        console.error("Error deleting book:", error);
        alert("Failed to delete the book");
      }
    }
  };

  return (
    <div>
      <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            BookStore
          </a>
          <div className="button-list">
            <button className="btn btn-outline-light mx-2" onClick={handleAddition}>
              Add Book
            </button>
            <button className="btn btn-outline-light" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <h1 className="mb-4 text-center">Available Books</h1>
        <div className="row">
          {books.length > 0 ? (
            books.map((book) => (
              <div className="col-md-8 col-sm-6 mb-4" key={book.id}>
                <div className="card h-100 shadow">
                  <div className="card-body">
                    <h5 className="card-title">{book.title}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">{book.author}</h6>
                    <p className="card-text">
                      <strong>Price:</strong> ₹{book.price}
                    </p>
                  </div>
                  <div className="card-footer d-flex justify-content-between">
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleUpdate(book)}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(book.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">Loading books...</p>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Book</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      Title
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      value={selectedBook.title}
                      onChange={(e) =>
                        setSelectedBook({ ...selectedBook, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="author" className="form-label">
                      Author
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="author"
                      value={selectedBook.author}
                      onChange={(e) =>
                        setSelectedBook({ ...selectedBook, author: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="price" className="form-label">
                      Price
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="price"
                      value={selectedBook.price}
                      onChange={(e) =>
                        setSelectedBook({ ...selectedBook, price: e.target.value })
                      }
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showAddBookModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Book</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="id" className="form-label">
                      ID
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="id"
                      onChange={(e) =>
                        setSelectedBook({ ...selectedBook, title: e.target.value })
                      }
                    />
                    <label htmlFor="title" className="form-label">
                      Title
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      onChange={(e) =>
                        setSelectedBook({ ...selectedBook, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="author" className="form-label">
                      Author
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="author"
                      onChange={(e) =>
                        setSelectedBook({ ...selectedBook, author: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="price" className="form-label">
                      Price
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="price"
                      onChange={(e) =>
                        setSelectedBook({ ...selectedBook, price: e.target.value })
                      }
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
