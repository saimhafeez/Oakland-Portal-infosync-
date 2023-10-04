import React from 'react'
import { authData } from '../authData'
import { useNavigate } from 'react-router-dom'

const PublicRoutes = ({ children }) => {
    
    const navigate = useNavigate();
    const {isAuthenticated, isActivated} = authData;

    if(isAuthenticated && isActivated) {
        return navigate('/extraction')
    }

    return children
}

export default PublicRoutes