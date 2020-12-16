import React, { createContext, useState, useEffect, useMemo, useContext } from "react";
// import { useLocation, useHistory } from "react-router-dom";

// const AuthDataContext = createContext({});

const initialAuthData = { user: null, loaded: false };

const UserBar = props => {
    const [authData, setAuthData] = useState(initialAuthData);

    /* The first time the component is//  rendered, it tries to
     * fetch the auth data from a source, like a cookie or
     * the localStorage.
     */
    useEffect(() => {
        const fetchURL = `/api/user`;
        const fetchAsync = async () => {
            try {
                const res = await fetch(fetchURL)
                if (!res.ok) {
                    console.table(res);
                    console.log(res.text());
                    throw new Error('response not ok');
                }

                const result = await res.json();
                if (result.status === 'ok' && result.user) {
                    setAuthData({...authData, user: result.user, loaded: true});
                } else {
                    setAuthData({...authData, user: null, loaded: true});
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchAsync();
    }, []);

    const logout = async () => {
        const fetchURL = `/api/user/logout`;
        const sendData = {};
        try {
            const r = await fetch(fetchURL, {
                method: 'post',
                body: JSON.stringify(sendData),
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            const data = await r.json();

            if (data.status === 'ok') {
                setAuthData({...authData, user: null});
            } else {
                console.error('unable to logout');
            }
        } catch (error) {
            console.error(error);
        }
    }

    const login = async (sendData) => {
        const fetchURL = `/api/user/login`;
        try {
            const r = await fetch(fetchURL, {
                method: 'post',
                body: JSON.stringify(sendData),
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const data = await r.json();
            if (data.status === 'ok') {
                setAuthData({...authData, user: data.user});
            }
        } catch (error) {
            console.error(error);
        }
    }

    return <div>
        { authData.user
            ? <>
                <span>{ `Hi, ${JSON.stringify(authData.user)}`}</span>
                <button onClick={logout}>Logout</button>
              </>
            : <button onClick={() => login({user: 'placeholder'})}>Login</button>
        }
    </div>
};

export {UserBar};
