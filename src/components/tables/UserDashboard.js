import React, { useEffect, useState } from "react";
import StatsTable from "./StatsTable";
import ProductsOverviewTable from "./ProductsOverviewTable";
import { getUserByUID } from "../../utils/firebaseActions";


const UserDashboard = (props) => {

    const [user, setUser] = useState(null)

    const fetchLoginedUser = async () => {
        const userData = await getUserByUID(props.user.uid)
        setUser(userData)
    }

    useEffect(() => {
        fetchLoginedUser()
    }, [])

    return (
        <>
            {
                user && <>
                    <StatsTable user={user} />
                    <ProductsOverviewTable user={user} />
                </>
            }
        </>
    );
};

export default UserDashboard;