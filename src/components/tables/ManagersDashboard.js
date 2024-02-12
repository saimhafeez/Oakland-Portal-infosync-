import React, { useEffect, useState } from "react";
import StatsTable from "./StatsTable";
import ProductsOverviewTable from "./ProductsOverviewTable";
import { getUserByUID } from "../../utils/firebaseActions";
import ManagerStatsTable from "./ManagerStatsTable";
import ProductOverTableManager from "./ProductOverTableManager";


const ManagersDashboard = (props) => {

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
                    <ManagerStatsTable user={user} />
                    <ProductOverTableManager user={user} />
                </>
            }
        </>
    );
};

export default ManagersDashboard;