import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {UserBar} from "./user";
import {Route, Switch, BrowserRouter} from "react-router-dom";
import {BrowseTable} from "./BrowseTable";
import CssBaseline from "@material-ui/core/CssBaseline";
import {Container} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { Home } from "./Home";
import {NavBar} from "./NavBar";
import { CourseReviews, InstructorReviews } from "./Reviews";

ReactDOM.render(
    <React.StrictMode>
        <CssBaseline />
        <BrowserRouter>
            <NavBar />
            <Switch>
                <Route path={"/asdf"}>
                    <div>asdf</div>
                </Route>
                <Route path={"/course/:courseLabel"}>
                    <CourseReviews />
                </Route>
                <Route path={"/instructor/:name"}>
                    <InstructorReviews />
                </Route>
                <Route path={"/"}>
                    <Home />
                </Route>
            </Switch>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);

