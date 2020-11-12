import React from "react";

function PostList(props) {
  return (
    <div class="site-section overlay img-bg-section" id="services-section">
      <div class="container">
        <div class="row mb-5 justify-content-center">
          <div class="col-md-7 text-center">
            <div class="block-heading-1">
              <h2>Notícias</h2>
            </div>
          </div>
        </div>
        <div class="row mb-5 justify-content-center">
          {props.posts.map((post) => {
            <PostItemShort
              id={post._id}
              photoName={post.photoName}
              title={post.title}
              updatedOn={post.updatedOn}
              content={post.content}
            />;
          })}
        </div>
      </div>
    </div>
  );
}

export default PostList;
