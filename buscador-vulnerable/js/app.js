document.addEventListener('DOMContentLoaded', () => {
    const formBuscar = document.querySelector('#form-buscar');
    const inputBuscar = document.querySelector('#input-buscar');
    const contenedor = document.querySelector('#resultados');

    formBuscar.addEventListener('submit', async (e) => {
        e.preventDefault();

        const query = inputBuscar.value.trim();

        contenedor.textContent = 'Buscando en la base de datos...';

        try {
            const res = await fetch(
                `api/buscador-seguro.php?q=${encodeURIComponent(query)}`
            );

            const resultado = await res.json();

            if (res.ok && resultado.estado === 'exito') {
                renderizarProductos(resultado.data);
            } else {
                contenedor.textContent = 'No se encontraron productos.';
            }

        } catch (error) {
            console.error('Error:', error);
            contenedor.textContent = 'Error de conexión con el servidor.';
        }
    });

    function renderizarProductos(productos) {
        contenedor.innerHTML = '';

        if (!productos || productos.length === 0) {
            contenedor.textContent = 'Sin resultados.';
            return;
        }

        const fragmento = document.createDocumentFragment();

        productos.forEach((prod) => {
            const card = document.createElement('div');
            card.className = 'card-producto';

            const titulo = document.createElement('h4');
            titulo.textContent = prod.nombre;

            const categoria = document.createElement('p');
            categoria.textContent = `Categoría: ${prod.categoria}`;

            const precio = document.createElement('p');
            precio.textContent = `Precio: $${prod.precio}`;

            const stock = document.createElement('p');
            stock.textContent = `Stock: ${prod.stock}`;

            card.appendChild(titulo);
            card.appendChild(categoria);
            card.appendChild(precio);
            card.appendChild(stock);

            fragmento.appendChild(card);
        });

        contenedor.appendChild(fragmento);
    }
});