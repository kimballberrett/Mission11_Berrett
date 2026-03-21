import { useEffect, useState } from 'react';
import type { Book } from './types/Book';

// Displays a paginated, sortable table of all books from the Bookstore API.
function BookList() {
    const [books, setBooks] = useState<Book[]>([]);
    const [pageSize, setPageSize] = useState<number>(5);     // Number of books per page
    const [pageNum, setPageNum] = useState<number>(1);       // Current page
    const [totalPages, setTotalPages] = useState<number>(0); // Total pages based on result count
    const [sortOrder, setSortOrder] = useState<string>('asc'); // Sort direction: 'asc' or 'desc'

    // Fetch books whenever page, page size, or sort order changes
    useEffect(() => {
        const fetchBooks = async () => {
            const response = await fetch(
                `http://localhost:4000/Book/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&sortOrder=${sortOrder}`
            );
            const data = await response.json();
            setBooks(data.books);
            setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
        };

        fetchBooks();
    }, [pageSize, pageNum, sortOrder]);

    return (
        <>
            <div className="container mt-4">
                <h1>Bookstore</h1>
                <br />

                {/* Toggle sort direction and reset to page 1 */}
                <button
                    className="btn btn-secondary mb-3"
                    onClick={() => {
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        setPageNum(1);
                    }}
                >
                    Sort by Title ({sortOrder === 'asc' ? 'A → Z' : 'Z → A'})
                </button>

                {/* Book data table styled with Bootstrap */}
                <table className="table table-striped table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Publisher</th>
                            <th>ISBN</th>
                            <th>Classification</th>
                            <th>Category</th>
                            <th>Pages</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((b) => (
                            <tr key={b.bookId}>
                                <td>{b.title}</td>
                                <td>{b.author}</td>
                                <td>{b.publisher}</td>
                                <td>{b.isbn}</td>
                                <td>{b.classification}</td>
                                <td>{b.category}</td>
                                <td>{b.pageCount}</td>
                                <td>${b.price.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination controls: previous, numbered pages, next */}
                <button
                    className="btn btn-outline-primary btn-sm"
                    disabled={pageNum === 1}
                    onClick={() => setPageNum(pageNum - 1)}
                >
                    Previous
                </button>

                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index + 1}
                        className={`btn btn-sm mx-1 ${pageNum === index + 1 ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setPageNum(index + 1)}
                        disabled={pageNum === index + 1}
                    >
                        {index + 1}
                    </button>
                ))}

                <button
                    className="btn btn-outline-primary btn-sm"
                    disabled={pageNum === totalPages}
                    onClick={() => setPageNum(pageNum + 1)}
                >
                    Next
                </button>

                <br />
                <br />

                {/* Allow user to change how many results appear per page */}
                <label>
                    Results per page:
                    <select
                        className="form-select d-inline-block w-auto ms-2"
                        value={pageSize}
                        onChange={(p) => {
                            setPageSize(Number(p.target.value));
                            setPageNum(1); // Reset to first page when page size changes
                        }}
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                    </select>
                </label>
            </div>
        </>
    );
}

export default BookList;
