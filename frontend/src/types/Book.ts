// Represents a single book returned from the Bookstore API.
// Property names are camelCase to match ASP.NET Core's default JSON serialization.
export interface Book {
  bookId: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  category: string;
  pageCount: number;
  price: number;
}
