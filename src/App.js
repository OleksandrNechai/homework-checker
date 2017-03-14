/*global FB*/
import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
// interesting SO reagarding implementation http://stackoverflow.com/questions/27717555/implement-facebook-api-login-with-reactjs/31859302;

class App extends Component {

    pingServer() {
        this.props.fb.getLoginStatus((response) => {
            if (response.status === 'connected') {
                const accessToken = response.authResponse.accessToken;
                if (response.authResponse) {
                    console.log('Welcome!  Fetching your information.... ');
                    this.props.fb.api('/me', { fields: 'name,email,id' }, function (response) {
                        console.log('Good to see you, ' + response.name + '.');
                        fetch('/api/login', {
                            method: 'POST',
                            body: JSON.stringify({ ...response, accessToken }),
                            headers: {
                                accept: 'application/json',
                                "content-type": "application/json"
                            }
                        }).then(response => console.log(response));
                    });
                }
                else {
                    console.log("not logged in");
                }
            }
        });
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

    // Here we run a very simple test of the Graph API after login is
    // successful.  See statusChangeCallback() for when this call is made.
    testAPI() {
        console.log('Welcome!  Fetching your information.... ');
        FB.api('/me', function (response) {
            console.log('Successful login for: ' + response.name);
        });
    }

    // This is called with the results from from FB.getLoginStatus().
    statusChangeCallback(response) {
        console.log('statusChangeCallback');
        console.log(response);
        // The response object is returned with a status field that lets the
        // app know the current login status of the person.
        // Full docs on the response object can be found in the documentation
        // for FB.getLoginStatus().
        if (response.status === 'connected') {
            // Logged into your app and Facebook.
            this.testAPI();
        } else if (response.status === 'not_authorized') {
            // The person is logged into Facebook, but not your app.
            console.log('Not authorized');
        } else {
            // The person is not logged into Facebook, so we're not sure if
            // they are logged into this app or not.
            console.log('The person is not logged into Facebook. Please log into Facebook.');
        }
    }

    // This function is called when someone finishes with the Login
    // Button.  See the onlogin handler attached to it in the sample
    // code below.
    checkLoginState() {
        FB.getLoginStatus(response => this.statusChangeCallback(response));
    }

    handleClick() {
        FB.login(this.checkLoginState());
    }
    //End of copy-paste

    render() {

        //http://stackoverflow.com/questions/32070227/reactjs-facebook-sdk-login-button-not-showing-up-the-second-time  
        return (
            <div>
                <Button bsStyle="primary" bsSize="large" onClick={this.handleClick.bind(this)}>Login</Button>
            </div>
        );
    }
}

export default App;