'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Formulario = () => {
    const [infraccionData, setInfraccionData] = useState({
        codigoInfraccion: '',
        fecha: '',
        hora: '',
        observaciones: '',
        monto: '',
        pagado: '',
        patenteVehiculoId: '',
        numeroRegistroId: ''
    });
      const [registroData, setRegistroData] = useState({
        numeroRegistro: '',
        nombreyapellido: '',
        domicilio: '',
        edad: '',
        fechaEmision: '',
        fechaVencimiento: ''
    });
    const [vehiculoData, setVehiculoData] = useState({
        anioFabricacion: '',
        domicilioPropietario: '',
        marca: '',
        modelo: '',
        nombreyapellidoPropietario: '',
        patenteVehiculo: '',
    });
    const [vehiculosOptions, setVehiculosOptions] = useState([]);
    const [registrosOptions, setRegistrosOptions] = useState([]);

    useEffect(() => {
        const fetchVehiculosOptions = async () => {
            const query = `
                query {
                    vehiculos {
                        patenteVehiculo
                    }
                }
            `;
            try {
                const response = await axios.post(
                    'http://localhost:5000/graphql',
                    {
                        query
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
                const vehiculos = response.data.data.vehiculos.map((vehiculo) => ({
                    value: vehiculo.patenteVehiculo,
                    label: vehiculo.patenteVehiculo
                }));
                setVehiculosOptions(vehiculos);
            } catch (error) {
                console.error('Error obteniendo patentes de vehículos:', error);
            }
        };
        const fetchRegistrosOptions = async () => {
            const query = `
                query {
                    registros {
                        numeroRegistro
                    }
                }
            `;
            try {
                const response = await axios.post(
                    'http://localhost:5000/graphql',
                    {
                        query
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
                const registros = response.data.data.registros.map((registro) => ({
                    value: registro.numeroRegistro,
                    label: registro.numeroRegistro.toString()
                }));
                setRegistrosOptions(registros);
            } catch (error) {
                console.error('Error obteniendo números de registros:', error);
            }
        };

        fetchVehiculosOptions();
        fetchRegistrosOptions();
    }, []);

    const handleInfraccionSubmit = async (e) => {
        e.preventDefault();
        const mutation = `
            mutation CreateInfraccion($codigoInfraccion: String!, $fecha: String!, $hora: String!, $observaciones: String, $monto: Float!, $pagado: Boolean!, $patenteVehiculoId: String!, $numeroRegistroId: Int!) {
                createInfraccion(codigoInfraccion: $codigoInfraccion, fecha: $fecha, hora: $hora, observaciones: $observaciones, monto: $monto, pagado: $pagado, patenteVehiculoId: $patenteVehiculoId, numeroRegistroId: $numeroRegistroId) {
                infraccion {
                    codigoInfraccion
                    fecha
                    hora
                    observaciones
                    monto
                    pagado
                }
                }
            }
        `;
        const variables = {
            codigoInfraccion: infraccionData.codigoInfraccion,
            fecha: infraccionData.fecha,
            hora: infraccionData.hora,
            observaciones: infraccionData.observaciones,
            monto: parseFloat(infraccionData.monto),
            pagado: infraccionData.pagado === 'true',
            patenteVehiculoId: infraccionData.patenteVehiculoId,
            numeroRegistroId: parseInt(infraccionData.numeroRegistroId, 10)
        };
    
        try {
            const response = await axios.post(
                'http://localhost:5000/graphql',
                {
                query: mutation,
                variables,
                },
                {
                headers: {
                    'Content-Type': 'application/json',
                },
                }
            );
            if (response.data.errors) {
                toast.error('Error creando infracción');
                console.error('GraphQL Errors:', response.data.errors);
            } else {
                toast.success('Infracción creada con éxito');
                console.log('Infracción creada:', response.data.data.createInfraccion.infraccion);
                // Manejar cualquier acción post-creación
            }
        } catch (error) {
            toast.error('Error creando infracción');
            console.error('Error creando infracción:', error);
        }
    };
    
    const handleRegistroSubmit = async (e) => {
        e.preventDefault();
        const mutation = `
            mutation CreateRegistro($numeroRegistro: Int!, $nombreyapellido: String!, $domicilio: String!, $edad: Int!, $fechaEmision: String!, $fechaVencimiento: String!) {
                createRegistro(numeroRegistro: $numeroRegistro, nombreyapellido: $nombreyapellido, domicilio: $domicilio, edad: $edad, fechaEmision: $fechaEmision, fechaVencimiento: $fechaVencimiento) {
                registro {
                    numeroRegistro
                    nombreyapellido
                    domicilio
                    edad
                    fechaEmision
                    fechaVencimiento
                }
                }
            }
        `;
        const variables = {
            numeroRegistro: parseInt(registroData.numeroRegistro, 10),
            nombreyapellido: registroData.nombreyapellido,
            domicilio: registroData.domicilio,
            edad: parseInt(registroData.edad, 10),
            fechaEmision: registroData.fechaEmision,
            fechaVencimiento: registroData.fechaVencimiento
        };
    
        try {
            const response = await axios.post(
                'http://localhost:5000/graphql',
                {
                query: mutation,
                variables,
                },
                {
                headers: {
                    'Content-Type': 'application/json',
                },
                }
            );
            if (response.data.errors) {
                toast.error('Error creando registro');
                console.error('GraphQL Errors:', response.data.errors);
            } else {
                toast.success('Registro creado con éxito');
                console.log('Registro creado:', response.data.data.createRegistro.registro);
                // Manejar cualquier acción post-creación
            }
        } catch (error) {
            toast.error('Error creando registro');
            console.error('Error creando registro:', error);
        }
    };
    
    const handleVehiculoSubmit = async (e) => {
        e.preventDefault();
        const mutation = `
            mutation CreateVehiculo($anioFabricacion: Int!, $domicilioPropietario: String!, $marca: String!, $modelo: String!, $nombreyapellidoPropietario: String!, $patenteVehiculo: String!) {
                createVehiculo(anioFabricacion: $anioFabricacion, domicilioPropietario: $domicilioPropietario, marca: $marca, modelo: $modelo, nombreyapellidoPropietario: $nombreyapellidoPropietario, patenteVehiculo: $patenteVehiculo) {
                vehiculo {
                    patenteVehiculo
                    marca
                    modelo
                    anioFabricacion
                    nombreyapellidoPropietario
                    domicilioPropietario
                }
                }
            }
        `;
        const variables = {
            anioFabricacion: parseInt(vehiculoData.anioFabricacion, 10),
            domicilioPropietario: vehiculoData.domicilioPropietario,
            marca: vehiculoData.marca,
            modelo: vehiculoData.modelo,
            nombreyapellidoPropietario: vehiculoData.nombreyapellidoPropietario,
            patenteVehiculo: vehiculoData.patenteVehiculo,
        };
    
        try {
            const response = await axios.post(
                'http://localhost:5000/graphql',
                {
                    query: mutation,
                    variables,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (response.data.errors) {
                toast.error('Error creando vehículo');
                console.error('GraphQL Errors:', response.data.errors);
            } else {
                toast.success('Vehículo creado con éxito');
                console.log('Vehículo creado:', response.data.data.createVehiculo.vehiculo);
                // Manejar cualquier acción post-creación
            }
        } catch (error) {
            toast.error('Error creando vehículo');
            console.error('Error creando vehículo:', error);
        }
    };
      
    return (
        <div className="flex flex-wrap justify-center min-h-screen p-4">
            <div className="w-full lg:w-1/3 p-4">
                {/* Formulario de Infracción */}
                <form onSubmit={handleInfraccionSubmit} className="bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
                <h2 className="text-2xl mb-4">Formulario de Infracción</h2>
                <div className="grid grid-cols-2 gap-4">
                    <label className="col-span-2">
                    Código de Infracción:
                    <input
                        type="text"
                        value={infraccionData.codigoInfraccion || ''}
                        onChange={(e) =>
                        setInfraccionData({ ...infraccionData, codigoInfraccion: e.target.value })
                        }
                        required
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    />
                    </label>
                    <label>
                    Fecha:
                    <input
                        type="date"
                        value={infraccionData.fecha || ''}
                        onChange={(e) => setInfraccionData({ ...infraccionData, fecha: e.target.value })}
                        required
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    />
                    </label>
                    <label>
                    Hora:
                    <input
                        type="time"
                        value={infraccionData.hora || ''}
                        onChange={(e) => setInfraccionData({ ...infraccionData, hora: e.target.value })}
                        required
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    />
                    </label>
                    <label className="col-span-2">
                    Observaciones:
                    <textarea
                        value={infraccionData.observaciones || ''}
                        onChange={(e) => setInfraccionData({ ...infraccionData, observaciones: e.target.value })}
                        required
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    />
                    </label>
                    <label>
                    Monto:
                    <input
                        type="number"
                        value={infraccionData.monto || ''}
                        onChange={(e) => setInfraccionData({ ...infraccionData, monto: e.target.value })}
                        required
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    />
                    </label>
                    <label>
                    Pagado:
                    <select
                        value={infraccionData.pagado || ''}
                        onChange={(e) => setInfraccionData({ ...infraccionData, pagado: e.target.value })}
                        required
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    >
                        <option value="">Selecciona...</option>
                        <option value="true">Sí</option>
                        <option value="false">No</option>
                    </select>
                    </label>
                    <label className="col-span-2">
                    Patente del Vehículo:
                    <select
                        value={infraccionData.patenteVehiculoId || ''}
                        onChange={(e) => setInfraccionData({ ...infraccionData, patenteVehiculoId: e.target.value })}
                        required
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    >
                        <option value="">Selecciona...</option>
                        {vehiculosOptions.map((option, index) => (
                            <option key={index} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                    </label>
                    <label className="col-span-2">
                    Número de Registro:
                    <select
                        value={infraccionData.numeroRegistroId || ''}
                        onChange={(e) => setInfraccionData({ ...infraccionData, numeroRegistroId: e.target.value })}
                        required
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    >
                        <option value="">Selecciona...</option>
                        {registrosOptions.map((option, index) => (
                            <option key={index} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                    </label>
                </div>
                <button type="submit" className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded">Guardar Infracción</button>
                </form>
            </div>
            <div className="w-full lg:w-1/3 p-4">
                {/* Formulario de Vehículo */}
                <form onSubmit={handleVehiculoSubmit} className="bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
                <h2 className="text-2xl mb-4">Formulario de Vehículo</h2>
                <div className="grid grid-cols-2 gap-4">
                    <label className="col-span-2">
                    Patente del Vehículo:
                    <input
                        type="text"
                        value={vehiculoData.patenteVehiculo || ''}
                        onChange={(e) => setVehiculoData({ ...vehiculoData, patenteVehiculo: e.target.value })}
                        required
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    />
                    </label>
                    <label>
                    Año de Fabricación:
                    <input
                        type="number"
                        value={vehiculoData.anioFabricacion || ''}
                        onChange={(e) => setVehiculoData({ ...vehiculoData, anioFabricacion: e.target.value })}
                        required
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    />
                    </label>
                    <label className="col-span-2">
                    Nombre y Apellido del Propietario:
                    <input
                        type="text"
                        value={vehiculoData.nombreyapellidoPropietario || ''}
                        onChange={(e) => setVehiculoData({ ...vehiculoData, nombreyapellidoPropietario: e.target.value })}
                        required
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    />
                    </label>
                    <label className="col-span-2">
                    Domicilio del Propietario:
                    <input
                        type="text"
                        value={vehiculoData.domicilioPropietario || ''}
                        onChange={(e) => setVehiculoData({ ...vehiculoData, domicilioPropietario: e.target.value })}
                        required
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    />
                    </label>
                    <label className="col-span-2">
                    Modelo del Vehículo:
                    <input
                        type="text"
                        value={vehiculoData.modelo || ''}
                        onChange={(e) => setVehiculoData({ ...vehiculoData, modelo: e.target.value })}
                        required
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    />
                    </label>
                    <label className="col-span-2">
                    Marca del Vehículo:
                    <input
                        type="text"
                        value={vehiculoData.marca || ''}
                        onChange={(e) => setVehiculoData({ ...vehiculoData, marca: e.target.value })}
                        required
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    />
                    </label>
                </div>
                <button type="submit" className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded">Guardar Vehículo</button>
                </form>
            </div>
            <div className="w-full lg:w-1/3 p-4">
                {/* Formulario de Registro */}
                <form onSubmit={handleRegistroSubmit} className="bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
                <h2 className="text-2xl mb-4">Formulario de Registro</h2>
                <div className="grid grid-cols-2 gap-4">
                    <label className="col-span-2">
                    Número de Registro:
                    <input
                        type="text"
                        value={registroData.numeroRegistro || ''}
                        onChange={(e) => setRegistroData({ ...registroData, numeroRegistro: e.target.value })}
                        required
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    />
                    </label>
                    <label className="col-span-2">
                    Nombre y Apellido:
                    <input
                        type="text"
                        value={registroData.nombreyapellido || ''}
                        onChange={(e) => setRegistroData({ ...registroData, nombreyapellido: e.target.value })}
                        required
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    />
                    </label>
                    <label className="col-span-2">
                    Domicilio:
                    <input
                        type="text"
                        value={registroData.domicilio || ''}
                        onChange={(e) => setRegistroData({ ...registroData, domicilio: e.target.value })}
                        required
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    />
                    </label>
                    <label>
                    Edad:
                    <input
                        type="number"
                        value={registroData.edad || ''}
                        onChange={(e) => setRegistroData({ ...registroData, edad: e.target.value })}
                        required
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    />
                    </label>
                    <label>
                    Fecha de Emisión:
                    <input
                        type="date"
                        value={registroData.fechaEmision || ''}
                        onChange={(e) => setRegistroData({ ...registroData, fechaEmision: e.target.value })}
                        required
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    />
                    </label>
                    <label>
                    Fecha de Vencimiento:
                    <input
                        type="date"
                        value={registroData.fechaVencimiento || ''}
                        onChange={(e) => setRegistroData({ ...registroData, fechaVencimiento: e.target.value })}
                        required
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    />
                    </label>
                </div>
                <button type="submit" className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded">Guardar Registro</button>
                </form>
            </div>
        </div>
    );
};

export default Formulario;
