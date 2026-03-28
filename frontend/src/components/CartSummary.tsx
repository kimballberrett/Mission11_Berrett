import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// Fixed-position cart indicator shown on every page.
// Uses Bootstrap Badge (new Bootstrap feature #1) to display item count.
// Clicking navigates to the cart page.
const CartSummary = () => {
    const navigate = useNavigate();
    const { total, totalQuantity } = useCart();

    return (
        <div
            style={{
                position: 'fixed',
                top: '10px',
                right: '20px',
                background: '#f8f9fa',
                padding: '10px 15px',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                zIndex: 1000,
            }}
            onClick={() => navigate('/cart')}
        >
            Cart <span className="badge bg-primary">{totalQuantity}</span>
            {' | '}
            <strong>${total.toFixed(2)}</strong>
        </div>
    );
};

export default CartSummary;
