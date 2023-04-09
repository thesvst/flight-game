import { createContext, ReactNode } from "react";

export const StoreContext = createContext(null);


interface StoreProviderProps {
    children: ReactNode;
} 

export const StoreProvider = (props: StoreProviderProps) => {
    return (
        <StoreContext.Provider value={null}>
            {props.children}
        </StoreContext.Provider>
    )
}