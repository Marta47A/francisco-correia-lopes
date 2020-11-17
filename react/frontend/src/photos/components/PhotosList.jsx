import React from "react";

function PhotosList(props) {
  const photos = props.photos;

  return (
    <div class="site-section overlay img-bg-section" id="services-section">
      <div class="container">
        <div class="row mb-5 justify-content-center">
          <div class="col-md-9 text-center">
            <div class="block-heading-1">
              <h2>{props.requestedPhotoTheme}</h2>
            </div>
          </div>
        </div>
        <div class="row mb-5 justify-content-center">
          {photos.map((photo) => {
            <PhotoShort
              key={photo._id}
              id={photo._id}
              photoName={photo.photoName}
              theme={photo.theme}
            />;
          })}
        </div>
      </div>
    </div>
  );
}

export default PhotosList;
