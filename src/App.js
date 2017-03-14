import React, { Component } from 'react';
// interesting SO reagarding implementation http://stackoverflow.com/questions/27717555/implement-facebook-api-login-with-reactjs/31859302;


class Button extends React.Component {
    render() {
        return (<div className="fb-login-button" data-max-rows="1" data-size="xlarge" data-show-faces="false" data-auto-logout-link="true"></div>);
    }
}

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
    render() {

        //http://stackoverflow.com/questions/32070227/reactjs-facebook-sdk-login-button-not-showing-up-the-second-time  
        return (
            <div>
                <Button />
            </div>
        );
    }
}

export default App;