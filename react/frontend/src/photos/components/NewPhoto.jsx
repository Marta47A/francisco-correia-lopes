import React from "react";

function NewPhoto() {
  return (
    <div
      class="site-section overlay img-bg-section"
      id="services-section"
      style="background-image: url('images/cavaleiro-profissional-dia-a-dia.jpg'); background-size: cover;"
    >
      <div class="container">
        <div class="row mb-5 justify-content-center">
          <div class="col-md-7 text-center">
            <div class="block-heading-1">
              <h2>Adicionar foto</h2>
            </div>
          </div>
        </div>

        <div class="row mb-5 justify-content-center">
          <div class="col-md-12">
            <form
              class=""
              action="/photos/<%=photoTheme%>/add-photo"
              method="post"
              enctype="multipart/form-data"
            >
              <div class="form-group form-part-container-md">
                <div class="form-part-container-sm">
                  <select class="form-control" name="photoTheme">
                    <option value="Provas de Equitação de Trabalho">
                      Provas de Equitação de Trabalho
                    </option>
                    <option value="Estágios">Estágios</option>
                    <option value="Desbaste, Ensino e Treino">
                      Desbaste, Ensino e Treino
                    </option>
                    <option value="Tauromauquia - Amador">
                      Tauromauquia - Amador
                    </option>
                    <option value="Tauromauquia - Praticante">
                      Tauromauquia - Praticante
                    </option>
                  </select>
                  <label>Título em Português</label>
                  <input
                    class="form-control"
                    type="text"
                    name="photoTitle"
                  ></input>
                  <label>Título em Inglês</label>
                  <input
                    class="form-control"
                    type="text"
                    name="photoTitleEN"
                  ></input>
                  <label>Título em Francês</label>
                  <input
                    class="form-control"
                    type="text"
                    name="photoTitleFR"
                  ></input>
                </div>
              </div>
              <div class="form-group form-part-container-md">
                <div class="form-part-container-sm">
                  <label class="form-title">Imagem</label>
                  <input
                    type="file"
                    class="form-control-file"
                    name="photoImage"
                  ></input>
                </div>
              </div>
              <div class="form-group form-part-container-md">
                <div class="form-part-container-sm">
                  <button class="btn btn-primary" type="submit" name="button">
                    Adicionar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewPhoto;
