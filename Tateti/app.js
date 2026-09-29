/* =========================================================
   TA TE TI CONTINUO
   Paradigmas y Lenguajes de Programación III

   MECÁNICA:

   - Juegan X y O por turnos.
   - Cada jugador puede tener como máximo 3 fichas activas.
   - Mientras tenga menos de 3, simplemente coloca fichas.
   - Cuando ya tiene 3, al colocar una nueva se elimina
     automáticamente su ficha más antigua.
   - De esta manera nunca se llena completamente el tablero.
   - La partida continúa indefinidamente hasta que un jugador
     forme una combinación ganadora.

   ========================================================= */


/* =========================================================
   1. REFERENCIAS DEL DOM
   ========================================================= */

const cells =
    [...document.querySelectorAll(".cell")];

const statusText =
    document.getElementById("status");

const phaseText =
    document.getElementById("phase");

const piecesXText =
    document.getElementById("pieces-x");

const piecesOText =
    document.getElementById("pieces-o");

const helpText =
    document.getElementById("help");

const restartButton =
    document.getElementById("restart");


/* =========================================================
   2. CONSTANTES
   ========================================================= */

const PLAYER_X = "X";
const PLAYER_O = "O";

const MAX_ACTIVE_PIECES = 3;


/*
 * Representación del tablero:
 *
 *      0 | 1 | 2
 *     ---+---+---
 *      3 | 4 | 5
 *     ---+---+---
 *      6 | 7 | 8
 */


/*
 * TODAS LAS COMBINACIONES GANADORAS POSIBLES
 *
 * En un tablero de 3 x 3 existen exactamente 8.
 */

const WINNING_COMBINATIONS = [

    /* =========================
       FILAS
       ========================= */

    [0, 1, 2], // Fila superior

    [3, 4, 5], // Fila central

    [6, 7, 8], // Fila inferior


    /* =========================
       COLUMNAS
       ========================= */

    [0, 3, 6], // Columna izquierda

    [1, 4, 7], // Columna central

    [2, 5, 8], // Columna derecha


    /* =========================
       DIAGONALES
       ========================= */

    [0, 4, 8], // Diagonal principal

    [2, 4, 6]  // Diagonal secundaria
];


/* =========================================================
   3. ESTADO DEL JUEGO
   ========================================================= */


/*
 * Cada posición representa una casilla.
 *
 * ""  = vacía
 * "X" = Jugador X
 * "O" = Jugador O
 */

let board =
    Array(9).fill("");


/*
 * Jugador que debe realizar la próxima jugada.
 */

let currentPlayer =
    PLAYER_X;


/*
 * Guarda las posiciones ocupadas por cada jugador
 * respetando el orden en que fueron colocadas.
 *
 * El primer elemento es siempre la ficha más antigua.
 */

let playerPieces = {

    [PLAYER_X]: [],

    [PLAYER_O]: []
};


/*
 * Indica si la partida terminó.
 */

let gameOver =
    false;


/* =========================================================
   4. EVENTOS
   ========================================================= */


/*
 * Cada casilla escucha un clic.
 */

cells.forEach((cell) => {

    cell.addEventListener(
        "click",
        handleCellClick
    );
});


/*
 * Botón para reiniciar.
 */

restartButton.addEventListener(
    "click",
    restartGame
);


/* =========================================================
   5. JUGADA PRINCIPAL
   ========================================================= */

/**
 * Procesa el clic realizado sobre una casilla.
 *
 * @param {MouseEvent} event
 */
function handleCellClick(event) {

    /*
     * Si ya existe un ganador,
     * no se permiten más movimientos.
     */

    if (gameOver) {

        return;
    }


    const selectedIndex =
        Number(
            event.currentTarget.dataset.index
        );


    /*
     * No se puede colocar una ficha
     * sobre una casilla ocupada.
     */

    if (!isCellEmpty(selectedIndex)) {

        showMessage(
            "Esa casilla ya está ocupada."
        );

        return;
    }


    playTurn(selectedIndex);
}


/* =========================================================
   6. REALIZAR TURNO
   ========================================================= */

/**
 * Realiza una jugada completa.
 *
 * @param {number} selectedIndex
 */
function playTurn(selectedIndex) {

    /*
     * Si el jugador ya posee tres fichas,
     * se elimina primero la más antigua.
     */

    if (
        playerPieces[currentPlayer].length
        === MAX_ACTIVE_PIECES
    ) {

        removeOldestPiece(
            currentPlayer
        );
    }


    /*
     * Colocamos la nueva ficha.
     */

    placePiece(
        currentPlayer,
        selectedIndex
    );


    /*
     * Actualizamos inmediatamente
     * la representación visual.
     */

    renderGame();


    /*
     * Verificamos las 8 combinaciones
     * ganadoras posibles.
     */

    const winningCombination =
        findWinningCombination();


    if (winningCombination) {

        finishGame(
            winningCombination
        );

        return;
    }


    /*
     * Si nadie ganó,
     * cambia el turno.
     */

    changeTurn();


    renderGame();
}


/* =========================================================
   7. COLOCAR FICHA
   ========================================================= */

/**
 * Coloca una ficha en el tablero.
 *
 * @param {string} player
 * @param {number} index
 */
function placePiece(
    player,
    index
) {

    board[index] =
        player;


    /*
     * Guardamos el índice al final.
     *
     * Esto permite conservar
     * el orden cronológico.
     */

    playerPieces[player].push(
        index
    );
}


/* =========================================================
   8. ELIMINAR FICHA MÁS ANTIGUA
   ========================================================= */

/**
 * Elimina la ficha más antigua del jugador.
 *
 * @param {string} player
 */
function removeOldestPiece(player) {

    /*
     * shift() devuelve y elimina
     * el primer elemento del arreglo.
     */

    const oldestIndex =
        playerPieces[player].shift();


    /*
     * Liberamos esa posición.
     */

    board[oldestIndex] =
        "";
}


/* =========================================================
   9. VALIDAR CASILLA
   ========================================================= */

/**
 * Comprueba si una posición está libre.
 *
 * @param {number} index
 * @returns {boolean}
 */
function isCellEmpty(index) {

    return board[index] === "";
}


/* =========================================================
   10. COMPROBAR GANADOR
   ========================================================= */

/**
 * Recorre las 8 combinaciones ganadoras.
 *
 * Devuelve la combinación encontrada
 * o null cuando todavía no hay ganador.
 *
 * @returns {number[] | null}
 */
function findWinningCombination() {

    for (
        const combination
        of WINNING_COMBINATIONS
    ) {

        const [a, b, c] =
            combination;


        const samePlayer =

            board[a] !== ""

            &&

            board[a] === board[b]

            &&

            board[a] === board[c];


        if (samePlayer) {

            return combination;
        }
    }


    return null;
}


/* =========================================================
   11. FINALIZAR PARTIDA
   ========================================================= */

/**
 * Finaliza el juego cuando existe un ganador.
 *
 * @param {number[]} winningCombination
 */
function finishGame(
    winningCombination
) {

    gameOver =
        true;


    phaseText.textContent =
        "Partida finalizada";


    statusText.textContent =
        `¡Ganó el Jugador ${currentPlayer}!`;


    helpText.textContent =

        "Se formó una línea de tres fichas iguales. "
        + "Reiniciá la partida para volver a jugar.";


    /*
     * Resaltamos las tres casillas
     * responsables de la victoria.
     */

    winningCombination.forEach(
        (index) => {

            cells[index]
                .classList
                .add(
                    "cell--winner"
                );
        }
    );
}


/* =========================================================
   12. CAMBIO DE TURNO
   ========================================================= */

/**
 * Cambia el jugador actual.
 */
function changeTurn() {

    currentPlayer =

        currentPlayer === PLAYER_X

            ? PLAYER_O

            : PLAYER_X;
}


/* =========================================================
   13. RENDER GENERAL
   ========================================================= */

/**
 * Actualiza toda la interfaz.
 */
function renderGame() {

    renderBoard();

    renderCounters();

    renderInformation();
}


/* =========================================================
   14. RENDER DEL TABLERO
   ========================================================= */

/**
 * Actualiza visualmente las 9 casillas.
 */
function renderBoard() {

    cells.forEach(
        (cell, index) => {

            const value =
                board[index];


            /*
             * Mostramos X, O o vacío.
             */

            cell.textContent =
                value;


            /*
             * Limpiamos clases dinámicas.
             */

            cell.classList.remove(
                "cell--x",
                "cell--o",
                "cell--oldest"
            );


            /*
             * Actualizamos accesibilidad.
             */

            const stateDescription =

                value === ""

                    ? "vacía"

                    : `ocupada por ${value}`;


            cell.setAttribute(

                "aria-label",

                `Casilla ${index + 1}, ${stateDescription}`
            );


            /*
             * Estilo de X.
             */

            if (
                value === PLAYER_X
            ) {

                cell.classList.add(
                    "cell--x"
                );
            }


            /*
             * Estilo de O.
             */

            if (
                value === PLAYER_O
            ) {

                cell.classList.add(
                    "cell--o"
                );
            }
        }
    );


    /*
     * Marcamos la ficha más antigua
     * del jugador actual.
     *
     * Solo se marca cuando ese jugador
     * ya posee tres fichas.
     */

    highlightOldestPiece();
}


/* =========================================================
   15. MARCAR FICHA MÁS ANTIGUA
   ========================================================= */

/**
 * Marca visualmente la ficha que será
 * eliminada en la próxima jugada.
 */
function highlightOldestPiece() {

    const pieces =
        playerPieces[currentPlayer];


    if (
        pieces.length
        !== MAX_ACTIVE_PIECES
    ) {

        return;
    }


    const oldestIndex =
        pieces[0];


    cells[oldestIndex]
        .classList
        .add(
            "cell--oldest"
        );
}


/* =========================================================
   16. CONTADORES
   ========================================================= */

/**
 * Actualiza la cantidad de fichas activas.
 */
function renderCounters() {

    const piecesX =
        playerPieces[PLAYER_X].length;


    const piecesO =
        playerPieces[PLAYER_O].length;


    piecesXText.textContent =

        `Fichas activas: ${piecesX} / ${MAX_ACTIVE_PIECES}`;


    piecesOText.textContent =

        `Fichas activas: ${piecesO} / ${MAX_ACTIVE_PIECES}`;
}


/* =========================================================
   17. INFORMACIÓN DE TURNO
   ========================================================= */

/**
 * Actualiza la información principal.
 */
function renderInformation() {

    if (gameOver) {

        return;
    }


    phaseText.textContent =
        "Partida continua";


    statusText.textContent =
        `Turno del Jugador ${currentPlayer}`;


    const currentPieces =
        playerPieces[currentPlayer].length;


    /*
     * Cuando todavía tiene menos
     * de tres fichas.
     */

    if (
        currentPieces
        < MAX_ACTIVE_PIECES
    ) {

        helpText.textContent =

            `Jugador ${currentPlayer}: `
            + "seleccioná una casilla vacía "
            + "para colocar tu ficha.";

        return;
    }


    /*
     * Cuando ya posee tres fichas,
     * avisamos que se reemplazará
     * la más antigua.
     */

    helpText.textContent =

        `Jugador ${currentPlayer}: ya tenés tres fichas. `
        + "La ficha marcada como PRÓXIMA desaparecerá "
        + "cuando coloques la nueva.";
}


/* =========================================================
   18. MENSAJES
   ========================================================= */

/**
 * Muestra un mensaje en el panel central.
 *
 * @param {string} message
 */
function showMessage(message) {

    statusText.textContent =
        message;
}


/* =========================================================
   19. REINICIAR JUEGO
   ========================================================= */

/**
 * Restablece completamente la partida.
 */
function restartGame() {

    /*
     * Limpiamos tablero.
     */

    board =
        Array(9).fill("");


    /*
     * X siempre comienza.
     */

    currentPlayer =
        PLAYER_X;


    /*
     * Reiniciamos las fichas
     * de ambos jugadores.
     */

    playerPieces = {

        [PLAYER_X]: [],

        [PLAYER_O]: []
    };


    /*
     * La partida vuelve a estar activa.
     */

    gameOver =
        false;


    /*
     * Eliminamos cualquier clase visual
     * que haya quedado de la partida anterior.
     */

    cells.forEach(
        (cell) => {

            cell.classList.remove(
                "cell--winner",
                "cell--oldest"
            );
        }
    );


    /*
     * Actualizamos la interfaz.
     */

    renderGame();
}


/* =========================================================
   20. INICIALIZACIÓN
   ========================================================= */

/*
 * Primera representación del juego
 * cuando se abre la página.
 */

renderGame();