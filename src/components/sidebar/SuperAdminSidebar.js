import { Link } from "@mui/material";
import React from "react";

const SuperAdminSidebar = () => {
    return (
        <>
            <div className="set-max-width-252">
                <ul>
                    <li>
                        <Link href="/dashboard" color='white' underline="hover">
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link href="/ingredients" color='white' underline="hover">
                            Ingredients Management
                        </Link>
                    </li>
                    <li>
                        <Link href="/user-management" color='white' underline="hover">
                            User Management
                        </Link>
                    </li>
                    <li>Role Assigning</li>
                    <li>Rejected NADs</li>
                    <li>All QA Passed</li>
                </ul>
            </div>
        </>
    );
};

export default SuperAdminSidebar;
