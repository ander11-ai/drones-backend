import React, { useState, useEffect } from 'react';
import { api } from '../api';

function EditarVenta({ venta, onUpdate }) {
    const [formData, setFormData] = useState({
        cliente_id: venta.cliente_id,
        dron_id: venta.dron_id,
        cantidad: venta.cantidad,
        fecha: venta.fecha
    });

    const [clientes, setClientes] = useState([]);
    const [drones, setDrones] = useState([]);

    useEffect(() => {
        api.get('/clientes').then(res => setClientes(res.data)).catch(err => console.error(err));
        api.get('/drones').then(res => setDrones(res.data)).catch(err => console.error(err));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        api.put(`/ventas/${venta.id}`, formData)
            .then(res => {
                alert(res.data.message);
                onUpdate();
            })
            .catch(err => console.error('Error al actualizar:', err));
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Editar Venta ID: {venta.id}</h3>
            <select name="cliente_id" value={formData.cliente_id} onChange={handleChange} required>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>

            <select name="dron_id" value={formData.dron_id} onChange={handleChange} required>
                {drones.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
            </select>

            <input type="number" name="cantidad" value={formData.cantidad} onChange={handleChange} required />
            <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} required />
            
            <button type="submit">Actualizar Venta</button>
        </form>
    );
}

export default EditarVenta;