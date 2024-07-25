import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Registro, FormularioRegistroProps } from '@/types/registro';

const FormularioRegistro: React.FC<FormularioRegistroProps> = ({ initialData }) => {
    const [registroData, setRegistroData] = useState<Registro>({
        numeroRegistro: 0,
        nombre: '',
        apellido: '',
        domicilioCalle: '',
        domicilioNumero: 0,
        domicilioCiudad: '',
        edad: 0,
        fechaEmision: '',
        fechaVencimiento: ''
    });

    // Update state if initialData is provided
    useEffect(() => {
        if (initialData) {
            setRegistroData(initialData);
        }
    }, [initialData]);

    // Function to handle form submission
    const handleRegistroSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Define GraphQL mutation query based on the presence of initialData
        const mutation = initialData ? `
        mutation UpdateRegistro($numeroRegistro: Int!, $nombre: String!, $apellido: String!, $domicilioCalle: String!, $domicilioNumero: Int!, $domicilioCiudad: String!, $edad: Int!, $fechaEmision: String!, $fechaVencimiento: String!) {
            updateRegistro(numeroRegistro: $numeroRegistro, nombre: $nombre, apellido: $apellido, domicilioCalle: $domicilioCalle, domicilioNumero: $domicilioNumero, domicilioCiudad: $domicilioCiudad, edad: $edad, fechaEmision: $fechaEmision, fechaVencimiento: $fechaVencimiento) {
                registro {
                    numeroRegistro
                    nombre
                    apellido
                    domicilioCalle
                    domicilioNumero
                    domicilioCiudad
                    edad
                    fechaEmision
                    fechaVencimiento
                }
            }
        }
        ` : `
        mutation CreateRegistro($numeroRegistro: Int!, $nombre: String!, $apellido: String!, $domicilioCalle: String!, $domicilioNumero: Int!, $domicilioCiudad: String!, $edad: Int!, $fechaEmision: String!, $fechaVencimiento: String!) {
            createRegistro(numeroRegistro: $numeroRegistro, nombre: $nombre, apellido: $apellido, domicilioCalle: $domicilioCalle, domicilioNumero: $domicilioNumero, domicilioCiudad: $domicilioCiudad, edad: $edad, fechaEmision: $fechaEmision, fechaVencimiento: $fechaVencimiento) {
                registro {
                    numeroRegistro
                    nombre
                    apellido
                    domicilioCalle
                    domicilioNumero
                    domicilioCiudad
                    edad
                    fechaEmision
                    fechaVencimiento
                }
            }
        }
        `;
        // Prepare variables for the mutation
        const variables = { 
            numeroRegistro: registroData.numeroRegistro,
            nombre: registroData.nombre,
            apellido: registroData.apellido,
            domicilioCalle: registroData.domicilioCalle,
            domicilioCiudad: registroData.domicilioCiudad,
            fechaEmision: registroData.fechaEmision,
            fechaVencimiento: registroData.fechaVencimiento,
            edad: registroData.edad,
            domicilioNumero: registroData.domicilioNumero,
        };
        //console.log(variables)
        try {
            // Send the request to the GraphQL endpoint
            const response = await axios.post('http://localhost:5000/graphql', { query: mutation, variables }, { headers: { 'Content-Type': 'application/json' } });
            if (response.data.errors) {
                toast.error(`Error ${initialData ? 'actualizando' : 'creando'} registro`);
                console.error('GraphQL Errors:', response.data.errors);
            } else {
                toast.success(`Registro ${initialData ? 'actualizado' : 'creado'} con éxito`);
            }
        } catch (error) {
            toast.error(`Error ${initialData ? 'actualizando' : 'creando'} registro`);
            console.error('Error en la operación de registro:', error);
        }
    };

    return (
        <form onSubmit={handleRegistroSubmit} className="bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
            <h2 className="text-2xl mb-4">{initialData ? 'Actualizar Registro' : 'Crear Registro'}</h2>
            <div className="grid grid-cols-2 gap-4">
                <label className="col-span-2">
                    Número de Registro:
                    <input
                        type="number"
                        value={registroData.numeroRegistro || ''}
                        onChange={(e) => setRegistroData({ ...registroData, numeroRegistro: Number(e.target.value) })}
                        required
                        placeholder="Número de Registro"
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    />
                </label>
                <label className="col-span-2">
                    Nombre:
                    <input type="text"
                        name="nombre" 
                        value={registroData.nombre || ''} 
                        onChange={(e) => setRegistroData({ ...registroData, nombre: e.target.value })} 
                        placeholder="Nombre"
                        required 
                        className="mb-4 p-2 border border-gray-300 rounded w-full"/>
                </label>
                <label className="col-span-2">
                    Apellido:
                    <input type="text" 
                        name="apellido" 
                        value={registroData.apellido || ''} 
                        onChange={(e) => setRegistroData({ ...registroData, apellido: e.target.value })} 
                        placeholder="Apellido" 
                        required
                        className="mb-4 p-2 border border-gray-300 rounded w-full"/>
                </label>
                <label className="col-span-2">
                    Domicilio Calle:
                    <input type="text" 
                        name="domicilioCalle" 
                        value={registroData.domicilioCalle || ''} 
                        onChange={(e) => setRegistroData({ ...registroData, domicilioCalle: e.target.value })} 
                        placeholder="Domicilio Calle" 
                        required
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    />
                </label>
                <label className="col-span-2">
                    Domicilio Número:
                    <input type="number" 
                        name="domicilioNumero" 
                        value={registroData.domicilioNumero || ''} 
                        onChange={(e) => setRegistroData({ ...registroData, domicilioNumero: Number(e.target.value) })} 
                        placeholder="Domicilio Número" 
                        required
                        className="w-full p-2 mb-4 border border-gray-300 rounded"/>
                </label>
                <label className="col-span-2">
                    Ciudad:
                    <input type="text" 
                        name="domicilioCiudad" 
                        value={registroData.domicilioCiudad || ''} 
                        onChange={(e) => setRegistroData({ ...registroData, domicilioCiudad: e.target.value })} 
                        placeholder="Domicilio Ciudad" 
                        required
                        className="w-full p-2 mb-4 border border-gray-300 rounded"/>
                </label>
                <label>
                    Edad:
                    <input
                        type="number"
                        value={registroData.edad || ''}
                        onChange={(e) => setRegistroData({ ...registroData, edad: Number(e.target.value) })}
                        required
                        placeholder="Edad" 
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
            <button type="submit" className="w-full mt-4  p-2 bg-blue-500 hover:bg-blue-700 text-white rounded">
                {initialData ? 'Actualizar Registro' : 'Guardar Registro'}
            </button>
        </form>
    );
};

export default FormularioRegistro;
