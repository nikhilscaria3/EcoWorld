import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import "../styles/SummaryComponent.css"
import axios from 'axios';
function BirdCard() {
  const location = useLocation();
  const [image, setImage] = useState(null)
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    // Set the received summary data to the state
    setSummary(location.state);
  }, [location.state]);
  
  // Destructure the summary data
  const { name, category,species, summary: birdSummary } = summary || {};




  useEffect(() => {
    const fetchImage = async () => {
      try {
        if (name && species) {
          const response = await axios.get(`/api/getimages?name=${name}&species=${species}&category=${category}`);
          setImage(response.data.imageUrls); // Assuming the response contains an "imageUrls" array
          console.log(response.data.imageUrls);
        }
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };
  
    if (name && species) {
      fetchImage();
    }
  // eslint-disable-next-line no-use-before-define
  }, [name, species]);
  



  return (
    <div className="summarycontainer container-fluid">
      <div className="row justify-content-center mt-5">
        <div className="col-md-8 col-lg-10">
          <div className="summarycard">
            <div className="summarycard-header">
              <p className="summarylabel">Name</p>
              <h1 className="summarytext-center">{name}</h1>
              <p className="summarylabel">Also Known</p>
              <h1 className="summarytext-center">{birdSummary}</h1>
            </div>
            <div className="summarycard-body">
              <p className="summarylabel">Summary:</p>
              <p className="Summary">{species}</p>
            </div>
            <div className="image-container">
              {image?.map((imageUrl, index) => (
                <img className="bird-image" key={index} src={imageUrl} alt={`Bird Image ${index + 1}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BirdCard;
