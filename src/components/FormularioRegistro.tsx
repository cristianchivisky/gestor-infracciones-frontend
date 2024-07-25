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
    const [errors, setErrors] = useState({
        numeroRegistro: '',
        nombre: '',
        apellido: '',
        domicilioCalle: '',
        domicilioNumero: '',
        domicilioCiudad: '',
        edad: '',
        fechaEmision: '',
        fechaVencimiento: ''
    });
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL

    // Update state if initialData is provided
    useEffect(() => {
        if (initialData) {
            setRegistroData(initialData);
        }
    }, [initialData]);

    // Validate inputs
    const validateInputs = () => {
        const newErrors = {
            numeroRegistro: '',
            nombre: '',
            apellido: '',
            domicilioCalle: '',
            domicilioNumero: '',
            domicilioCiudad: '',
            edad: '',
            fechaEmision: '',
            fechaVencimiento: ''
        };
    
        const currentDate = new Date();
        const formattedCurrentDate = currentDate.toISOString().split('T')[0];
    
        if (!registroData.numeroRegistro || isNaN(registroData.numeroRegistro) || registroData.numeroRegistro <= 0) {
            newErrors.numeroRegistro = 'El número de registro es obligatorio y debe ser un entero mayor que cero.';
        }
    
        if (!registroData.nombre?.trim()) {
            newErrors.nombre = 'El nombre es obligatorio.';
        } else if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(registroData.nombre)) {
            newErrors.nombre = 'El nombre solo puede contener letras y acentos.';
        }
    
        if (!registroData.apellido?.trim()) {
            newErrors.apellido = 'El apellido es obligatorio.';
        } else if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(registroData.apellido)) {
            newErrors.apellido = 'El apellido solo puede contener letras y acentos.';
        }
    
        if (!registroData.domicilioCalle.trim()) {
            newErrors.domicilioCalle = 'La calle es obligatoria.';
        } else if (!/^[A-Za-z0-9ÁÉÍÓÚáéíóúñÑ\s]+$/.test(registroData.domicilioCalle)) {
            newErrors.domicilioCalle = 'La calle solo puede contener letras, números y acentos.';
        }
    
        if (registroData.domicilioNumero == null || isNaN(registroData.domicilioNumero) || registroData.domicilioNumero < 0) {
            newErrors.domicilioNumero = 'El número de domicilio debe ser un entero no negativo.';
        }
    
        if (!registroData.domicilioCiudad.trim()) {
            newErrors.domicilioCiudad = 'La ciudad es obligatoria.';
        } else if (!/^[A-Za-z0-9ÁÉÍÓÚáéíóúñÑ\s]+$/.test(registroData.domicilioCiudad)) {
            newErrors.domicilioCiudad = 'La ciudad solo puede contener letras y acentos.';
        }
    
        if (registroData.edad == null || isNaN(registroData.edad)) {
            newErrors.edad = 'La edad es obligatoria.';
        } else if (registroData.edad < 16 || registroData.edad > 110) {
            newErrors.edad = 'La edad debe estar entre 16 y 110 años.';
        }
    
        if (!registroData.fechaEmision) {
            newErrors.fechaEmision = 'La fecha de emisión es obligatoria.';
        } else if (registroData.fechaEmision > formattedCurrentDate) {
            newErrors.fechaEmision = 'La fecha de emisión no puede ser mayor a la fecha actual.';
        }
    
        if (!registroData.fechaVencimiento) {
            newErrors.fechaVencimiento = 'La fecha de vencimiento es obligatoria.';
        } else if (registroData.fechaVencimiento < registroData.fechaEmision) {
            newErrors.fechaVencimiento = 'La fecha de vencimiento no puede ser anterior a la fecha de emisión.';
        }
    
        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };
    
    // Function to handle form submission
    const handleRegistroSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateInputs()) {
            toast.error('Corrige los errores en el formulario.');
            return;
        }
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
            const response = await axios.post(`${apiUrl}`, { query: mutation, variables }, { headers: { 'Content-Type': 'application/json' } });
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
                        placeholder="Número de Registro"
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    />
                    {errors.numeroRegistro && <span className="text-red-500 text-xs">{errors.numeroRegistro}</span>}
                </label>
                <label className="col-span-2">
                    Nombre:
                    <input type="text"
                        name="nombre" 
                        value={registroData.nombre || ''} 
                        onChange={(e) => setRegistroData({ ...registroData, nombre: e.target.value })} 
                        placeholder="Nombre" 
                        className="mb-4 p-2 border border-gray-300 rounded w-full"/>
                        {errors.nombre && <span className="text-red-500 text-xs">{errors.nombre}</span>}
                </label>
                <label className="col-span-2">
                    Apellido:
                    <input type="text" 
                        name="apellido" 
                        value={registroData.apellido || ''} 
                        onChange={(e) => setRegistroData({ ...registroData, apellido: e.target.value })} 
                        placeholder="Apellido" 
                        className="mb-4 p-2 border border-gray-300 rounded w-full"/>
                         {errors.apellido && <span className="text-red-500 text-xs">{errors.apellido}</span>}
                </label>
                <label className="col-span-2">
                    Domicilio Calle:
                    <input type="text" 
                        name="domicilioCalle" 
                        value={registroData.domicilioCalle || ''} 
                        onChange={(e) => setRegistroData({ ...registroData, domicilioCalle: e.target.value })} 
                        placeholder="Domicilio Calle" 
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    />
                    {errors.domicilioCalle && <span className="text-red-500 text-xs">{errors.domicilioCalle}</span>}
                </label>
                <label className="col-span-2">
                    Domicilio Número:
                    <input type="number" 
                        name="domicilioNumero" 
                        value={registroData.domicilioNumero || ''} 
                        onChange={(e) => setRegistroData({ ...registroData, domicilioNumero: Number(e.target.value) })} 
                        placeholder="Domicilio Número" 
                        className="w-full p-2 mb-4 border border-gray-300 rounded"/>
                        {errors.domicilioNumero && <span className="text-red-500 text-xs">{errors.domicilioNumero}</span>}
                </label>
                <label className="col-span-2">
                    Ciudad:
                    <input type="text" 
                        name="domicilioCiudad" 
                        value={registroData.domicilioCiudad || ''} 
                        onChange={(e) => setRegistroData({ ...registroData, domicilioCiudad: e.target.value })} 
                        placeholder="Domicilio Ciudad" 
                        className="w-full p-2 mb-4 border border-gray-300 rounded"/>
                        {errors.domicilioCiudad && <span className="text-red-500 text-xs">{errors.domicilioCiudad}</span>}
                </label>
                <label>
                    Edad:
                    <input
                        type="number"
                        value={registroData.edad || ''}
                        onChange={(e) => setRegistroData({ ...registroData, edad: Number(e.target.value) })}
                        placeholder="Edad" 
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    />
                    {errors.edad && <span className="text-red-500 text-xs">{errors.edad}</span>}
                </label>
                <label>
                    Fecha de Emisión:
                    <input
                        type="date"
                        value={registroData.fechaEmision || ''}
                        onChange={(e) => setRegistroData({ ...registroData, fechaEmision: e.target.value })}
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    />
                    {errors.fechaEmision && <span className="text-red-500 text-xs">{errors.fechaEmision}</span>}
                </label>
                <label>
                    Fecha de Vencimiento:
                    <input
                        type="date"
                        value={registroData.fechaVencimiento || ''}
                        onChange={(e) => setRegistroData({ ...registroData, fechaVencimiento: e.target.value })}
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    />
                    {errors.fechaVencimiento && <span className="text-red-500 text-xs">{errors.fechaVencimiento}</span>}
                </label>
            </div>
            <button type="submit" className="w-full mt-4  p-2 bg-blue-500 hover:bg-blue-700 text-white rounded">
                {initialData ? 'Actualizar Registro' : 'Guardar Registro'}
            </button>
        </form>
    );
};

export default FormularioRegistro;
