import React from "react";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer class="site-footer">
    <div class="container">
      <div class="row pt-1 mt-1 text-center">
        <div class="col-md-12">
          <a href="https://www.facebook.com/FranciscoCorreiaLopes9" class="pl-3 pr-3"><span class="icon-facebook"></span></a>
          <a href="https://www.instagram.com/francisco_correia_lopes/" class="pl-3 pr-3"><span class="icon-instagram"></span></a>
        </div>
      </div>
      <div class="row pt-1 mt-1 text-center">
        <div class="col-md-12">
          <p class="copyright"><small>
              &copy; Copyright {year}
              Sonhos Mil
            </small></p>
        </div>

      </div>
    </div>
  </footer>
  );
}

export default Footer;
