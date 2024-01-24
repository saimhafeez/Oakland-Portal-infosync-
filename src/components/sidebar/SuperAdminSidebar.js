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
                        <a href="/standard-costs" className="link-light" underline="hover">
                            Standard Costs
                        </a>
                    </li>
                    <li>
                        <a href="/user-management" className="link-light" underline="hover">
                            User Management
                        </a>
                    </li>
                    <li>
                        <a href="/ready-to-live" className="link-light" underline="hover">
                            100% Completed
                        </a>
                    </li>
                    <li>
                        <a href="/reseted" className="link-light" underline="hover">
                            Partial Completed
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
                    <li>
                        <a href="/actual-costs" className="link-light" underline="hover">
                            Actual Costs
                        </a>
                    </li>
                    <li>
                        <a href="/portal-variables" className="link-light" underline="hover">
                            Portal Variables
                        </a>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default SuperAdminSidebar;
