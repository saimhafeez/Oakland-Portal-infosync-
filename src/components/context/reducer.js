import { initialState } from "./appContext"

const reducer = (state, action) => {

    if (action.type == "LOGOUT_USER") {
        return {
            ...initialState,
            user: null,
            token: null,
            showAlert: 'true',
            alertStatus: 'info',
            alertText: 'User Logged Out'
        }
    }

    throw new Error(`no such action: ${action.type}`)
}

export default reducer