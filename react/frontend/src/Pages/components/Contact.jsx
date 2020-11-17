import React from "react";

function Contact() {

  return (
    <div class="site-section" id="contact-section">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center mb-5" data-aos="fade-up" data-aos-delay="">
            <div class="block-heading-1">
              <h2>Contacta-me</h2>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-6 mx-auto mb-5" data-aos="fade-up" data-aos-delay="100">
            <form action="#" method="post">
              <div class="form-group row">
                <div class="col-md-6 mb-4 mb-lg-0">
                  <input type="text" class="form-control" placeholder="Primeiro nome"></input>
                </div>
                <div class="col-md-6">
                  <input type="text" class="form-control" placeholder="Último nome"></input>
                </div>
              </div>

              <div class="form-group row">
                <div class="col-md-12">
                  <input type="text" class="form-control" placeholder="Endereço de email"></input>
                </div>
              </div>

              <div class="form-group row">
                <div class="col-md-12">
                  <textarea name="" id="" class="form-control" placeholder="Escreve a tua mensagem." cols="30" rows="10"></textarea>
                </div>
              </div>
              <div class="form-group row">
                <div class="col-md-6">
                  <input type="submit" class="btn btn-block btn-primary text-white py-3 px-5" value="Enviar mensagem"></input>
                </div>
              </div>
            </form>
          </div>
          <div class="col-lg-4 ml-auto" data-aos="fade-up" data-aos-delay="200">
            <img class="img-fluid" src="images/monte-das-mos.jpeg" alt=""></img>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
