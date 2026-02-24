import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [cartTotal, setCartTotal] = useState(0);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
        calculateTotal();
    }, [cart]);

    const calculateTotal = () => {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setCartTotal(total);
    };

    const addToCart = (food, quantity = 1) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === food.id);
            
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === food.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            
            return [...prevCart, {
                id: food.id,
                name: food.name,
                price: parseFloat(food.price),
                image: food.image,
                quantity
            }];
        });
    };

    const removeFromCart = (foodId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== foodId));
    };

    const updateQuantity = (foodId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(foodId);
            return;
        }
        
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === foodId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const value = {
        cart,
        cartTotal,
        cartItemCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export default CartContext;
