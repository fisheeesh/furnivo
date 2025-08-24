import { create } from 'zustand';
import { immer } from "zustand/middleware/immer";
import { persist, createJSONStorage } from "zustand/middleware";

interface CartItem {
    id: number,
    name: string,
    price: number,
    quantity: number,
    image: string
}

interface CartState {
    carts: CartItem[]
}

interface CartActions {
    getTotalItems: () => number
    getTotalPrice: () => number
    addItem: (item: CartItem) => void
    updateItem: (id: number, quantity: number) => void
    increaseQuantity: (id: number) => void
    decreaseQuantity: (id: number) => void
    removeItem: (id: number) => void
    clearCart: () => void
}

const initialState: CartState = {
    carts: []
}

const useCartStore = create<CartState & CartActions>()(
    persist(
        immer((set, get) => ({
            ...initialState,
            getTotalItems: () => {
                const { carts } = get()
                return carts.reduce((acc, cur) => acc + cur.quantity, 0)
            },
            getTotalPrice: () => {
                const { carts } = get()
                return carts.reduce((acc, cur) => acc + cur.price * cur.quantity, 0)
            },
            addItem: (item) => set(state => {
                const existingItem = state.carts.find(i => i.id === item.id)
                if (existingItem) {
                    existingItem.quantity = item.quantity || 1
                } else {
                    state.carts.push({ ...item, quantity: item.quantity || 1 })
                }
            }),
            increaseQuantity: (id) => set(state => {
                const item = state.carts.find(i => i.id === id)
                if (item) {
                    item.quantity++
                }
            }),
            decreaseQuantity: (id) => set(state => {
                const item = state.carts.find(i => i.id === id)
                if (item) {
                    if (item.quantity === 1) {
                        state.carts = state.carts.filter(i => i.id !== id)
                    } else item.quantity--
                }
            }),
            updateItem: (id, quantity) => set(state => {
                const item = state.carts.find(i => i.id === id)
                if (item) {
                    item.quantity = quantity
                }
            }),
            removeItem: (id) => set(state => {
                state.carts = state.carts.filter(item => item.id !== id)
            }),
            clearCart: () => set(initialState)
        })),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => sessionStorage)
        }
    )
)

export default useCartStore