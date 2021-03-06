
import {
  GET_CLUSTERS, 
  GET_CLUSTERS_FAIL, 
  START_GETTING_CLUSTERS 
} from '../actions/actionTypes';

const initialState = {
  clusters: [],
  isRetrieved: false,
  isRetrieving: false,
  message: 'Clusters Not Available'
};

const ClustersReducer = (state = initialState, action) => {
  switch (action.type) {
  case GET_CLUSTERS:
    return {
      ...state,
      clusters: action.payload,
      isRetrieving: false,
      isRetrieved: true,
      message: 'All Cluster fetched'
    };

  case START_GETTING_CLUSTERS:
    return {
      ...state,
      isRetrieving: true,
      isRetrieved: false
    };

  case GET_CLUSTERS_FAIL:
    return {
      ...state,
      message: action.payload,
      isRetrieving: false,
      isRetrieved: false,
    };

  default:
    return state;
  }
};
export default ClustersReducer;
