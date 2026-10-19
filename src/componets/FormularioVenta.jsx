import React, { useState, useEffect } from 'react';
import { api } from '../api';

function FormularioVenta() {
    const [formData, setFormData] = useState({
        cliente_id: '',
        dron_id: '',
        cantidad: '',
        fecha: ''
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
        api.post('/ventas', formData)
            .then(res => {
                alert(res.data.message);
                setFormData({ cliente_id: '', dron_id: '', cantidad: '', fecha: '' });
                window.location.reload(); // Recarga para actualizar la tabla
            })
            .catch(err => console.error('Error al registrar venta:', err));
    };

    return (
        <div>
            <h2>Registrar Venta de Dron</h2>
            <form onSubmit={handleSubmit}>
                <select name="cliente_id" value={formData.cliente_id} onChange={handleChange} required>
                    <option value="">Seleccione Cliente</option>
                    {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre} ({c.tipo_licencia})</option>)}
                </select>

                <select name="dron_id" value={formData.dron_id} onChange={handleChange} required>
                    <option value="">Seleccione Modelo de Dron</option>
                    {drones.map(d => <option key={d.id} value={d.id}>{d.nombre} - ${d.precio}</option>)}
                </select>

                <input type="number" name="cantidad" placeholder="Cantidad" value={formData.cantidad} onChange={handleChange} required />
                <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} required />
                
                <button type="submit">Guardar Venta</button>
            </form>
        </div>
    );
}

export default FormularioVenta;