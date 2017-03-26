/*global FB*/
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Main from './Main';
import Login from './Login';
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
class App extends Component {
    constructor() {
        super();
        this.state = {
            loggedIn: false,
            loading: true,
            isExecutingTests: false
        };
    }

    loadUser() {
        FB.getLoginStatus(async (response) => {
            if (response.status === 'connected') {
                const accessToken = response.authResponse.accessToken;
                if (response.authResponse) {
                    const user = await this.fetchUser(accessToken);
                    user.accessToken = accessToken;
                    this.setState({ user, loggedIn: true, loading: false });
                }
                else {
                    NotificationManager.error(
                        'The person is not logged into Facebook. Please log into Facebook.', 'Login problem.', 60 * 1000);
                }
            }
        });
    }


    fetchUser(accessToken) {
        return fetch('/api/attempts/' + accessToken)
            .then(handleErrors)
            .then(function (response) {
                return response.json();
            });

        function handleErrors(response) {
            if (!response.ok) {
                NotificationManager.error(
                    'Try once again later. If the problem persists, please contact your teacher.', 'Fetching user data failed.', 60 * 1000);
                throw Error(response.statusText);
            }
            return response;
        }
    }

    //Copy-paste from SO
    componentDidMount() {
        window.fbAsyncInit = function () {
            FB.init({
                appId: '1410804352326073',
                cookie: true,  // enable cookies to allow the server to access
                // the session
                xfbml: true,  // parse social plugins on this page
                version: 'v2.4' // use version 2.1
            });

            // Now that we've initialized the JavaScript SDK, we call
            // FB.getLoginStatus().  This function gets the state of the
            // person visiting this page and can return one of three states to
            // the callback you provide.  They can be:
            //
            // 1. Logged into your app ('connected')
            // 2. Logged into Facebook, but not your app ('not_authorized')
            // 3. Not logged into Facebook and can't tell if they are logged into
            //    your app or not.
            //
            // These three cases are handled in the callback function.
            FB.getLoginStatus(function (response) {
                this.statusChangeCallback(response);
            }.bind(this));
        }.bind(this);

        // Load the SDK asynchronously
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }

    // This is called with the results from from FB.getLoginStatus().
    statusChangeCallback(response) {
        if (response.status === 'connected') {
            // Logged into your app and Facebook.
            //this.testAPI();
            this.loadUser();
        } else if (response.status === 'not_authorized') {
            // The person is logged into Facebook, but not your app.
            NotificationManager.error(
                'Not authorized.', 'Not authorized.', 60 * 1000);
            this.setState({ loggedIn: false, loading: false });
        } else {
            // The person is not logged into Facebook, so we're not sure if
            // they are logged into this app or not.
            NotificationManager.error(
                'The person is not logged into Facebook. Please log into Facebook.', 'Login problem.', 60 * 1000);
            this.setState({ loggedIn: false, loading: false });
        }
    }
    async handleTestingFinished() {
        const user = await this.fetchUser(this.state.user.accessToken);
        user.accessToken = this.state.user.accessToken;
        this.setState({
            user: { ...user, attempts: user.attempts },
            loggedIn: true,
            isExecutingTests: false
        });

        NotificationManager.success('Done!');
    }
    handleTestingFailed() {
        this.setState({
            isExecutingTests: false
        });
        NotificationManager.error(
            'Try once again later. If the problem persists, please contact your teacher.', 'Sorry, our server is in trouble.', 60 * 1000);
    }
    handleTestingStarted() {
        this.setState({ isExecutingTests: true });
    }

    // This function is called when someone finishes with the Login
    // Button.  See the onlogin handler attached to it in the sample
    // code below.
    checkLoginState() {
        FB.getLoginStatus(response => this.statusChangeCallback(response));
    }

    handleClick() {
        FB.login(this.statusChangeCallback.bind(this));
    }
    handleLogout() {
        FB.logout(r => this.setState({ loggedIn: false }));
    }
    //End of copy-paste

    render() {
        //http://stackoverflow.com/questions/32070227/reactjs-facebook-sdk-login-button-not-showing-up-the-second-time  
        return (
            <div className="container">
                {
                    this.state.loading
                        ? <h1>Loading...</h1>
                        : <Router>
                            <div>
                                <Route exact={true} path='/' render={() => <Redirect to="/main" />} />
                                <Route path='/login' render={() => (
                                    this.state.loggedIn
                                        ? <Redirect to="/main" />
                                        : <Login onClick={this.handleClick.bind(this)} />)} />

                                <Route path='/main' render={() => (
                                    this.state.loggedIn
                                        ? <div>
                                            <Main
                                                onLogout={this.handleLogout.bind(this)}
                                                user={this.state.user}
                                                isExecutingTests={this.state.isExecutingTests}
                                                onTestingStarted={this.handleTestingStarted.bind(this)}
                                                onTestingFinished={this.handleTestingFinished.bind(this)}
                                                onTestingFailed={this.handleTestingFailed.bind(this)} />
                                        </div>
                                        : <Redirect to="/login" />
                                )} />
                            </div>
                        </Router>
                }
                <NotificationContainer />
            </div>
        );
    }
}

export default App;