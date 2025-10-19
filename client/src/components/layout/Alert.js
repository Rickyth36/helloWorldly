// Alert.js
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

export const Alert = ({ alerts }) => (
  <div className="alert-container">
    {alerts !== null &&
      alerts.map(alert => (
        <div key={alert.id} className={`alert alert-${alert.alertType}`}>
          {alert.msg}
        </div>
      ))}
  </div>
);

Alert.propTypes = {
  alerts: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  alerts: state.alert
});

export default connect(mapStateToProps)(Alert);
