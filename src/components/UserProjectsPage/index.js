import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import './UserProjectsPage.css';
import InformationBar from '../InformationBar';
import Header from '../Header';
import getUserProjects from '../../redux/actions/userProjectsActions';
import { BigSpinner } from '../SpinnerComponent';
import ClusterCard from '../ClusterCard';
import crane from '../../assets/images/craneLogo.png';
import Modal from '../Modal';
import PrimaryButton from '../PrimaryButton';
import CreateButton from '../ButtonComponent';
import AddProjectForm from '../AddProject';

class UserProjectsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false // add project modal is closed initially
    };

    this.showForm = this.showForm.bind(this);
    this.hideForm = this.hideForm.bind(this);
  }

  componentDidMount() {
    const { getUserProjects, data } = this.props;
    getUserProjects(data.id);
  }

  showForm() {
    this.setState({ openModal: true });
  }

  hideForm() {
    this.setState({ openModal: false });
  }

  render() {
    const { projects, isRetrieving } = this.props;
    const { openModal } = this.state;

    return (
      <div className="Page">
        <div className="TopRow">
          <Header />
          <InformationBar header="Projects" showBtn btnAction={this.showForm} />
        </div>
        <div className="MainRow">
          <div className="ProjectList">
            {
              isRetrieving ? (
                <div className="TableLoading">
                  <div className="SpinnerWrapper">
                    <BigSpinner />
                  </div>
                </div>
              ) : (
                <div className="ProjectList">
                  { projects.length !== 0 ? (
                    projects.map((project) => (
                      <Link to={{ pathname: `/projects/${project.id}` }} key={project.id}>
                        <div key={project.id} className="ProjectCardItem">
                          <ClusterCard
                            name={project.name}
                            description={project.alias}
                            icon={crane}
                          />
                        </div>
                      </Link>
                    )))
                    : (
                      <div className="EmptyList">
                        <h3>No Projects Yet.</h3>
                      </div>
                    )}
                </div>
              )
            }
          </div>
          <div className="FooterRow">
            <p>
              Copyright © 2020 Crane Cloud.
              All Rights Reserved.

            </p>
          </div>
        </div>

        {/* Modal for creating a new project
        Its triggered by the value of state.openModal */}
        <Modal showModal={openModal}>
          <div>
            Kati our form for adding a project comes here... Then the close button (X) on this modal should cancel this...
            <div className="ModalButtons">
              <PrimaryButton label="create project" />
              <PrimaryButton label="cancel" className="CancelBtn" onClick={this.hideForm} />
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

UserProjectsPage.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.object),
  isRetrieving: PropTypes.bool
};

UserProjectsPage.defaultProps = {
  projects: [],
  isRetrieving: false
};

export const mapStateToProps = (state) => {
  const { isRetrieving, projects } = state.UserProjectsReducer;
  const { data } = state.user;
  return { isRetrieving, projects, data };
};

export const mapDispatchToProps = (dispatch) => bindActionCreators({
  getUserProjects
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProjectsPage);
