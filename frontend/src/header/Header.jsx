import React from "react";

function Header() {
  return (
    <header>
      <div class="container">
        <div class="row align-items-center position-relative">


          <div class="site-logo">
            <a href="/" class="text-black"><span class="text-primary">Francisco Correia Lopes</span></a>
          </div>


            <div class="col-12">
              <nav class="site-navigation text-right ml-auto " role="navigation">
                <ul class="site-menu main-menu js-clone-nav ml-auto d-none d-lg-block">

                  <li><a href="/#home-section" class="nav-link">Apresentação</a></li>
                  <li><a href="/#about-section" class="nav-link">Biografia</a></li>
                  <li><a href="/#services-section" class="nav-link">Dia-a-dia</a></li>
                  <li><a href="/#contact-section" class="nav-link">Contacto</a></li>
                  <li><a href="/#blog-section" class="nav-link">Notícias</a></li>

                </ul>

              </nav>

            </div>


            <div class="toggle-button d-inline-block d-lg-none"><a href="#" class="site-menu-toggle py-5 js-menu-toggle text-white"><span class="icon-menu h3"></span></a></div>

          </div>

        </div>
    </header>
  );
}

export default Header;
