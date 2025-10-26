document.addEventListener('DOMContentLoaded', function() {
  
  const loginBtn = document.getElementById('loginBtn');
  const loginModal = document.getElementById('loginModal');
  const closeModal = document.getElementById('closeModal');

  const form = document.getElementById("formLogin");
  const loginInput = document.getElementById("login");
  const passInput = document.getElementById("password");
  const userNameSpan = document.getElementById('userName');


  if (loginBtn && loginModal) {
    loginBtn.onclick = function() {
      loginModal.style.display = 'block';
      loginInput.focus();
    };
  }

  
  if (closeModal && loginModal) {
    closeModal.onclick = function() {
      loginModal.style.display = 'none';
    };
  }
  
 
  window.onclick = function(event) {
    if (event.target === loginModal) {
      loginModal.style.display = 'none';
    }
  };

  
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault(); 

      
      const login = loginInput.value;
      const contrasena = passInput.value;

 
      try {
        const res = await fetch("http://localhost:3000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            cuenta: login,
            contrasena: contrasena
          })
        });

        let data = {};
        try {
          data = await res.json();
        } catch (parseErr) {
          console.warn("Respuesta no JSON del servidor", parseErr);
        }

       
        if (res.ok) {
          const cuenta = data.usuario?.cuenta;
          if (cuenta) {

          
            try {
              localStorage.setItem('userLogin', login);
              localStorage.setItem('userPassword', contrasena);
              console.log('Credenciales guardadas en localStorage (solo práctica).');
            } catch (storageError) {
              console.error('Error al guardar en localStorage:', storageError);
            }
      
            
            Swal.fire({
              title: '¡Acceso Permitido!',
              text: `Bienvenido, ${cuenta}.`,
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
            
            if (userNameSpan) userNameSpan.textContent = cuenta;
            if (loginModal) loginModal.style.display = 'none';
          
          } else {
            console.warn('200 OK sin usuario:', data);
          
            Swal.fire({
              title: 'Error Inesperado',
              text: 'Respuesta incompleta del servidor.',
              icon: 'warning'
            });
          }
        } else {
          
          Swal.fire({
            title: 'Acceso Denegado',
            text: data?.error ?? `Error ${res.status}: ${res.statusText}`,
            icon: 'error'
          });
          
          
          if (loginInput) loginInput.value = "";
          if (passInput) passInput.value = "";
          loginInput.focus();
        }

      } catch (err) {
        console.error("Error al conectar con el servidor:", err);
       
        Swal.fire({
          title: 'Error de Conexión',
          text: 'No se pudo conectar con el servidor. ¿Está encendido?',
          icon: 'error'
        });
      }
    });
  } 

});