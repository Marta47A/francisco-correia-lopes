import React from "react";

function PostShort(props) {

  return (
    <div class="col-md-6 col-lg-6" data-aos="fade-up" data-aos-delay="">
          <div>
            <img src="/uploads/{props.photoName}" alt="Image" class="img-fluid post-image"></img>
            <h2><a href="/posts/{props.id}">{props.title}</a></h2>
            <p class="text-muted mb-3 text-uppercase small"><span class="mr-2">{props.updatedOn}</span></p>
            <p>{props.content.substring(0, 100) + " ..."}</p>
            <p><a href="/posts/{props.id}">Ler mais</a></p>

        </div>
      </div>
  );
}

export default Post;
