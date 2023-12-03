import React, { useContext, useReducer } from 'react';
import axios from 'axios'

import reducer from "./reducer";


const user = localStorage.getItem('user');
const token = localStorage.getItem('token');
const cart = localStorage.getItem('cart');

const initialState = {
    user: user ? JSON.parse(user) : null,
    token: token,
}


const AppContext = React.createContext();

const AppProvider = (({ children }) => {

    const [state, dispatch] = useReducer(reducer, initialState);

    const logoutUser = () => {
        dispatch({ type: "LOGOUT_USER" })
        removeUserFromLocalStorage();
    }

    const loginUser = (user, userRole, userEmail, userJdesc) => {
        dispatch({ type: "LOGOUT_USER" })
        removeUserFromLocalStorage();
    }

    const addUserToLocalStorage = ({ user, token }) => {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
    }

    const removeUserFromLocalStorage = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }


    return <AppContext.Provider value={{
        ...state,
        logoutUser,
        loginUser
    }}>
        {children}
    </AppContext.Provider>

})

const useAppContext = () => {
    return useContext(AppContext);
}

export { AppProvider, initialState, useAppContext }