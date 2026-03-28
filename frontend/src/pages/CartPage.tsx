import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// Cart page showing all items, quantity controls, subtotals, and a grand total.
// Uses Bootstrap List Group (new Bootstrap feature #2) for structured item display.
function CartPage() {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, updateQuantity, total } = useCart();

    return (
        <div className="container mt-4">
            <h2>Your Cart</h2>

            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <ul className="list-group mb-3">
                    {cartItems.map((item) => (
                        <li
                            key={item.bookId}
                            className="list-group-item d-flex justify-content-between align-items-center"
                        >
                            <div>
                                <strong>{item.title}</strong>
                                <br />
                                <small>${item.price.toFixed(2)} each</small>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <input
                                    type="number"
                                    className="form-control"
                                    style={{ width: '70px' }}
                                    min={1}
                                    value={item.quantity}
                                    onChange={(e) =>
                                        updateQuantity(item.bookId, Number(e.target.value))
                                    }
                                />
                                <span>
                                    Subtotal: ${(item.price * item.quantity).toFixed(2)}
                                </span>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => removeFromCart(item.bookId)}
                                >
                                    Remove
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <h4>Total: ${total.toFixed(2)}</h4>

            {/* Go back to wherever the user was before entering the cart */}
            <button
                className="btn btn-secondary"
                onClick={() => navigate(-1)}
            >
                Continue Shopping
            </button>
        </div>
    );
}

export default CartPage;
