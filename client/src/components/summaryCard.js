import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // Import the styles
import "../styles/SummaryComponent.css"
import axios from '../utils/baseapi';

function BirdCard() {
  const location = useLocation();
  const [image, setImage] = useState(null)
  const [summary, setSummary] = useState(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Set the received summary data to the state
    setSummary(location.state);
  }, [location.state]);

  // Destructure the summary data
  const { name, category, species, summary: birdSummary } = summary || {};




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


  const downloadImage = (imageUrl) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'bird_image.jpg'; // You can set the desired file name here
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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


            <div className='imagegallerycontainer'>
              <h1 className='imagegallery'>Gallery</h1>
            </div>

            <div className="image-container">
              <div className="imageborder">
                {image?.length > 0 ? (
                  image.map((imageUrl, index) => (
                    <div key={index} className="image-wrapper">
                      <img
                        className="bird-image"
                        src={imageUrl}
                        alt=""
                        onClick={() => {
                          setPhotoIndex(index);
                          setIsOpen(true);
                        }}
                      />
                      <button className="download-button" onClick={() => downloadImage(imageUrl)}>
                        Download
                      </button>
                    </div>
                  ))
                ) : (
                  <p>Image Not Found</p>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <Lightbox
          mainSrc={image[photoIndex]}
          nextSrc={image[(photoIndex + 1) % image.length]}
          prevSrc={image[(photoIndex + image.length - 1) % image.length]}
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() => setPhotoIndex((photoIndex + image.length - 1) % image.length)}
          onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % image.length)}
        />
      )}
    </div>
  );
}

export default BirdCard;
