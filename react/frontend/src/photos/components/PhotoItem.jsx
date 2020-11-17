import React from "react";

function PhotoItem(props) {
  return (
    <div class="site-section overlay img-bg-section" id="services-section">
      <div class="container">
        <div class="row mb-5 justify-content-center">
          <div class="col-md-8 text-center">
            <div>
              <img
                src={"/uploads/"+props.name}
                alt={props.name}
                class="img-fluid photo-image-big"
              ></img>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhotoItem;
