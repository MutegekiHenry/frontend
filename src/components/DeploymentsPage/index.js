import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import getDeployments from '../../redux/actions/getDeployments';
import NavBar from '../NavBar';
import SideNav from '../SideNav';
import InformationBar from '../InformationBar';
import ProgressBar from '../ProgressBar';
import { BigSpinner } from '../SpinnerComponent';
import tellAge from '../../helpers/ageUtility';
import './DeploymentsPage.css';

class DeploymentsPage extends Component {
  constructor(props) {
    super(props);

    this.calculatePercentage = this.calculatePercentage.bind(this);
    this.displayFraction = this.displayFraction.bind(this);
  }

  componentDidMount() {
    const { match, getDeployments } = this.props;
    getDeployments(match.params.clusterID);
  }

  calculatePercentage(proportion, total) {
    return Math.round((proportion / total) * 100);
  }

  displayFraction(numerator, denominator) {
    return `${numerator}/${denominator}`;
  }

  render() {
    const clusterName = localStorage.getItem('clusterName');
    const {
      match,
      deployments,
      isFetchingDeployments,
      isFetched
    } = this.props;

    return (
      <div className="DeploymentsPageContainer">
        <NavBar />
        <div className="DeploymentsPageMain">
          <div className="DeploymentsPageSideNav">
            <SideNav
              clusterName={clusterName}
              clusterId={match.params.clusterID}
            />
          </div>
          <div className="DeploymentsPageMainContent">
            <InformationBar header="Deployments" />
            <div className="DeploymentsPageTableSection">
              <div className="ResourcesTable">
                <table>
                  <thead className="uppercase">
                    <tr>
                      <th>name</th>
                      <th>ready</th>
                      <th>age</th>
                    </tr>
                  </thead>
                  {isFetchingDeployments ? (
                    <tr className="TableLoading">
                      <div className="SpinnerWrapper">
                        <BigSpinner />
                      </div>
                    </tr>
                  ) : (
                    <tbody>
                      {isFetched && deployments !== undefined ? (
                        deployments.map((deployment) => (
                          <tr>
                            <td>{deployment.metadata.name}</td>
                            <td>
                              {Object.prototype.hasOwnProperty.call(deployment.status, 'readyReplicas') ? (
                                <ProgressBar
                                  percentage={this.calculatePercentage(deployment.status.readyReplicas, deployment.status.replicas)}
                                  fractionLabel={this.displayFraction(deployment.status.readyReplicas, deployment.status.replicas)}
                                />
                              ) : (
                                <ProgressBar
                                  percentage={this.calculatePercentage(0, deployment.status.replicas)}
                                  fractionLabel={this.displayFraction(0, deployment.status.replicas)}
                                />
                              )}
                            </td>
                            <td>{tellAge(deployment.metadata.creationTimestamp)}</td>
                          </tr>
                        ))) : <div>No deployments</div>}
                    </tbody>
                  )}
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DeploymentsPage.propTypes = {
  getDeployments: PropTypes.func.isRequired,
  deployments: PropTypes.arrayOf(PropTypes.object).isRequired,
  isFetchingDeployments: PropTypes.bool,
  isFetched: PropTypes.bool
};

DeploymentsPage.defaultProps = {
  isFetchingDeployments: false,
  isFetched: false
};

const mapStateToProps = (state) => {
  const {
    deployments,
    isFetchingDeployments,
    isFetched
  } = state.deployments;

  return { deployments, isFetched, isFetchingDeployments };
};

export default connect(mapStateToProps, { getDeployments })(withRouter(DeploymentsPage));
