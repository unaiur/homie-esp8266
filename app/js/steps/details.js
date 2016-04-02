'use strict';

import React from 'react';

export default class DetailsStep extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      showOtaInput: false
    };
  }

  handleOtaChange (e) {
    this.setState({ showOtaInput: e.target.checked });
  }

  handleFormSubmit (e) {
    e.preventDefault();

    let otaCreds = {};
    otaCreds.enabled = false;

    if (this.state.showOtaInput) {
      otaCreds.enabled = true;
      otaCreds.ssl = false;

      otaCreds.host = this.refs.host.value;
      otaCreds.port = parseInt(this.refs.port.value, 10);
      otaCreds.path = this.refs.path.value;
    }

    this.props.setName(this.refs.name.value);
    if (this.refs.deviceId !== '') this.props.setDeviceId(this.refs.name.value);
    this.props.setOtaCreds(otaCreds);

    this.props.nextStep();
  }

  render () {
    return (
      <div className='content'>
        <p>
          A few details before finishing the configuration.
        </p>

        <form onSubmit={ (e) => this.handleFormSubmit(e) }>
          <label className='label' htmlFor='friendly_name'>Friendly name</label>
          <p className='control'>
            <input ref='name' className='input' type='text' placeholder='My awesome device name' id='friendly_name' required />
            <span className='help'>Required.</span>
          </p>

          <label className='label' htmlFor='device_id'>Device ID</label>
          <p className='control'>
            <input ref='deviceId' className='input' type='text' pattern='^(([a-z0-9]|[a-z0-9][a-z0-9\-]*[a-z0-9]))$' placeholder='the-device-id' id='device_id' />
            <span className='help'>Optional. The default value is the hardware device ID. MAY be composed of lowercase letters from <span className='tag'>a</span> to <span className='tag'>z</span>, numbers from <span className='tag'>0</span> to <span className='tag'>9</span>, and it MAY contain <span className='tag'>-</span>, but MUST NOT start or end with a <span className='tag'>-</span></span>
          </p>

          <p className='control'>
            <label className='checkbox'>
              <input ref='ota' type='checkbox' onChange={ (e) => this.handleOtaChange(e) } />
              Enable OTA
            </label>
          </p>

          {(() => {
            if (this.state.showOtaInput) {
              return (
                <div>
                  <label className='label' htmlFor='ota_host'>OTA server host</label>
                  <p className='control'>
                    <input ref='host' className='input' type='text' defaultValue={this.props.mqttConfig.host} placeholder='IP or hostname' id='ota_host' required />
                    <span className='help'>Required.</span>
                  </p>

                  <label className='label' htmlFor='ota_port'>OTA server port</label>
                  <p className='control'>
                    <input ref='port' className='input' type='number' step='1' defaultValue='80' min='1' max='65535' placeholder='Port number' id='ota_port' required />
                    <span className='help'>Required.</span>
                  </p>

                  <label className='label' htmlFor='ota_path'>OTA HTTP path</label>
                  <p className='control'>
                    <input ref='path' className='input' type='text' step='1' defaultValue='/ota' placeholder='HTTP path starting with /' id='ota_path' required />
                    <span className='help'>Required.</span>
                  </p>

                  <br/>
                </div>
              );
            }
          })()}

          <p className='control'>
            <button type='submit' className='button is-primary'>Next</button>
          </p>
        </form>
      </div>
    );
  }
}
DetailsStep.propTypes = {
  nextStep: React.PropTypes.func.isRequired,
  mqttConfig: React.PropTypes.object.isRequired,
  setName: React.PropTypes.func.isRequired,
  setDeviceId: React.PropTypes.func.isRequired,
  setOtaCreds: React.PropTypes.func.isRequired
};
