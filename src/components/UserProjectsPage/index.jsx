import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import './UserProjectsPage.css';
import AddProject from '../../redux/actions/addProject';
import InformationBar from '../InformationBar';
import Header from '../Header';
import PrimaryButton from '../PrimaryButton';
import Modal from '../Modal';
import getClustersList from '../../redux/actions/ClustersActions';
import getUserProjects from '../../redux/actions/projectsListActions';
import InputText from '../InputText';
import TextArea from '../TextArea';
import { BigSpinner } from '../SpinnerComponent';
import ClusterCard from '../ClusterCard';
import crane from '../../assets/images/craneLogo.png';


class UserProjectsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false, // add project modal is closed initially
      projectName: '',
      clusterID: '',
      projectDescription: '',
      clusters: [],
      createFeedback: '',
      error: ''
    };

    this.showForm = this.showForm.bind(this);
    this.hideForm = this.hideForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateProjectName = this.validateProjectName.bind(this);
  }

  componentDidMount() {
    const { getClustersList, getUserProjects, data } = this.props;
    getUserProjects(data.id);
    getClustersList();
  }


  handleChange(e) {
    const { error } = this.state;
    this.setState({
      [e.target.name]: e.target.value
    });

    if (error) {
      this.setState({
        error: ''
      });
    }
  }

  showForm() {
    this.setState({ openModal: true });
  }

  hideForm() {
    this.setState({ openModal: false });
  }

  validateProjectName(name) {
    if (/^[a-z]/i.test(name)) {
      if (name.match(/[^-a-zA-Z]/)) {
        return 'false_convention';
      }
      return true;
    }
    return false;
  }

  handleSubmit() {
    const { projectName, projectDescription, clusterID, createFeedback } = this.state;
    const { AddProject, data, isAdded, isFailed, errorOccured } = this.props;

    if (!projectName || !clusterID || !projectDescription) {
      // if user tries to submit empty email/password
      this.setState({
        error: 'all fields are required'
      });
    } else if (this.validateProjectName(projectName) === false) {
      this.setState({
        error: 'name should start with a letter'
      });
    } else if (this.validateProjectName(projectName) === 'false_convention') {
      this.setState({
        error: 'name may only contain letters and a hypen -'
      });
    } else {
      const newProject = {
        description: projectDescription,
        cluster_id: clusterID,
        name: projectName,
        owner_id: data.id
      };
      AddProject(newProject);
      // this.setState({
      //   loading: true
      // });

      if (isAdded === true && isFailed === false) {
        this.setState({
          createFeedback: 'Success! Project created!'
        });
        setTimeout(
          () => {
            this.setState({
              openModal: false,
              createFeedback: ''
            });
          }, 1000
        );
      }
      if (isFailed === true && isAdded === false) {
        if (errorOccured === 409) {
          this.setState({
            createFeedback: 'Project name already in use, select another and try again'
          });
        } else {
          this.setState({
            createFeedback: 'Something went wrong. Failed to create project'
          });
        }
      }
    }
  }


  render() {
    const {
      openModal,
      projectName,
      projectDescription,
      createFeedback,
      error

      // clusterID,
      // loading
    } = this.state;
    const {
      projects, clusters, isRetrieving, data, isFetched
    } = this.props;
    const userId = data.id;
    const clustersList = clusters.length > 0
      && clusters.map((item, i) => (
        <option key={i} value={item.id}>{item.name}</option>
      ));

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
                  {(isFetched && projects !== undefined && (
                    (projects.map((project) => (
                      <Link to={{ pathname: `/users/${userId}/projects/${project.id}/apps` }} key={project.id}>
                        <div key={project.id} className="ProjectCardItem">
                          <ClusterCard
                            name={project.name}
                            description={project.description}
                            icon={crane}
                          />
                        </div>
                      </Link>
                    ))))
                  )}
                  {(isFetched && projects.length === 0) && (
                    <div className="NoContentDiv">
                        You haven’t created any projects yet.
                        Click the create button to get started.
                    </div>
                  )}
                  {(!isRetrieving && !isFetched) && (
                    <div className="NoContentDiv">
                        Oops! Something went wrong!
                        Failed to retrieve Projects.
                    </div>
                  )}

                </div>
              )
            }
          </div>
        </div>
        <div className="FooterRow">
          <p>
            Copyright © 2020 Crane Cloud.
            <br />
            All Rights Reserved.
          </p>
        </div>

        {/* Modal for creating a new project
        Its triggered by the value of state.openModal */}
        <Modal showModal={openModal}>
          <div className="ModalForm">
            <div className="ModalFormHeading">
              <h2>Add a project</h2>
            </div>
            <div className="ModalFormInputs">
              <select
                name="clusterID"
                value={this.state.value}
                onChange={(e) => {
                  this.handleChange(e);
                }}
                required
              >
                <option disabled selected>Pick a Cluster</option>
                {clustersList}
              </select>

              <InputText
                placeholder="Project Name"
                name="projectName"
                value={projectName}
                onChange={(e) => {
                  this.handleChange(e);
                }}
              />

              <TextArea
                placeholder="Project Description"
                name="projectDescription"
                value={projectDescription}
                onChange={(e) => {
                  this.handleChange(e);
                }}
              />

            </div>
            {error && (
              <div className="ProjectFormErrorDiv">
                {error}
              </div>
            )}
            <div className="ModalFormButtons">
              <PrimaryButton label="Cancel" className="CancelBtn" onClick={this.hideForm} />
              <PrimaryButton label="Create project" onClick={this.handleSubmit} />
            </div>
            {createFeedback && (
              <div className={createFeedback.startsWith('Success') ? 'ProjectFormErrorDiv CreateSuccess' : 'ProjectFormErrorDiv CreateFail'}>
                {createFeedback}
              </div>
            )}

          </div>

        </Modal>
      </div>
    );
  }
}

UserProjectsPage.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.object),
  clusters: PropTypes.arrayOf(PropTypes.object),
  project: PropTypes.arrayOf(PropTypes.object),
  isAdded: PropTypes.bool,
  isFetched: PropTypes.bool,
  isRetrieving: PropTypes.bool
};

UserProjectsPage.defaultProps = {
  clusters: [],
  project: {},
  isAdded: false,
  projects: [],
  isFetched: false,
  isRetrieving: false
};

export const mapStateToProps = (state) => {
  const { data } = state.user;
  const { isAdded, project, isFailed, errorOccured } = state.addProjectReducer;
  const { clusters } = state.ClustersReducer;
  const { isRetrieving, projects, isFetched } = state.UserProjectsReducer;
  return {
    isAdded, project, data, isRetrieving, projects, clusters, isFetched, isFailed, errorOccured
  };
};

export const mapDispatchToProps = (dispatch) => bindActionCreators({
  getUserProjects, AddProject, getClustersList,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProjectsPage);
