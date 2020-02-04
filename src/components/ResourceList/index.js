import React from 'react';
import { Link } from "react-router-dom";
import './ResourceList.css';

const namespaces = [
    {
      "name": "Cranecloud-m1",
      "resourceNumber": 7,
      "status": "running",
      "id": 1
    },
    {
      "name": "Mak-w3",
      "resourceNumber": 3,
      "status": "running",
      "id": 2
    },
    {
      "name": "AirQuality",
      "resourceNumber": 11,
      "status": "running",
      "id": 3
    },
    {
      "name": "Cocis",
      "resourceNumber": 9,
      "status": "paused",
      "id": 4
    },
    {
      "name": "Level5Hub",
      "resourceNumber": 5,
      "status": "running",
      "id": 5
    },
    {
      "name": "Catalysts",
      "resourceNumber": 0,
      "status": "offline",
      "id": 6
    },
    {
      "name": "Backup",
      "resourceNumber": 2,
      "status": "stopped",
      "id": 7
    }
  ]
  
  const ResourceList = () => {
    // const [isOpen, setIsOpen] = useState(false);
  
    // const toggle = () => setIsOpen(!isOpen);
  
    return (
      <React.Fragment>
        <section className="Resource-List">
          <div class="Resource-Heading">
            <h2>Nodes</h2>
          </div>
          <div class="Resource-Heading">
            <h2>Nodes</h2>
          </div>
          <div className="Entire-List">
            <div id="blank"></div>
            <div class="All-Resources">
              <table className="My-Table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>View</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                  <tbody id="Listing">
                  {
                    namespaces.map((obj) => {
                        return <div>
                          <tr>
                            <td class="Resource-Name"> {obj.name} </td>
                            <td class="Resource-Status"> {obj.status} </td>
                            <td><a href ="node/{obj.id}">View</a></td>
                            <td><a href ="node/delete/{msg.message_id}">Delete</a></td>
                          </tr>
                        </div>
                    })
                    }
                  </tbody>
              </table>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  };
  
  export default ResourceList;  