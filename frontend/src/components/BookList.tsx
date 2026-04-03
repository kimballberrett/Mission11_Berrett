import { useEffect, useState } from 'react';
import type { Book } from '../types/Book';
import { useCart } from '../context/CartContext';

// Displays a paginated, sortable table of books filtered by the selected categories.
function BookList({ selectedCategories }: { selectedCategories: string[] }) {
    const [books, setBooks] = useState<Book[]>([]);
    const [pageSize, setPageSize] = useState<number>(5);
    const [pageNum, setPageNum] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [sortOrder, setSortOrder] = useState<string>('asc');
    const [error, setError] = useState<string | null>(null);

    const { addToCart } = useCart();

    // Reset to page 1 whenever the category filter changes.
    useEffect(() => {
        setPageNum(1);
    }, [selectedCategories]);

    // Fetch books whenever page, page size, sort order, or category filter changes.
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const categoryParams = selectedCategories
                    .map((cat) => `categories=${encodeURIComponent(cat)}`)
                    .join('&');

                const url = `https://mission13-berrett-backend.azurewebsites.net/Book/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&sortOrder=${sortOrder}${selectedCategories.length ? `&${categoryParams}` : ''}`;

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`);
                }
                const data = await response.json();
                setBooks(data.books);
                setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
                setError(null);
            } catch (err) {
                console.error('Error fetching books:', err);
                setError('Unable to load books. Please make sure the server is running.');
            }
        };

        fetchBooks();
    }, [pageSize, pageNum, sortOrder, selectedCategories]);

    // Show a friendly error message if the API call failed.
    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <>
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

            {/* Book data table styled with Bootstrap — responsive wrapper prevents overflow */}
            <div className="table-responsive">
                <table className="table table-striped table-bordered table-sm">
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
                            <th>Cart</th>
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
                                <td>
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={() =>
                                            addToCart({
                                                bookId: b.bookId,
                                                title: b.title,
                                                price: b.price,
                                                quantity: 1,
                                            })
                                        }
                                    >
                                        Add to Cart
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

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
                        setPageNum(1);
                    }}
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                </select>
            </label>
        </>
    );
}

export default BookList;
