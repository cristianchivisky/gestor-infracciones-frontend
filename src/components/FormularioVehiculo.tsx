import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Vehiculo, FormularioVehiculoProps } from '@/types/vehiculo';

const FormularioVehiculo: React.FC<FormularioVehiculoProps> = ({ initialData }) => {
    const [vehiculoData, setVehiculoData] = useState<Vehiculo>({
        anioFabricacion: 0,
        domicilioPropietarioCalle: '',
        domicilioPropietarioNumero: 0,
        domicilioPropietarioCiudad: '',
        marca: '',
        modelo: '',
        nombrePropietario: '',
        apellidoPropietario: '',
        patenteVehiculo: ''
    });

    // Update state with initial data if provided
    useEffect(() => {
        if (initialData) {
            setVehiculoData(initialData);
        }
    }, [initialData]);

    // Handle form submission
    const handleVehiculoSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Define mutation for GraphQL request
        const mutation = initialData ? `
        mutation UpdateVehiculo($patenteVehiculo: String!, $anioFabricacion: Int!, $domicilioPropietarioCalle: String!, $domicilioPropietarioNumero: Int!, $domicilioPropietarioCiudad: String!, $marca: String!, $modelo: String!, $nombrePropietario: String!, $apellidoPropietario: String!) {
            updateVehiculo(patenteVehiculo: $patenteVehiculo, anioFabricacion: $anioFabricacion, domicilioPropietarioCalle: $domicilioPropietarioCalle, domicilioPropietarioNumero: $domicilioPropietarioNumero, domicilioPropietarioCiudad: $domicilioPropietarioCiudad, marca: $marca, modelo: $modelo, nombrePropietario: $nombrePropietario, apellidoPropietario: $apellidoPropietario) {
                vehiculo {
                    patenteVehiculo
                    marca
                    modelo
                    anioFabricacion
                    nombrePropietario
                    apellidoPropietario
                    domicilioPropietarioCalle
                    domicilioPropietarioNumero
                    domicilioPropietarioCiudad
                }
            }
        }
        ` : `mutation CreateVehiculo($anioFabricacion: Int!, $domicilioPropietarioCalle: String!, $domicilioPropietarioNumero: Int!, $domicilioPropietarioCiudad: String!, $marca: String!, $modelo: String!, $nombrePropietario: String!, $apellidoPropietario: String!, $patenteVehiculo: String!) {
                createVehiculo(anioFabricacion: $anioFabricacion, domicilioPropietarioCalle: $domicilioPropietarioCalle, domicilioPropietarioNumero: $domicilioPropietarioNumero, domicilioPropietarioCiudad: $domicilioPropietarioCiudad, marca: $marca, modelo: $modelo, nombrePropietario: $nombrePropietario, apellidoPropietario: $apellidoPropietario, patenteVehiculo: $patenteVehiculo) {
                    vehiculo {
                    patenteVehiculo
                    marca
                    modelo
                    anioFabricacion
                    nombrePropietario
                    apellidoPropietario
                    domicilioPropietarioCalle
                    domicilioPropietarioNumero
                    domicilioPropietarioCiudad
                }
            }
        }`;
        const variables = {
            anioFabricacion: vehiculoData.anioFabricacion,
            domicilioPropietarioCalle: vehiculoData.domicilioPropietarioCalle,
            domicilioPropietarioNumero: vehiculoData.domicilioPropietarioNumero,
            domicilioPropietarioCiudad: vehiculoData.domicilioPropietarioCiudad,
            marca: vehiculoData.marca,
            modelo: vehiculoData.modelo,
            nombrePropietario: vehiculoData.nombrePropietario,
            apellidoPropietario: vehiculoData.apellidoPropietario,
            patenteVehiculo: vehiculoData.patenteVehiculo
        };
        console.log(variables)
        try {
            // Make a POST request to the GraphQL API
            const response = await axios.post('http://localhost:5000/graphql', { query: mutation, variables }, { headers: { 'Content-Type': 'application/json' } });
            if (response.data.errors) {
                toast.error(`Error ${initialData ? 'actualizando' : 'creando'} vehículo`);
                console.error('GraphQL Errors:', response.data.errors);
            } else {
                toast.success(`Vehículo ${initialData ? 'actualizado' : 'creado'} con éxito`);
            }
        } catch (error) {
            toast.error(`Error ${initialData ? 'actualizando' : 'creando'} vehículo`);
            console.error('Error en la operación de registro:', error);
        }
    };

    return (
        <form onSubmit={handleVehiculoSubmit} className="bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
            <h2 className="text-2xl mb-4">{initialData ? 'Actualizar Vehículo' : 'Crear Vehículo'}</h2>
            <div className="grid grid-cols-2 gap-4">
                <label className="col-span-2">
                    Patente del Vehículo:
                    <input
                        type="text"
                        value={vehiculoData.patenteVehiculo || ''}
                        onChange={(e) => setVehiculoData({ ...vehiculoData, patenteVehiculo: e.target.value })}
                        required
                        placeholder="Patente Vehículo"
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    />
                </label>
                <label>
                    Año de Fabricación:
                    <input
                        type="number"
                        value={vehiculoData.anioFabricacion || ''}
                        onChange={(e) => setVehiculoData({ ...vehiculoData, anioFabricacion: Number(e.target.value) })}
                        required
                        placeholder="Año de Fabricación"
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    />
                </label>
                <label className="col-span-2">
                    Nombre del Propietario:
                    <input type="text" 
                        name="nombrePropietario" 
                        value={vehiculoData.nombrePropietario} 
                        onChange={(e) => setVehiculoData({ ...vehiculoData, nombrePropietario: e.target.value })} 
                        placeholder="Nombre Propietario" 
                        required
                        className="w-full p-2 mb-4 border border-gray-300 rounded"/>
                </label>
                <label className="col-span-2">
                    Apellido del Propietario:
                    <input type="text" 
                        name="apellidoPropietario" 
                        value={vehiculoData.apellidoPropietario} 
                        onChange={(e) => setVehiculoData({ ...vehiculoData, apellidoPropietario: e.target.value })} 
                        placeholder="Apellido Propietario" 
                        required
                        className="w-full p-2 mb-4 border border-gray-300 rounded"/>
                </label>
                <label className="col-span-2">
                    Domicilio Calle:
                    <input
                        type="text"
                        name="domicilioPropietarioCalle"
                        value={vehiculoData.domicilioPropietarioCalle || ''}
                        onChange={(e) => setVehiculoData({ ...vehiculoData, domicilioPropietarioCalle: e.target.value })}
                        required
                        placeholder="Domicilio Propietario Calle"
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    />
                </label>
                <label className="col-span-2">
                    Domicilio Número:
                    <input
                        type="text"
                        name="domicilioPropietarioNumero"
                        value={vehiculoData.domicilioPropietarioNumero || ''}
                        onChange={(e) => setVehiculoData({ ...vehiculoData, domicilioPropietarioNumero: Number(e.target.value) })}
                        required
                        placeholder="Domicilio Propietario Número" 
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    />
                </label>
                <label className="col-span-2">
                    Ciudad:
                    <input
                        type="text"
                        value={vehiculoData.domicilioPropietarioCiudad || ''}
                        onChange={(e) => setVehiculoData({ ...vehiculoData, domicilioPropietarioCiudad: e.target.value })}
                        required
                        placeholder="Domicilio Ciudad"
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
            </div>
            <button type="submit" className="w-full mt-4 p-2 bg-blue-500 hover:bg-blue-700 text-white rounded">
                {initialData ? 'Actualizar Vehículo' : 'Guardar Vehículo'}
            </button>
        </form>
    );
};

export default FormularioVehiculo;
