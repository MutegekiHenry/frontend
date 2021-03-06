import React from 'react';
import { Link } from 'react-router-dom';
import ResourceCard from '../ResourceCard';
import './ClusterResource.css';

function ClusterResources(props) {
  const { resourceCount, myClusterID } = props;

  return (
    <div className="ClusterContainer">
      {
        resourceCount.length !== 0 ? (resourceCount.map(
          (resource) => (
            <Link to={{ pathname: `/clusters/${myClusterID}/${resource.name.toLowerCase()}` }} key={resource.count}>
              <ResourceCard title={resource.name} count={resource.count} />
            </Link>
          )
        )) : (
          <h3 className="EmptyList">No Resources Available</h3>
        )
      }
    </div>
  );
}
export default ClusterResources;
