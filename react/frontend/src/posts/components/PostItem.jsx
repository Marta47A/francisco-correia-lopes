import React from "react";

function PostItem(props) {
  return (
    <div class="site-section overlay img-bg-section" id="services-section">
      <div class="container">
        <div class="row mb-5 justify-content-center">
          <div class="col-md-7 text-center">
            <div class="block-heading-1">
              <h2>{props.title}</h2>
            </div>
          </div>
        </div>
        <div class="row mb-5 justify-content-center">
          <div class="col-md-7 text-center">
            <div>
              <p class="text-muted mb-3 text-uppercase small">
                <span class="mr-2">{props.updatedOn}</span>
              </p>
              <img
                src={"/uploads/"+props.photoName}
                alt={props.photoName}
                class="img-fluid post-image"
              ></img>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12">
            <div>
              <p>{props.content}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostItem;
