import React, { useEffect } from 'react';
import { Route, useHistory } from 'react-router';
import SafeHOC from '../safe_hoc/SafeHOC';

/**
 * This function runs on every route change by using history.listen
 * I generally use this to make sure the user's session is still valid
 */
const AuthHOC = (props) => {
    const history = useHistory();
    const [isUserLoggedIn, setIsUserLoggedIn] = React.useState(false);
    useEffect(() => {
        return history.listen(async (location) => {
            // console.info('route changed...');
            const res = await fetch('/api/verify-token', {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    authorization: `Bearer ${document.cookie} `,
                },
            });
            if (res.status !== 200) {
                setIsUserLoggedIn(false);
            } else setIsUserLoggedIn(true);
        });
    }, [history]);

    /** Here I can check if the user's logged in, if true, return
     * whatever route he wanted to access, if false return safeHOC
     * that stores public pages */
    if (isUserLoggedIn) {
        return <Route {...props} />;
    } else {
        // history.push('/login');
        return <SafeHOC />;
    }
};

export default AuthHOC;
