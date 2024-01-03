import React from "react";

const SuperAdminSidebar = () => {
    return (
        <>
            <div className="set-max-width-252">
                <ul>
                    <li>
                        <a href="/dashboard" className="link-light" underline="hover">
                            Dashboard
                        </a>
                    </li>
                    <li>
                        <a href="/ingredients" className="link-light" underline="hover">
                            Ingredients Management
                        </a>
                    </li>
                    <li>
                        <a href="/user-management" className="link-light" underline="hover">
                            User Management
                        </a>
                    </li>
                    <li>
                        <a href="/ready-to-live" className="link-light" underline="hover">
                            Ready to Live
                        </a>
                    </li>
                    <li>
                        <a href="/all-nads" className="link-light" underline="hover">
                            NADs
                        </a>
                    </li>
                    <li>
                        <a href="/not-understandables" className="link-light" underline="hover">
                            NOT UNDERSTANDABLEs
                        </a>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default SuperAdminSidebar;
