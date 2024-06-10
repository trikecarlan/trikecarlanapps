// store.ts
import { create } from 'zustand';

export interface Driver {
    address: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: string;
    age?: number;
    gender?: string;
    sideCartNumber?: string;
    toda?: string;
    profile?: string;
}

interface State {
    driver: Driver;
    setDriver: (driver: Driver) => void;
    updateDriver: (updatedFields: Partial<Driver>) => void;
}

const initialDriver: Driver = {
    address: '',
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: '',
    age: 0,
    gender: '',
    sideCartNumber: '',
    toda: '',
    profile: ''
};
// this store will store the info to be reported
export const useStoreDriver = create<State>((set) => ({
    driver: initialDriver,
    setDriver: (driver: Driver) => set({ driver }),
    updateDriver: (updatedFields: Partial<Driver>) =>
        set((state) => ({ driver: { ...state.driver, ...updatedFields } })),
}));


export interface User {
    address: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: string;
    age: number;
    gender: string;
    sideCartNumber?: string;
    toda?: string;
    profile?: string;
}

interface UserState {
    user: User;
    setUser: (user: User) => void;
    updateUser: (updatedUserFields: Partial<User>) => void;
}

const initialUser: User = {
    address: '',
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: '',
    age: 0,
    gender: '',
    profile: '',
    sideCartNumber: '',
    toda: ''
};

export const useStoreUser = create<UserState>((set) => ({
    user: initialUser,
    setUser: (user: User) => set({ user }),
    updateUser: (updatedUserFields: Partial<User>) =>
        set((state) => ({ user: { ...state.user, ...updatedUserFields } })),
}));
