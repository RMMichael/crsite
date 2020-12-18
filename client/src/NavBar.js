import React, { createContext, useState, useEffect, useMemo, useContext } from "react";
import {makeStyles} from "@material-ui/core/styles";
import MLink from "@material-ui/core/Link";
import {Link, useLocation, useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

// const AuthDataContext = createContext({});

const initialAuthData = { user: null, loaded: false };

const useStyles = makeStyles((theme) => ({
  bar: {
    width: '100%',
    display: 'flex',
    alignItems: 'left',
  },
  // push: {
  //   fontWeight: 500,
  //   marginLeft: 'auto',
  //   textDecoration: 'none',
  //   fontSize: 30,
  // },
  // link: {
  //   top: '50%',
  //   left: '50%',
  //   fontWeight: 500,
  //   textDecoration: 'none',
  //   fontSize: 30
  // },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  button: {
    fontSize: 30,
  },
}));
const NavBar = props => {
  const [authData, setAuthData] = useState(initialAuthData);
  const classes = useStyles();

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

  return (<>
    {/*<div className={classes.bar}>*/}
    {/*      <Link to={'/'} className={classes.link}>Home</Link>*/}
    {/*      <Link to={'/profile'} className={classes.push}>Profile</Link>*/}
    {/*      <Button className={classes.button} onClick={logout}>Logout</Button>*/}
    {/*    </div>*/}
      <AppBar position="static" color="default" elevation={0} className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <MLink variant="button" color="textPrimary" href="/" className={classes.toolbarTitle}>
          <Typography variant="h6" color="inherit" noWrap className={classes.link}>
            Home
          </Typography>
          </MLink>
          <nav>
            {authData.user &&
            <MLink variant="button" color="textPrimary" href="/profile" className={classes.link}>
              Profile
            </MLink>}

          </nav>
          { authData.user
              ? <Button href="#" color="primary" variant="outlined" className={classes.link}
                  onClick={() => logout()}
                >
                  Logout
                </Button>
              : <Button href="#" color="primary" variant="outlined" className={classes.link}
                        onClick={() => login({user: 'placeholder'})}
                >
                  Login
                </Button>
          }
        </Toolbar>
      </AppBar>
  </>);
};

export {NavBar};
