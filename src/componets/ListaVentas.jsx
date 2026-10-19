import React, { useEffect, useState } from 'react';
import { api } from '../api';
import EditarVenta from '../EditarVenta';

function ListaVentas() {
    const [ventas, setVentas] = useState([]);
    const [ventaSeleccionada, setVentaSeleccionada] = useState(null);

    const cargarVentas = () => {
        api.get('/ventas')
            .then(res => setVentas(res.data))
            .catch(err => console.error('Error al obtener ventas:', err));
    };

    useEffect(() => {
        cargarVentas();
    }, []);

    const eliminarVenta = (id) => {
        if (window.confirm('¿Seguro que deseas eliminar esta venta de dron?')) {
            api.delete(`/ventas/${id}`)
                .then(res => {
                    alert(res.data.message);
                    cargarVentas();
                })
                .catch(err => console.error('Error al eliminar:', err));
        }
    };

    return (
        <div>
            <h2>Historial de Ventas - Tienda de Drones</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Cliente</th>
                        <th>Dron</th>
                        <th>Cantidad</th>
                        <th>Precio U.</th>
                        <th>Total</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {ventas.map(v => (
                        <tr key={v.id}>
                            <td>{v.cliente}</td>
                            <td>{v.dron}</td>
                            <td>{v.cantidad}</td>
                            <td>${v.precio}</td>
                            <td>${v.total}</td>
                            <td>{v.fecha}</td>
                            <td>
                                <button onClick={() => setVentaSeleccionada(v)}>Editar</button>
                                <button onClick={() => eliminarVenta(v.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {ventaSeleccionada && (
                <EditarVenta 
                    venta={ventaSeleccionada} 
                    onUpdate={() => { setVentaSeleccionada(null); cargarVentas(); }} 
                />
            )}
        </div>
    );
}

export default ListaVentas;