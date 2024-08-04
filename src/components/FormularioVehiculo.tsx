import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Vehiculo, FormularioVehiculoProps } from '@/types/vehiculo';
import { Toaster } from 'react-hot-toast'

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
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Validate inputs
    const validateInputs = () => {
        const currentYear = new Date().getFullYear();
        const newErrors: { [key: string]: string } = {};
    
        // Validate patenteVehiculo
        if (!vehiculoData.patenteVehiculo.trim()) {
            newErrors.patenteVehiculo = 'La patente no puede estar vacía.';
        } else if (!/^[A-Z0-9]+$/.test(vehiculoData.patenteVehiculo)) {
            newErrors.patenteVehiculo = 'La patente solo puede contener letras mayúsculas y números.';
        }
    
        // Validate anioFabricacion
        if (!vehiculoData.anioFabricacion) {
            newErrors.anioFabricacion = 'El año de fabricación no puede estar vacío.';
        } else if (!/^[0-9]+$/.test(vehiculoData.anioFabricacion.toString()) || vehiculoData.anioFabricacion <= 0) {
            newErrors.anioFabricacion = 'El año de fabricación debe ser un número entero mayor que cero.';
        } else if (vehiculoData.anioFabricacion > currentYear) {
            newErrors.anioFabricacion = 'El año de fabricación no puede ser mayor al año actual.';
        }
    
        // Validate nombrePropietario
        if (!vehiculoData.nombrePropietario.trim()) {
            newErrors.nombrePropietario = 'El nombre no puede estar vacío.';
        } else if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(vehiculoData.nombrePropietario)) {
            newErrors.nombrePropietario = 'El nombre solo puede contener letras y acentos.';
        }
    
        // Validate apellidoPropietario
        if (!vehiculoData.apellidoPropietario.trim()) {
            newErrors.apellidoPropietario = 'El apellido no puede estar vacío.';
        } else if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(vehiculoData.apellidoPropietario)) {
            newErrors.apellidoPropietario = 'El apellido solo puede contener letras y acentos.';
        }
    
        // Validate domicilioPropietarioCalle
        if (!vehiculoData.domicilioPropietarioCalle.trim()) {
            newErrors.domicilioPropietarioCalle = 'La calle no puede estar vacía.';
        } else if (!/^[A-Za-z0-9ÁÉÍÓÚáéíóúñÑ\s]+$/.test(vehiculoData.domicilioPropietarioCalle)) {
            newErrors.domicilioPropietarioCalle = 'La calle solo puede contener letras, números y acentos.';
        }
    
        // Validate domicilioPropietarioNumero
        if (!vehiculoData.domicilioPropietarioNumero) {
            newErrors.domicilioPropietarioNumero = 'El número de domicilio no puede estar vacío.';
        } else if (!/^[0-9]+$/.test(vehiculoData.domicilioPropietarioNumero.toString()) || vehiculoData.domicilioPropietarioNumero <= 0) {
            newErrors.domicilioPropietarioNumero = 'El número de domicilio debe ser un entero mayor que cero.';
        }
    
        // Validate domicilioPropietarioCiudad
        if (!vehiculoData.domicilioPropietarioCiudad.trim()) {
            newErrors.domicilioPropietarioCiudad = 'La ciudad no puede estar vacía.';
        } else if (!/^[A-Za-z0-9ÁÉÍÓÚáéíóúñÑ\s]+$/.test(vehiculoData.domicilioPropietarioCiudad)) {
            newErrors.domicilioPropietarioCiudad = 'La ciudad puede contener letras, números y acentos.';
        }
    
        // Validate marca
        if (!vehiculoData.marca.trim()) {
            newErrors.marca = 'La marca no puede estar vacía.';
        } else if (!/^[A-Za-z0-9ÁÉÍÓÚáéíóúñÑ\s]+$/.test(vehiculoData.marca)) {
            newErrors.marca = 'La marca solo puede contener letras y números.';
        }
    
        // Validate modelo
        if (!vehiculoData.modelo.trim()) {
            newErrors.modelo = 'El modelo no puede estar vacío.';
        } else if (!/^[A-Za-z0-9ÁÉÍÓÚáéíóúñÑ\s]+$/.test(vehiculoData.modelo)) {
            newErrors.modelo = 'El modelo solo puede contener letras y números.';
        }
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };    

    // Update state with initial data if provided
    useEffect(() => {
        if (initialData) {
            setVehiculoData(initialData);
        }
    }, [initialData]);

    // Handle form submission
    const handleVehiculoSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateInputs()) {
            toast.error('Corrige los errores en el formulario.', { duration: 5000 });
            return;
        }
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
        //console.log(variables)
        try {
            // Make a POST request to the GraphQL API
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}`, { query: mutation, variables }, { headers: { 'Content-Type': 'application/json' } });
            if (response.data.errors) {
                toast.error(`Error ${initialData ? 'actualizando' : 'creando'} vehículo`, { duration: 5000 });
                console.error('GraphQL Errors:', response.data.errors);
            } else {
                toast.success(`Vehículo ${initialData ? 'actualizado' : 'creado'} con éxito`, { duration: 5000 });
            }
        } catch (error) {
            toast.error(`Error ${initialData ? 'actualizando' : 'creando'} vehículo`, { duration: 5000 });
            console.error('Error en la operación de registro:', error);
        }
    };

    return (
        <div>
            <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 5000 }}/>
            <form onSubmit={handleVehiculoSubmit} className="bg-white dark:bg-gray-800 dark:text-gray-100 p-8 rounded-lg shadow-md max-w-lg mx-auto">
                <h2 className="text-2xl mb-4">{initialData ? 'Actualizar Vehículo' : 'Crear Vehículo'}</h2>
                <div className="grid grid-cols-2 gap-4">
                    <label className="col-span-2 dark:text-gray-100">
                        Patente del Vehículo:
                        <input
                            type="text"
                            value={vehiculoData.patenteVehiculo || ''}
                            onChange={(e) => setVehiculoData({ ...vehiculoData, patenteVehiculo: e.target.value })}
                            placeholder="Patente Vehículo"
                            className="w-full p-2 mb-4 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                        />
                        {errors.patenteVehiculo && <span className="text-red-500 text-xs">{errors.patenteVehiculo}</span>}
                    </label>
                    <label className="dark:text-gray-100">
                        Año de Fabricación:
                        <input
                            type="number"
                            value={vehiculoData.anioFabricacion || ''}
                            onChange={(e) => setVehiculoData({ ...vehiculoData, anioFabricacion: Number(e.target.value) })}
                            placeholder="Año de Fabricación"
                            className="w-full p-2 mb-4 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                        />
                        {errors.anioFabricacion && <span className="text-red-500 text-xs">{errors.anioFabricacion}</span>}
                    </label>
                    <label className="col-span-2 dark:text-gray-100">
                        Nombre del Propietario:
                        <input type="text" 
                            name="nombrePropietario" 
                            value={vehiculoData.nombrePropietario} 
                            onChange={(e) => setVehiculoData({ ...vehiculoData, nombrePropietario: e.target.value })} 
                            placeholder="Nombre Propietario" 
                            className="w-full p-2 mb-4 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"/>
                            {errors.nombrePropietario && <span className="text-red-500 text-xs">{errors.nombrePropietario}</span>}
                    </label>
                    <label className="col-span-2 dark:text-gray-100">
                        Apellido del Propietario:
                        <input type="text" 
                            name="apellidoPropietario" 
                            value={vehiculoData.apellidoPropietario} 
                            onChange={(e) => setVehiculoData({ ...vehiculoData, apellidoPropietario: e.target.value })} 
                            placeholder="Apellido Propietario" 
                            className="w-full p-2 mb-4 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"/>
                            {errors.apellidoPropietario && <span className="text-red-500 text-xs">{errors.apellidoPropietario}</span>}
                    </label>
                    <label className="col-span-2 dark:text-gray-100">
                        Domicilio Calle:
                        <input
                            type="text"
                            name="domicilioPropietarioCalle"
                            value={vehiculoData.domicilioPropietarioCalle || ''}
                            onChange={(e) => setVehiculoData({ ...vehiculoData, domicilioPropietarioCalle: e.target.value })}
                            placeholder="Domicilio Propietario Calle"
                            className="w-full p-2 mb-4 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                        />
                        {errors.domicilioPropietarioCalle && <span className="text-red-500 text-xs">{errors.domicilioPropietarioCalle}</span>}
                    </label>
                    <label className="col-span-2 dark:text-gray-100">
                        Domicilio Número:
                        <input
                            type="text"
                            name="domicilioPropietarioNumero"
                            value={vehiculoData.domicilioPropietarioNumero || ''}
                            onChange={(e) => setVehiculoData({ ...vehiculoData, domicilioPropietarioNumero: Number(e.target.value) })}
                            placeholder="Domicilio Propietario Número" 
                            className="w-full p-2 mb-4 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                        />
                        {errors.domicilioPropietarioNumero && <span className="text-red-500 text-xs">{errors.domicilioPropietarioNumero}</span>}
                    </label>
                    <label className="col-span-2 dark:text-gray-100">
                        Ciudad:
                        <input
                            type="text"
                            value={vehiculoData.domicilioPropietarioCiudad || ''}
                            onChange={(e) => setVehiculoData({ ...vehiculoData, domicilioPropietarioCiudad: e.target.value })}
                            placeholder="Domicilio Ciudad"
                            className="w-full p-2 mb-4 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                        />
                        {errors.domicilioPropietarioCiudad && <span className="text-red-500 text-xs">{errors.domicilioPropietarioCiudad}</span>}
                    </label>
                    <label className="col-span-2 dark:text-gray-100">
                        Marca del Vehículo:
                        <input
                            type="text"
                            value={vehiculoData.marca || ''}
                            onChange={(e) => setVehiculoData({ ...vehiculoData, marca: e.target.value })}
                            className="w-full p-2 mb-4 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                        />
                        {errors.marca && <span className="text-red-500 text-xs">{errors.marca}</span>}
                    </label>
                    <label className="col-span-2 dark:text-gray-100">
                        Modelo del Vehículo:
                        <input
                            type="text"
                            value={vehiculoData.modelo || ''}
                            onChange={(e) => setVehiculoData({ ...vehiculoData, modelo: e.target.value })}
                            className="w-full p-2 mb-4 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                        />
                        {errors.modelo && <span className="text-red-500 text-xs">{errors.modelo}</span>}
                    </label>
                </div>
                <button type="submit" className="w-full mt-4 p-2 bg-blue-500 hover:bg-blue-700 text-white rounded dark:bg-blue-600 dark:hover:bg-blue-800">
                    {initialData ? 'Actualizar Vehículo' : 'Guardar Vehículo'}
                </button>
            </form>
        </div>
    );
};

export default FormularioVehiculo;
