import React from "react";

function NewPost() {
  return (
    <div class="site-section overlay img-bg-section" id="services-section" style="background-image: url('images/cavaleiro-profissional-dia-a-dia.jpg'); background-size: cover;">
    <div class="container">
      <div class="row mb-5 justify-content-center">
        <div class="col-md-7 text-center">
          <div class="block-heading-1">
            <h2>Adicionar notícia</h2>
          </div>
        </div>
      </div>
  
      <div class="row mb-5 justify-content-center">
        <div class="col-md-12">
          <form class="" action="/posts/add-post" method="post" enctype="multipart/form-data">
            <div class="form-group form-part-container-md">
              <div class="form-part-container-sm"><label class="form-title">Título em Português</label>
                <input class="form-control" type="text" name="postTitle"></input>
              </div>
              <div class="form-part-container-sm"><label class="form-title">Título em Inglês</label>
                <input class="form-control" type="text" name="postTitleEN"></input>
              </div>
              <div class="form-part-container-sm"><label class="form-title">Título em Francês</label>
                <input class="form-control" type="text" name="postTitleFR"></input>
              </div>
            </div>
            <div class="form-group form-part-container-md">
              <div class="form-part-container-sm"><label class="form-title">Imagem</label>
                <input type="file" class="form-control-file" name="postImage"></input>
              </div>
            </div>
            <div class="form-group form-part-container-md">
              <div class="form-part-container-sm"><label class="form-title">Notícia em Português</label>
                <textarea class="form-control" name="postBody" rows="5" cols="30"></textarea>
              </div>
              <div class="form-part-container-sm"><label class="form-title">Notícia em Inglês</label>
                <textarea class="form-control" name="postBodyEN" rows="5" cols="30"></textarea>
              </div>
              <div class="form-part-container-sm"><label class="form-title">Notícia em Francês</label>
                <textarea class="form-control" name="postBodyFR" rows="5" cols="30"></textarea>
              </div>
            </div>
            <div class="form-group form-part-container-md">
              <div class="form-part-container-sm"><button class="btn btn-primary" type="submit" name="button">Publicar</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  );
}

export default NewPost;
