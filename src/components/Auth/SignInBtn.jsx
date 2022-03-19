import React, { useState } from "react";
import { login, logout } from '../../utils';

export default function SignInbtn() {
    const [user, setUser] = useState(window.accountId);

    const handleSignOut = () => {
        logout();
        setUser(window.accountId);
    };

    if (!window.walletConnection.isSignedIn()) {
        return (
            <button onClick={login} className="inline-flex items-center bg-gray-200 border-0 py-1 px-3 focus:outline-none hover:bg-gray-300 rounded text-base mt-4 md:mt-0">Sign in</button>
        )
    }

    return (
        <button onClick={handleSignOut} className="inline-flex items-center bg-gray-200 border-0 py-1 px-3 focus:outline-none hover:bg-gray-300 rounded text-base mt-4 md:mt-0"><span className="font-semibold">{user}</span> - Logout</button>
    )
}