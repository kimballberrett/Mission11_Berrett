import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { CartItem } from '../types/CartItem';

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (bookId: number) => void;
    updateQuantity: (bookId: number, quantity: number) => void;
    total: number;
    totalQuantity: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Provides global cart state to all child components.
export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // Add a book to the cart; if already present, increment its quantity.
    const addToCart = (item: CartItem) => {
        setCartItems((prev) => {
            const existing = prev.find((c) => c.bookId === item.bookId);
            if (existing) {
                return prev.map((c) =>
                    c.bookId === item.bookId
                        ? { ...c, quantity: c.quantity + item.quantity }
                        : c
                );
            }
            return [...prev, item];
        });
    };

    // Remove a book from the cart entirely.
    const removeFromCart = (bookId: number) =>
        setCartItems((prev) => prev.filter((c) => c.bookId !== bookId));

    // Update quantity for a cart item; remove it if quantity drops to 0 or below.
    const updateQuantity = (bookId: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(bookId);
        } else {
            setCartItems((prev) =>
                prev.map((c) => (c.bookId === bookId ? { ...c, quantity } : c))
            );
        }
    };

    // Derived values — computed from cartItems so they always stay in sync.
    const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                total,
                totalQuantity,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};
