'use strict';

import React from 'react';

export default class MqttStep extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      showLoginInput: false,
      showPassword: false
    };
  }

  handleAuthChange (e) {
    this.setState({ showLoginInput: e.target.checked });
  }

  handleHiddenChange (e) {
    this.setState({ showPassword: e.target.checked });
  }

  handleFormSubmit (e) {
    e.preventDefault();

    let creds = {};
    creds.host = this.refs.host.value;
    creds.port = parseInt(this.refs.port.value, 10);
    if (this.refs.baseTopic.value !== '') creds['base_topic'] = this.refs.baseTopic.value;

    creds.ssl = false;

    creds.auth = false;

    if (this.state.showLoginInput) {
      creds.auth = true;
      creds.username = this.refs.username.value;
      creds.password = this.refs.password.value;
    }

    this.props.setMqttCreds(creds);
    this.props.nextStep();
  }

  render () {
    return (
      <div className='content'>
        <p>
          Enter the MQTT credentials.
        </p>

        <form onSubmit={ (e) => this.handleFormSubmit(e) }>
          <label className='label' htmlFor='mqtt_broker_address'>MQTT broker address</label>
          <p className='control'>
            <input ref='host' className='input' type='text' placeholder='IP or hostname' id='mqtt_broker_address' required />
            <span className='help'>Required.</span>
          </p>

          <label className='label' htmlFor='mqtt_broker_port'>MQTT broker port</label>
          <p className='control'>
            <input ref='port' className='input' type='number' step='1' defaultValue='1883' min='1' max='65535' placeholder='Port number' id='mqtt_broker_port' required />
            <span className='help'>Required.</span>
          </p>

          <label className='label' htmlFor='homie_base_topic'>Homie base topic</label>
          <p className='control'>
            <input ref='baseTopic' className='input' type='text' placeholder='Base topic' id='homie_base_topic' />
            <span className='help'>Optional. The default value is <span className='tag'>devices/</span>.</span>
          </p>

          <p className='control'>
            <label className='checkbox'>
              <input ref='auth' type='checkbox' onChange={ (e) => this.handleAuthChange(e) } />
              Use MQTT authentication
            </label>
          </p>

          {(() => {
            if (this.state.showLoginInput) {
              return (
                <div>
                  <label className='label' htmlFor='mqtt_username'>MQTT username</label>
                  <p className='control'>
                    <input ref='username' className='input' type='text' placeholder='Username' id='mqtt_username' required />
                    <span className='help'>Required.</span>
                  </p>

                  <label className='label' htmlFor='mqtt_password'>MQTT password</label>
                  <p className='control is-grouped'>
                    <input ref='password' className='input' type={ this.state.showPassword ? 'text' : 'password' } placeholder='Password' id='mqtt_password' required />
                    <label className='checkbox'>
                      <input type='checkbox' onChange={ (e) => this.handleHiddenChange(e) } />
                      Show password
                    </label>
                  </p>
                  <span className='help'>Required.</span>

                  <br/>
                </div>
              );
            }
          })()}

          <p className='control'>
            <button type='submit' disabled={ this.state.buttonDisabled } className='button is-primary'>Next</button>
          </p>
        </form>
      </div>
    );
  }
}
MqttStep.propTypes = {
  nextStep: React.PropTypes.func.isRequired,
  setMqttCreds: React.PropTypes.func.isRequired
};
