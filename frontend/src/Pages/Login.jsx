import React from "react";

function Login() {
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
              <h2>Login</h2>
            </div>
          </div>
        </div>

        <div class="row mb-5 justify-content-center">
          <div class="col-sm-9 col-md-6 col-lg-3 text-center">
            <div class="card-body">
              <a
                class="btn btn-block btn-social btn-google"
                href="/auth/google"
                role="button"
              >
                <i class="fab fa-google"></i>
                Sign In with Google
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
