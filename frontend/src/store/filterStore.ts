import { create } from 'zustand';
import { immer } from "zustand/middleware/immer";
import { persist, createJSONStorage } from "zustand/middleware";

interface State {
    categories: string[],
    types: string[]
}

interface Actions {
    setFilters: (categories: string[], types: string[]) => void,
    clearFilters: () => void
}

const initialState: State = {
    categories: [],
    types: []
}

const useFilterStore = create<State & Actions>()(
    persist(
        immer((set) => ({
            ...initialState,
            setFilters: (categories, types) => set(state => {
                state.categories = categories
                state.types = types
            }),
            clearFilters: () => set(initialState)
        })),
        {
            name: 'filter-storage',
            storage: createJSONStorage(() => sessionStorage)
        }
    )
)

export default useFilterStore