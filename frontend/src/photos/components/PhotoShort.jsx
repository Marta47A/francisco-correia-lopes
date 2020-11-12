import React from "react";

function PhotoShort(props) {
  return (
    <div class="col-md-5 text-center">
      <div>
        <a href="/photos/{props.theme +'/' + props.id}">
          <img
            class="img-fluid photo-image"
            src="/uploads/{props.photoName}"
            alt="{props.photoName}"
          ></img>
        </a>
      </div>
    </div>
  );
}

export default PhotoShort;
