import React from 'react';
import './App.css';
import Footer from '../Footer/';
import ClusterResources from '../ClusterResources/';
import ResourceList from '../ResourceList/';

/* These below are for showing purposes */
/* THIS IS GOING TO BE REMOVED IN THE DASHBOARD FEATURE */

function App() {
  return <div>
    {/* <div className="Disposable"> */}
      {/* <div><ClusterResources /></div> */}
    {/* </div> */}
    <ResourceList />
    {/* <Footer /> */}
  </div>
}

export default App;
