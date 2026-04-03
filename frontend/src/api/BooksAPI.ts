// Centralized API layer for all book-related HTTP requests.
// Each function wraps fetch in try/catch, logs errors, and rethrows for component-level handling.
import type { Book } from '../types/Book';

// Shape of the paginated response returned by the AllBooks endpoint.
interface FetchBooksResponse {
  books: Book[];
  totalNumBooks: number;
}

// Base URL for the Book API — points to the Azure-hosted backend.
const API_URL = 'https://mission13-berrett-backend.azurewebsites.net/Book';

// Fetches a paginated list of books, optionally filtered by category.
export const fetchBooks = async (
  pageSize: number,
  pageNum: number,
  selectedCategories: string[]
): Promise<FetchBooksResponse> => {
  try {
    const categoryParams = selectedCategories
      .map((cat) => `categories=${encodeURIComponent(cat)}`)
      .join('&');

    const response = await fetch(
      `${API_URL}/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}${selectedCategories.length ? `&${categoryParams}` : ''}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

// Sends a POST request to add a new book to the database.
export const addBook = async (newBook: Book): Promise<Book> => {
  try {
    const response = await fetch(`${API_URL}/AddBook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBook),
    });

    if (!response.ok) {
      throw new Error('Failed to add book');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding book', error);
    throw error;
  }
};

// Sends a PUT request to update an existing book by its ID.
export const updateBook = async (
  bookId: number,
  updatedBook: Book
): Promise<Book> => {
  try {
    const response = await fetch(`${API_URL}/UpdateBook/${bookId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedBook),
    });

    return await response.json();
  } catch (error) {
    console.error('Error updating book:', error);
    throw error;
  }
};

// Sends a DELETE request to remove a book by its ID.
export const deleteBook = async (bookId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/DeleteBook/${bookId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete book');
    }
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
};
