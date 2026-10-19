import React from 'react';
import FormularioVenta from './components/FormularioVenta';
import ListaVentas from './components/ListaVentas';

function App() {
    return (
        <div style={{ padding: '20px' }}>
            <h1>Sistema de Gestión - Tienda de Drones 🛸</h1>
            <FormularioVenta />
            <hr />
            <ListaVentas />
        </div>
    );
}

export default App;