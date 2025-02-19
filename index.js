fetch('resources/dataset.json')   
  .then(response => response.json())   
  .then(data => {     
    const vuelos = data;       

    function filterVuelos(vuelos, origen, destino) {       
      return vuelos.filter(vuelo => 
        (origen ? vuelo.origin === origen : true) && 
        (destino ? vuelo.destination === destino : true)
      );     
    }      
 
    function obtenerTop10MasBaratos(vuelos) {       
      return vuelos.sort((a, b) => a.price - b.price).slice(0, 10);     
    }      
 
    const origenesUnicos = [...new Set(vuelos.map(vuelo => vuelo.origin))];
    const destinosUnicos = [...new Set(vuelos.map(vuelo => vuelo.destination))];


    let htmlContent = '';
    for (let i = 0; i < origenesUnicos.length; i++) {       
      htmlContent += `<option value="${origenesUnicos[i]}">${origenesUnicos[i]}</option>`;     
    }     
    document.getElementById('originSelection').innerHTML = htmlContent;      

    let imputDestination = '';
    for (let i = 0; i < destinosUnicos.length; i++) {         
      imputDestination += `<option value="${destinosUnicos[i]}">${destinosUnicos[i]}</option>`;     
    }     
    document.getElementById('imputDestination').innerHTML = imputDestination;       


    function actualizarDestinosPorOrigen() {
      const origenSeleccionado = document.getElementById('originSelection').value;
      const destinosDisponibles = [...new Set(vuelos.filter(vuelo => vuelo.origin === origenSeleccionado).map(vuelo => vuelo.destination))];

      let opcionesDestino = '';
      destinosDisponibles.forEach(destino => {
        opcionesDestino += `<option value="${destino}">${destino}</option>`;
      });

      document.getElementById('imputDestination').innerHTML = opcionesDestino;
      mostrarVuelos(origenSeleccionado, document.getElementById('imputDestination').value);
    }


    function mostrarVuelos(origenSeleccionado, destinoSeleccionado) {
      const vuelosFiltrados = filterVuelos(vuelos, origenSeleccionado, destinoSeleccionado);
      const productosMasBaratos = obtenerTop10MasBaratos(vuelosFiltrados);

      let cardsContent = '';     
      productosMasBaratos.forEach(vuelo => {
        cardsContent += `         
          <div class="card">           
            <h2>Fecha: ${vuelo.date}</h2>           
            <h2>Origen: ${vuelo.origin}</h2>           
            <h2>Destino: ${vuelo.destination}</h2>           
            <h2>Precio: $${vuelo.price}</h2>           
            <h2>Disponibilidad: ${vuelo.availability}</h2>         
          </div>`;     
      });

      document.getElementById('CardsContainer').innerHTML = cardsContent;
    }

    document.getElementById('originSelection').addEventListener('change', actualizarDestinosPorOrigen);

    document.getElementById('imputDestination').addEventListener('change', () => {
      mostrarVuelos(document.getElementById('originSelection').value, document.getElementById('imputDestination').value);
    });

  })   
  .catch(error => {     
    console.error('Error del servidor, por favor presionar F5:', error);   
  });

