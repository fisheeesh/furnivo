import { create } from 'zustand';
import { immer } from "zustand/middleware/immer";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    avatar: string
}

interface State {
    user: User
}

interface Actions {
    setUser: (user: User) => void,
    clearUser: () => void
}

const initialState: State = {
    user: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        avatar: ""
    }
}

const useUserStore = create<State & Actions>()(
    persist(
        immer((set) => ({
            ...initialState,
            setUser: (user) => set(state => {
                state.user = user
            }),
            clearUser: () => set(initialState)
        })),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => sessionStorage)
        }
    )
)

export default useUserStore