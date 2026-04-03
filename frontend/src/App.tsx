import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import AdminBooksPage from './pages/AdminBooksPage';
import BooksPage from './pages/BooksPage';
import CartPage from './pages/CartPage';

// Root component — CartProvider wraps Router so cart state is available on all routes.
function App() {
    return (
        <CartProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<BooksPage />} />
                    <Route path="/books" element={<BooksPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/adminbooks" element={<AdminBooksPage />} />
                </Routes>
            </Router>
        </CartProvider>
    );
}

export default App;
