import React from "react";

function Carousel() {

  return (
    <div class="owl-carousel slide-one-item">

  <div class="site-section-cover overlay img-bg-section" style="background-image: url('images/cavaleiro-profissional (1).jpg'); ">
    <div class="container">
      <div class="row align-items-center justify-content-center text-center">
        <div class="col-md-12 col-lg-9">
          <h1 data-aos="fade-up" data-aos-delay="">Francisco Correia Lopes</h1>
          <h2 class="mb-5 w-75 mx-auto heading2" data-aos="fade-up" data-aos-delay="100">Cavaleiro Profissional</h2>
          <p data-aos="fade-up" data-aos-delay="200"><a href="#contact-section" class="btn btn-outline-white border-w-2 btn-md">Contacta-me</a></p>
        </div>
      </div>
    </div>

  </div>

  <div class="site-section-cover overlay img-bg-section" style="background-image: url('images/cavaleiro-profissional (2).jpg'); ">
    <div class="container">
      <div class="row align-items-center justify-content-center text-center">
        <div class="col-md-12 col-lg-8">
          <h1 data-aos="fade-up" data-aos-delay="">Uma Nova Geração</h1>
          <p class="mb-5 w-75 mx-auto" data-aos="fade-up" data-aos-delay="100"></p>
          <p data-aos="fade-up" data-aos-delay="200"><a href="#contact-section" class="btn btn-outline-white border-w-2 btn-md">Contacta-me</a></p>
        </div>
      </div>
    </div>

  </div>


</div>
  );
}

export default Carousel;
