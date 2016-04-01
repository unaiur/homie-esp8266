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
          <p className='control'>
            <input ref='name' className='input' type='text' placeholder='Friendly name of the device' required />
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
                  <p className='control'>
                    <input ref='host' className='input' type='text' defaultValue={this.props.mqttConfig.host} placeholder='OTA server host' required />
                  </p>

                  <p className='control'>
                    <input ref='port' className='input' type='number' step='1' defaultValue='80' min='1' max='65535' placeholder='OTA server port' required />
                  </p>

                  <p className='control'>
                    <input ref='path' className='input' type='text' step='1' defaultValue='/ota' placeholder='OTA path' required />
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
  setOtaCreds: React.PropTypes.func.isRequired
};
