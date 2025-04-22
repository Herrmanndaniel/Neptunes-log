document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  const registerLink = document.getElementById("show-register-form");
  const loginLink = document.getElementById("show-login-form");
  const profileLink = document.getElementById("profile-link");

  // Ensure the elements exist before adding event listeners
  if (registerLink) {
    registerLink.addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById("login-form-container").classList.add("d-none");
      document
        .getElementById("register-form-container")
        .classList.remove("d-none");
    });
  }

  if (loginLink) {
    loginLink.addEventListener("click", (e) => {
      e.preventDefault();
      document
        .getElementById("register-form-container")
        .classList.add("d-none");
      document
        .getElementById("login-form-container")
        .classList.remove("d-none");
    });
  }

  // Check if the user is signed in and update the profile link and text
  const username = localStorage.getItem("username");
  // console.log(username);
  if (username) {
    profileLink.href = "./profile.html";
    profileLink.textContent = "Profil";
  } else {
    profileLink.href = "./index.html";
    profileLink.textContent = "Přihlášení";
  }

  // Prevent default form submission behavior
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(loginForm);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });
      fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (response.ok) {
            localStorage.setItem("username", data.username); // Store username in localStorage
            window.location.href = "/locations";
          } else {
            return response.text().then((text) => {
              throw new Error(text);
            });
          }
        })
        .catch((error) => {
          console.error("Login failed:", error);
          alert("Přihlášení selhalo: " + error.message);
        });
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(registerForm);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });
      fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (response.ok) {
            localStorage.setItem("username", data.username); // Store username in localStorage
            window.location.href = "/locations";
          } else {
            return response.text().then((text) => {
              throw new Error(text);
            });
          }
        })
        .catch((error) => {
          console.error("Registration failed:", error);
          alert("Registrace selhala: " + error.message);
        });
    });
  }

  // Fetch and display locations
  fetch("/api/locations")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((locations) => {
      const locationsList = document.getElementById("locations-list");

      if (locationsList) {
        locations.forEach((location, index) => {
          // if(location.description == ''){location.description = 'Lokace neobsahuje popis'}
          // if(location.description == ''){alert("is")}else{alert(`not is ${location.description.toString()}`)}
          const iframe = location.iframe
            .replace(/width="\d+"/, 'width="400"')
            .replace(/height="\d+"/, 'height="300"');
          const locationDiv = document.createElement("div");
          locationDiv.classList.add("location");
          locationDiv.innerHTML = `
                      <div class="text-center mt-5">
                      <h3>${location.name}</h3>
                          <div>${iframe}</div>
                      </div>
                      <div class="d-flex justify-content-center flex-column text-center mx-3">
                          <div class="d-flex justify-content-between flex-row gap-5">
                            <p>Adresa: ${location.address}</p>
                            <p><b>Přidal: ${location.added_by}</p>
                          </div>
                          <p class="fw-bold">Hodnocení: ${location.rating} / 5</p>
                          <button class="btn btn-primary w-100" data-bs-toggle="modal" data-bs-target="#locationModal${index}">Zobrazit více</button>
                      </div>
                      
                      <!-- Modal -->
                      <div class="modal fade" id="locationModal${index}" tabindex="-1" aria-labelledby="locationModalLabel${index}" aria-hidden="true">
                          <div class="modal-dialog">
                              <div class="modal-content">
                                  <div class="modal-header">
                                      <h5 class="modal-title" id="locationModalLabel${index}">${location.name}</h5>
                                      <button type="button" class="btn-close button" data-bs-dismiss="modal" aria-label="Zavřít"></button>
                                  </div>
                                  <div class="modal-body">
                                      <div>${iframe}</div>
                                      <p>${location.address}</p>
                                      <p><b>Popis</b></p>
                                      <p class="fw-normal">${location.description}</p>
                                      <p><b>Přidal:<b/> ${location.added_by}</p>
                                      <p class="fw-bold">Hodnocení: ${location.rating} / 5</p>
                                  </div>
                              </div>
                          </div>
                      </div>`;
          locationsList.appendChild(locationDiv);
        });
      }
    })
    .catch((error) => console.error("Chyba při načítání lokací:", error));

  // Ensure iframe size before saving
  const addLocationForm = document.getElementById("add-location-form");
  if (addLocationForm) {
    addLocationForm.addEventListener("submit", (e) => {
      const iframeInput = document.getElementById("iframe");
      iframeInput.value = iframeInput.value
        .replace(/width="\d+"/, 'width="400"')
        .replace(/height="\d+"/, 'height="300"');
    });
  }

  // Fetch the current user's username and populate the "Added By" field
  fetch("/api/username")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const addedByInput = document.getElementById("added_by");
      if (addedByInput) {
        addedByInput.value = data.username;
        addedByInput.readOnly = true;
      }
    })
    .catch((error) =>
      console.error("Chyba při načítání uživatelského jména:", error)
    );

  // Function to add animation class when elements come into view
  const animateOnScroll = () => {
    const elements = document.querySelectorAll(
      ".location, h1, h2, p, .modal-content"
    );
    elements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        element.classList.add("animate");
      }
    });
  };

  // Add scroll event listener
  window.addEventListener("scroll", animateOnScroll);
  // Trigger animation on load
  animateOnScroll();
});
