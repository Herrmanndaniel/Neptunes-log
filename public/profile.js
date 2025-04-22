document.addEventListener("DOMContentLoaded", () => {

  alert(localStorage.getItem("username"))
  // Fetch user information
  fetch("/api/user-info")
    .then((response) => response.json())
    .then((user) => {
      const userInfoDiv = document.getElementById("user-info");
      userInfoDiv.innerHTML = `
        <h2>Uživatelské informace</h2>
        <p><b>Uživatelské jméno:</b> ${user.username}</p>
        <p><b>Email:</b> ${user.email}</p>
        <p><b>Počet přidaných lokací:</b> ${user.locationCount}</p>
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editUserModal">Upravit informace</button>
        
        <!-- Edit User Modal -->
        <div class="modal fade" id="editUserModal" tabindex="-1" aria-labelledby="editUserModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="editUserModalLabel">Upravit informace</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Zavřít"></button>
              </div>
              <div class="modal-body">
                <form id="edit-user-form">
                  <div class="mb-3">
                    <label for="edit-username" class="form-label">Uživatelské jméno</label>
                    <input type="text" class="form-control" id="edit-username" name="username" value="${user.username}" required>
                  </div>
                  <div class="mb-3">
                    <label for="edit-email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="edit-email" name="email" value="${user.email}" required>
                  </div>
                  <div class="mb-3">
                    <label for="edit-password" class="form-label">Nové heslo</label>
                    <input type="password" class="form-control" id="edit-password" name="password">
                  </div>
                  <button type="submit" class="btn btn-primary">Uložit změny</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      `;

      // Handle form submission for editing user information
      const editUserForm = document.getElementById("edit-user-form");
      editUserForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(editUserForm);
        fetch("/api/edit-user", {
          method: "POST",
          body: formData,
        })
          .then((response) => {
            if (response.ok) {
              window.location.reload();
            } else {
              console.error("Failed to update user information");
            }
          })
          .catch((error) =>
            console.error("Error updating user information:", error)
          );
      });
    })
    .catch((error) => console.error("Error fetching user information:", error));

  // Fetch user locations
  fetch("/api/user-locations")
    .then((response) => response.json())
    .then((locations) => {
      const locationsList = document.getElementById("locations-list");
      locations.forEach((location, index) => {
        // console.log(locations.length);
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
            <p>${location.address}</p>
            <p><b>Přidal: ${location.added_by}</p>
            <p class="fw-bold">Hodnocení: ${location.rating} / 5</p>
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#locationModal${index}">Zobrazit více</button>
          </div>
          
          <!-- Modal -->
          <div class="modal fade" id="locationModal${index}" tabindex="-1" aria-labelledby="locationModalLabel${index}" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="locationModalLabel${index}">${location.name}</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Zavřít"></button>
                </div>
                <div class="modal-body">
                  <div>${iframe}</div>
                  <p>${location.address}</p>
                  <p><b>Popis</b></p>
                  <p>${location.description}</p>
                  <p>Přidal: ${location.added_by}</p>
                  <p class="fw-bold">Hodnocení: ${location.rating} / 5</p>
                </div>
              </div>
            </div>
          </div>`;
        locationsList.appendChild(locationDiv);
      });
    })
    .catch((error) => console.error("Error fetching user locations:", error));
});
