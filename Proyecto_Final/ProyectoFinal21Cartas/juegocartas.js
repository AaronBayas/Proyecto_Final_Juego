class JuegoDeCartas {
  // Función para ir hacia atrás en el historial del navegador
  goBack() {
    window.history.back();
  }
  // Constructor de la clase
  constructor() {
    // Propiedades del juego
    this.mazo = [];
    this.cartasJugador = [];
    this.cartasMaquina = [];
    this.terminado = false;
    // Elementos del DOM
    this.botonComenzar = document.getElementById("startButton"); // Botón para comenzar el juego
    this.areaJuego = document.getElementById("gameArea"); // Área del juego
    this.manoJugador = document.getElementById("playerHand"); // Mano del jugador
    this.manoMaquina = document.getElementById("dealerHand"); // Mano de la máquina
    this.mensaje = document.getElementById("message"); // Mensajes del juego
    this.botonPedir = document.getElementById("hitButton"); // Botón para pedir carta
    this.botonPlantarse = document.getElementById("standButton"); // Botón para plantarse
    this.divResultado = document.getElementById("result"); // Resultado del juego
    this.botonReiniciar = document.getElementById("restartButton"); // Botón para reiniciar el juego
    // Listeners de eventos para los botones
    // En este caso específico, la función proporcionada es una función de flecha (() => this.comenzarJuego()), que a su vez llama al método this.comenzarJuego().
    this.botonComenzar.addEventListener("click", () => this.comenzarJuego()); // Listener para comenzar el juego
    this.botonPedir.addEventListener("click", () => this.pedirCarta()); // Listener para pedir carta
    this.botonPlantarse.addEventListener("click", () => this.plantarse()); // Listener para plantarse
    this.botonReiniciar.addEventListener("click", () => this.reiniciarJuego()); // Listener para reiniciar el juego
    
    // Inicialización del juego
    this.inicializar(); // Función para inicializar el juego
}

  // Inicialización del juego
  inicializar() {
    this.comenzarJuego();
  }
  // Función para comenzar el juego
  comenzarJuego() {
    this.botonComenzar.style.display = "none"; // Ocultar botón de comenzar
    this.areaJuego.style.display = "block"; // Mostrar área de juego
    this.mazo = this.crearMazo(); // Crear un mazo de cartas
    this.cartasJugador = [this.tomarCarta(), this.tomarCarta()]; // Repartir cartas al jugador
    this.cartasMaquina = [this.tomarCarta(), this.tomarCarta()]; // Repartir cartas a la máquina
    this.actualizarManos(); // Actualizar visualmente las manos de jugador y máquina
    this.verificarBlackjack(); // Verificar si el jugador tiene un Blackjack
  }
  // Función para crear un mazo de cartas
  crearMazo() {
    const simbolos = ["♠", "♦", "♣", "♥"];
    const valores = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    const mazo = [];
    // Crear todas las cartas posibles
    for (const palo of simbolos) {
      for (const valor of valores) {
        mazo.push(`${valor}${palo}`);
      }
    }
    return this.mezclarMazo(mazo); // Mezclar el mazo de cartas
  }
  // Función para mezclar un mazo de cartas
  mezclarMazo(mazo) {
    for (let i = mazo.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [mazo[i], mazo[j]] = [mazo[j], mazo[i]]; // Intercambiar cartas aleatoriamente
    }
    return mazo;
  }
  // Función para tomar una carta del mazo
  tomarCarta() {
    if (this.mazo.length === 0) {
      // El mazo está vacío, no hay cartas para tomar
      return null;
    }
    const cartaTomada = this.mazo[this.mazo.length - 1]; // Obtener la última carta
    const nuevoMazo = [];
    for (let i = 0; i < this.mazo.length - 1; i++) {
      nuevoMazo[i] = this.mazo[i];
    }
    this.mazo = nuevoMazo; // Actualizar el mazo sin la última carta
    return cartaTomada;
  }

  // Función para verificar si una carta es roja (corazones o diamantes)
  esCartaRoja(carta) {
    const corazones = "♥";
    const diamantes = "♦";
    for (let i = 0; i < carta.length; i++) {
      if (carta[i] === corazones || carta[i] === diamantes) {
        return true;
      }
    }
    return false;
  }
  // Función para actualizar visualmente las manos de jugador y máquina
  actualizarManos() {
    const contenidoManoJugador = this.cartasJugador
      .map(carta => this.esCartaRoja(carta) ? `<span class="red-card">${carta}</span>` : carta)
      .join(", ");
    const primeraCartaMaquina = this.esCartaRoja(this.cartasMaquina[0]) ? `<span class="red-card">${this.cartasMaquina[0]}</span>` : this.cartasMaquina[0];
    this.manoJugador.innerHTML = `Tus Cartas: ${contenidoManoJugador}`;
    this.manoMaquina.innerHTML = `Cartas de la Maquina: ${primeraCartaMaquina}, X`;
  }
  // Función para verificar si el jugador tiene Blackjack
  verificarBlackjack() {
    if (this.calcularValorMano(this.cartasJugador) === 21) {
      this.mostrarMensaje("¡21 de Cartas! ¡Ganaste!");
      this.terminado = true;
    }
  }
  // Función para obtener el valor de una carta
  obtenerValorCarta(carta) {
    let valorCarta = "";
    for (let i = 0; i < carta.length - 1; i++) {
      valorCarta += carta[i];
    }
    return valorCarta;
  }
  // Función para verificar si una carta es una figura (J, Q, K)
  esFigura(valorCarta) {
    const figuras = ["K", "Q", "J"];
    for (const figura of figuras) {
      if (valorCarta === figura) {
        return true;
      }
    }
    return false;
  }
  // Función para calcular el valor total de una mano de cartas
  calcularValorMano(cartas) {
    let valor = 0;
    let numAses = 0;
    for (const carta of cartas) {
      const valorCarta = this.obtenerValorCarta(carta);
      if (valorCarta === "A") {
        numAses++;
        valor += 1;
      } else if (this.esFigura(valorCarta)) {
        valor += 10;
      } else {
        valor += parseInt(valorCarta);
      }
    }
    while (numAses > 0 && valor > 21) {
      valor -= 10;
      numAses--;
    }
    return valor;
  }
  // Función para que el jugador pida una carta
  pedirCarta() {
    if (!this.terminado) {
      const nuevaCarta = this.tomarCarta();
      this.cartasJugador.push(nuevaCarta);
      this.actualizarManos();
      if (this.calcularValorMano(this.cartasJugador) > 21) {
        this.mostrarMensaje("Te pasaste de 21. ¡Perdiste!");
        this.terminado = true;
        this.mostrarResultado("Perdiste.");
      }
    }
  }
  // Función para que el jugador se plante
  plantarse() {
    if (!this.terminado) {
      while (this.calcularValorMano(this.cartasMaquina) < 17) {
        this.cartasMaquina.push(this.tomarCarta());
      }
      this.actualizarManos();
      const valorManoMaquina = this.calcularValorMano(this.cartasMaquina);
      const valorManoJugador = this.calcularValorMano(this.cartasJugador);
      if (valorManoMaquina > 21 || valorManoJugador > valorManoMaquina) {
        this.mostrarMensaje("¡Ganaste!");
        this.mostrarResultado("¡Ganaste!");
      } else if (valorManoJugador === valorManoMaquina) {
        this.mostrarMensaje("Empate.");
        this.mostrarResultado("Empate.");
      } else {
        this.mostrarMensaje("Perdiste.");
        this.mostrarResultado("Perdiste.");
      }
      this.terminado = true;
    }
  }
  // Función para mostrar el resultado del juego
  mostrarResultado(resultado) {
    this.divResultado.textContent = resultado;
    if (resultado === "¡Ganaste!" || resultado === "Perdiste." || resultado === "Empate.") {
      const contenidoManoJugador = this.cartasJugador
        .map(carta => this.esCartaRoja(carta) ? `<span class="red-card">${carta}</span>` : carta)
        .join(", ");
      const contenidoCartasMaquina = this.cartasMaquina
        .map((carta) => this.esCartaRoja(carta) ? `<span class="red-card">${carta}</span>` : carta)
        .join(", ");  
      // Mostrar las manos y sumas en el resultado
      this.divResultado.innerHTML += "<br>";
      this.divResultado.innerHTML += `Tus Cartas: ${contenidoManoJugador} (Suma: ${this.calcularValorMano(this.cartasJugador)})`;
      this.divResultado.innerHTML += "<br>";
      this.divResultado.innerHTML += `Cartas de la Maquina: ${contenidoCartasMaquina} (Suma: ${this.calcularValorMano(this.cartasMaquina)})`;
    }
    // Mostrar resultado y botón de reinicio
    this.divResultado.style.display = "block";
    this.botonReiniciar.style.display = "block";
  }
  // Función para reiniciar el juego
  reiniciarJuego() {
    this.terminado = false;
    this.mazo = this.crearMazo();
    this.cartasJugador = [this.tomarCarta(), this.tomarCarta()];
    this.cartasMaquina = [this.tomarCarta(), this.tomarCarta()];
    this.mostrarMensaje("");
    // En este caso, this.divResultado.style.display = "none"; se utiliza para ocultar el elemento que muestra el resultado del juego. Cuando esta línea de código se ejecuta, el elemento del resultado se ocultará y ya no será visible en la página. Esto podría suceder, por ejemplo, cuando el jugador decide reiniciar el juego o antes de que se muestre un nuevo resultado.
    this.divResultado.style.display = "none";
    this.botonReiniciar.style.display = "none";
    this.actualizarManos();
  }
  // Función para mostrar un mensaje en el área de mensajes
  mostrarMensaje(mensaje) {
    this.mensaje.textContent = mensaje;
  }
}
// Crear una instancia del juego cuando se carga la página
let juego = new JuegoDeCartas();
