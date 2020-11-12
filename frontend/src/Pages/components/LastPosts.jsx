import React from "react";
import Post from "../../posts/pages/PostShort";

function LastPosts(props) {

  return (
    <div class="site-section" id="blog-section">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center mb-5">
            <div class="block-heading-1" data-aos="fade-up" data-aos-delay="">
              <span>Últimas notícias</span>
              <h2>Notícias</h2>
            </div>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="row">
          {props.lastPosts.map(
            post => { <PostItem id={post._id} photoName={post.photoName} title={post.title} updatedOn={post.updatedOn} content={post.content} /> }
            )}

        </div>
      </div>

      <div class="container">
        <div class="row">
          <div class="col-12 text-center" data-aos="fade-up" data-aos-delay="">
            <span><a href="/posts/">+ Notícias</a></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LastPosts;
