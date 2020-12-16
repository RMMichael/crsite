import React, {useEffect, useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import star from '@material-ui/icons/Star'
import Container from '@material-ui/core/Container';
import {apiBase} from "./utils";
import { Redirect, useLocation } from 'react-router-dom';
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import {useAuthDataContext} from "./AuthDataProvider";
import { rootPath } from "./utils";


const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

function LogIn() {
    const classes = useStyles();

    const { user, login } = useAuthDataContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState('');
    const [error, setError] = useState(null);
    const location = useLocation();

    function handleSubmit(e) {
        let response = window.grecaptcha.getResponse();
        e.preventDefault();
        let sendData = {
            email: email,
            password: password,
            response: response
        };
        login(sendData).then(data => {
            setError(data.errors);
            window.grecaptcha.reset();
            setStatus(data.status);
        });
    }
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://www.google.com/recaptcha/api.js";
        script.async = true;
        document.body.append(script);
    }, []);

    // TODO find a better way. dashboard does not redirect. instead,
    // EmployeeRoute for dashboard simply does not render login when user.role is EMPLOYEE,
    if (status === 'ok' && user && location.pathname !== `/_dashboard`) {
        return <Redirect to={"/"} />;
    }

    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form onSubmit={handleSubmit} className={classes.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        // TODO FOR EMPLOYEE DASHBOARD ONLY
                        error={location.pathname === `/_dashboard`}
                        helperText={location.pathname === `/_dashboard` &&
                        `You must be an employee to see this page.`
                        }
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        error={status === 'error'}
                        helperText={error && error.password}
                    />
                    <FormControl>
                        <div className="g-recaptcha" data-sitekey="6LdMkPEUAAAAAOoL46R5okKvQ3hDW50Urs_el6gR">
                        </div>
                        <FormHelperText error={true}>
                            {(error && error.recaptcha) || " "}
                        </FormHelperText>
                    </FormControl>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign In
                    </Button>
                </form>
            </div>
        </Container>
    );
}


export { LogIn as default }
