// script.js

document.addEventListener('DOMContentLoaded', () => {
    const bookForm = document.getElementById('bookForm');
    const bookTableBody = document.querySelector('#bookTable tbody');
    const titleInput = document.getElementById('title');
    const authorInput = document.getElementById('author');
    const isbnInput = document.getElementById('isbn');

    let books = JSON.parse(localStorage.getItem('books')) || [];
    let editingBookId = null;

    // Function to save books to local storage
    const saveBooks = () => {
        localStorage.setItem('books', JSON.stringify(books));
    };

    // Function to render books in the table
    const renderBooks = () => {
        bookTableBody.innerHTML = ''; // Clear existing rows
        books.forEach(book => {
            const row = bookTableBody.insertRow();
            row.dataset.id = book.id;
            row.innerHTML = `
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.isbn}</td>
                <td class="actions">
                    <button class="edit" data-id="${book.id}">Edit</button>
                    <button class="delete" data-id="${book.id}">Delete</button>
                </td>
            `;
        });
    };

    // Function to add or update a book
    bookForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = titleInput.value.trim();
        const author = authorInput.value.trim();
        const isbn = isbnInput.value.trim();

        if (title && author && isbn) {
            if (editingBookId) {
                // Update existing book
                books = books.map(book => 
                    book.id === editingBookId ? { ...book, title, author, isbn } : book
                );
                editingBookId = null;
                bookForm.querySelector('button[type="submit"]').textContent = 'Add Book';
            } else {
                // Add new book
                const newBook = {
                    id: Date.now().toString(), // Simple unique ID
                    title,
                    author,
                    isbn
                };
                books.push(newBook);
            }
            saveBooks();
            renderBooks();
            bookForm.reset(); // Clear form fields
        } else {
            alert('Please fill in all fields.');
        }
    });

    // Event delegation for edit and delete buttons
    bookTableBody.addEventListener('click', (e) => {
        const target = e.target;
        const bookId = target.dataset.id;

        if (target.classList.contains('edit')) {
            const bookToEdit = books.find(book => book.id === bookId);
            if (bookToEdit) {
                titleInput.value = bookToEdit.title;
                authorInput.value = bookToEdit.author;
                isbnInput.value = bookToEdit.isbn;
                editingBookId = bookId;
                bookForm.querySelector('button[type="submit"]').textContent = 'Update Book';
            }
        } else if (target.classList.contains('delete')) {
            if (confirm('Are you sure you want to delete this book?')) {
                books = books.filter(book => book.id !== bookId);
                saveBooks();
                renderBooks();
            }
        }
    });

    // Initial render when the page loads
    renderBooks();
});
