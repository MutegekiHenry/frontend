import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import moment from 'moment';

import { BASE_URL, PROXY_URL } from '../../../../../../config';
import UserResourceUsage from './components/user_resource_usage/userResourceUsage';
import Spinner from '../../../../../common/Spinner';
import * as orgActions from '../../../../../../redux/actions/user_dashboard_actions/organizationActions';

import './LandingContent.css';

class LandingContent extends Component {
  state = {
    deploymentsListVisible: false,
    organizationsListVisible: false,
    organizationsArray: [],
    deploymentsArray: [],
    spinner: true,
    loadingError: ''
  }

  componentWillReceiveProps(props) {
    this.setState({
      organizationsArray: props.organizations
    });
  }

  componentDidMount() {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.props.token}`
      }
    };
    axios.get(`${PROXY_URL}${BASE_URL}/user/get/organisations`, config)
      .then((response) => {
        if (response.data.message === 'Not registered user') {
          this.setState({
            spinner: false,
            loadingError: response.data.message
          });
        } else {
          this.props.storeOrganizations(response.data);
          this.setState({ spinner: false });
        }
      })

      .catch((error) => {
        console.log(error.stack);
        if (error.response && error.response.data && error.response.data.message) {
          this.setState({
            spinner: false,
            loadingError: error.response.data.message
          });
        } else if (error.response && error.response.statusText) {
          this.setState({
            spinner: false,
            loadingError: `Error ocuured: ${error.response.statusText}. Please try again`
          });
        } else {
          this.setState({
            spinner: false,
            loadingError: `Error occured: ${error.message}. Please try again`
          });
        }
      });
  }

  toggleOrganizations = () => {
    const status = this.state.organizationsListVisible;
    this.setState({ organizationsListVisible: !status });
  }

  returnOrganizationsCard = () => {
    let numberOfErrors = 0;
    let numberOfOkey = 0;
    let totalBilling = 0;

    const { spinner, loadingError } = this.state;
    this.state.organizationsArray.map((org) => {
      if (org.status === 'okey') {
        numberOfOkey += 1;
      } else if (org.status === 'error') {
        numberOfErrors += 1;
      }

      totalBilling = parseFloat(totalBilling) + parseFloat(org.billing);
      return;
    });

    return (<div className="card-body text-center">
      <h4 onClick={this.toggleOrganizations} className="hoverCursor">
        <span className={this.state.organizationsListVisible ? 'oi oi-minus pushPlusLeft' : 'fa fa-plus pushPlusLeft'} ></span>
        Organizations
        <span className="badge badge-success aLittleMargin">Okay {numberOfOkey}</span>
        <span className="badge badge-danger aLittleMargin">Errors {numberOfErrors}</span>
      </h4>

      <div className={this.state.organizationsListVisible ? 'organizationsListVisible' : 'organizationsListInvisible'}>

        <table className="table table-borderless text-left">
          <th>Name</th>
          <th>Status</th>
          <th>Billing  (ugx {totalBilling})</th>
          <th>Created </th>
          <tbody>
            {loadingError
              && <tr className="alert alert-danger text-center">
                <td></td><td>{loadingError}</td><td></td><td></td>
              </tr>
            }
            {spinner ? (<tr ><Spinner /></tr>)
              : (
                this.state.organizationsArray.map((org) => (
                  <tr key={org.id}>
                    <td> <Link to={`/user-organizations/${org.id}`}> {org.name} </Link></td>
                    <td><span className={`badge badge-${org.status === 'okey' ? 'success' : 'danger'} aLittleMargin`}>{org.status}</span></td>
                    <td>{org.billing}</td>
                    <td>{moment(org.date_created).fromNow()}</td>
                  </tr>
                ))
              )
            }
          </tbody>
        </table>
      </div>
    </div>);
  }

  render() {
    return (
      <div>
        <div className="row align-items-center justify-content-center">
          <div className="col-9">
            <div className="card">
              {this.returnOrganizationsCard()}
            </div>
          </div>
        </div>
        <UserResourceUsage />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  token: state.auth.accessToken,
  organizations: state.org.organizations
});


const matchDispatchToProps = {
  storeOrganizations: orgActions.storeOrganizations
};


export default withRouter(connect(mapStateToProps, matchDispatchToProps)(LandingContent));
