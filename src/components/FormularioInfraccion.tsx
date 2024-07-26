import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Vehiculo } from '@/types/vehiculo';
import { Registro } from '@/types/registro';
import { Infraccion } from '@/types/infraccion'

interface InfraccionData {
    numeroInfraccion: number;
    codigoInfraccion: string;
    fecha: string;
    hora: string;
    observaciones: string;
    monto: number;
    pagado: boolean;
    vehiculo: Vehiculo;
    registro: Registro;
}

export interface Option {
    value: string;
    label: string;
}

export interface FormularioInfraccionProps {
    initialData?: InfraccionData;
    vehiculosOptions: Option[];
    registrosOptions: Option[];
}
const FormularioInfraccion: React.FC<FormularioInfraccionProps> = ({ initialData, vehiculosOptions, registrosOptions }) => {
    const [infraccion, setInfraccion] = useState<Infraccion>({
        numeroInfraccion: 0,
        codigoInfraccion: '',
        fecha: '',
        hora: '',
        monto: 0,
        pagado: false,
        observaciones: '',
        patenteVehiculoId: '',
        numeroRegistroId: 0,
    })
    const [errors, setErrors] = useState({
        codigoInfraccion: '',
        fecha: '',
        monto: '',
        hora: '',
        pagado: '',
        patenteVehiculoId: '',
        numeroRegistroId: ''
    });
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL

    // Effect to set initial form data when component mounts or initialData changes
    useEffect(() => {
        if (initialData) {
            setInfraccion({
                numeroInfraccion: Number(initialData.numeroInfraccion),
                codigoInfraccion: initialData.codigoInfraccion,
                fecha: initialData.fecha,
                hora: initialData.hora,
                observaciones: initialData.observaciones,
                monto: initialData.monto,
                pagado: initialData.pagado,
                patenteVehiculoId: initialData.vehiculo.patenteVehiculo,
                numeroRegistroId: Number(initialData.registro.numeroRegistro),
            });
        }
    }, [initialData]);

    const validateInputs = () => {
        const newErrors = {
            codigoInfraccion: '',
            fecha: '',
            hora: '',
            monto: '',
            pagado: '',
            patenteVehiculoId: '',
            numeroRegistroId: ''
        };
        const currentDate = new Date().toISOString().split('T')[0];

        if (!infraccion.codigoInfraccion) {
            newErrors.codigoInfraccion = 'El código de infracción es obligatorio.';
        } else if (!/^[A-Z0-9]+$/.test(infraccion.codigoInfraccion)) {
            newErrors.codigoInfraccion = 'El código de infracción debe contener solo letras mayúsculas y números.';
        }

        if (!infraccion.fecha) {
            newErrors.fecha = 'La fecha es obligatoria.';
        } else if (infraccion.fecha > currentDate) {
            newErrors.fecha = 'La fecha no puede ser en el futuro.';
        }

        if (!infraccion.hora) {
            newErrors.hora = 'La hora es obligatoria.';
        }

        if (infraccion.monto === null || infraccion.monto === undefined || isNaN(infraccion.monto)) {
            newErrors.monto = 'El monto es obligatorio.';
        } else if (infraccion.monto < 0) {
            newErrors.monto = 'El monto no puede ser menor a cero.';
        }

        if (!infraccion.patenteVehiculoId) {
            newErrors.patenteVehiculoId = 'La patente del vehículo es obligatoria.';
        }

        if (!infraccion.numeroRegistroId) {
            newErrors.numeroRegistroId = 'El número de registro es obligatorio.';
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };


    // Handle form submission for updating an existing infraction
    const handleUpdateInfraccionSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateInputs()) {
            toast.error('Corrige los errores en el formulario.', { duration: 5000 });
            return;
        }
        const mutation = `
        mutation UpdateInfraccion($numeroInfraccion: Int!, $codigoInfraccion: String!, $fecha: String!, $hora: String!, $observaciones: String, $monto: Float!, $pagado: Boolean!, $patenteVehiculoId: String!, $numeroRegistroId: Int!) {
            updateInfraccion(numeroInfraccion: $numeroInfraccion, codigoInfraccion: $codigoInfraccion, fecha: $fecha, hora: $hora, observaciones: $observaciones, monto: $monto, pagado: $pagado, patenteVehiculoId: $patenteVehiculoId, numeroRegistroId: $numeroRegistroId) {
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
            numeroInfraccion: infraccion.numeroInfraccion,
            codigoInfraccion: infraccion.codigoInfraccion,
            fecha: infraccion.fecha,
            hora: infraccion.hora,
            observaciones: infraccion.observaciones || null,
            monto: parseFloat(infraccion.monto.toString()),
            pagado: infraccion.pagado,
            patenteVehiculoId: infraccion.patenteVehiculoId,
            numeroRegistroId: infraccion.numeroRegistroId
        };
    
        try {
            const response = await axios.post(`${apiUrl}`, {
                query: mutation,
                variables
        }, {
            headers: { 'Content-Type': 'application/json' }
        });
        console.log('Response:', response.data);
        if (response.data.errors) {
            toast.error('Error actualizando infracción', { duration: 5000 });
            console.error('GraphQL Errors:', response.data.errors);
        } else {
            toast.success('Infracción actualizada con éxito', { duration: 5000 });
        }
        } catch (error) {
            toast.error('Error actualizando infracción', { duration: 5000 });
            console.error('Error actualizando infracción:', error);
        }
    };

    // Handle form submission for creating a new infraction
    const handleCreateInfraccionSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateInputs()) {
            toast.error('Corrige los errores en el formulario.', { duration: 5000 });
            return;
        }
        const mutation = `mutation CreateInfraccion($codigoInfraccion: String!, $fecha: String!, $hora: String!, $observaciones: String, $monto: Float!, $pagado: Boolean!, $patenteVehiculoId: String!, $numeroRegistroId: Int!) {
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
        }`;
        const variables = {
            codigoInfraccion: infraccion.codigoInfraccion,
            fecha: infraccion.fecha,
            hora: infraccion.hora,
            observaciones: infraccion.observaciones,
            monto: infraccion.monto,
            pagado: infraccion.pagado,
            patenteVehiculoId: infraccion.patenteVehiculoId,
            numeroRegistroId: infraccion.numeroRegistroId
        };

        try {
            const response = await axios.post(`${apiUrl}`, { query: mutation, variables }, { headers: { 'Content-Type': 'application/json' } });
            if (response.data.errors) {
                toast.error('Error creando infracción', { duration: 5000 });
                console.error('GraphQL Errors:', response.data.errors);
            } else {
                toast.success('Infracción creada con éxito', { duration: 5000 });
                setInfraccion({
                    numeroInfraccion: 0,
                    codigoInfraccion: '',
                    fecha: '',
                    hora: '',
                    observaciones: '',
                    monto: 0,
                    pagado: false,
                    patenteVehiculoId: '',
                    numeroRegistroId: 0
                });
            }
        } catch (error) {
            toast.error('Error creando infracción', { duration: 5000 });
            console.error('Error creando infracción:', error);
        }
    };

    // Handle infraction deletion with confirmation
    const handleDelete = async () => {
        const confirmDelete = async () => {
            const mutation = `
                mutation {
                deleteInfraccion(numeroInfraccion: ${initialData?.numeroInfraccion}) {
                    infraccion {
                    numeroInfraccion
                    }
                }
                }
            `;
    
            try {
                const response = await axios.post(
                    `${apiUrl}`,
                    { query: mutation },
                    {
                        headers: {
                        'Content-Type': 'application/json',
                        }
                    }
                );
        
                if (response.data.data.deleteInfraccion.infraccion) {
                    toast.success('Infracción eliminada correctamente', { duration: 5000 });
                    setInfraccion({
                        numeroInfraccion: 0,
                        codigoInfraccion: '',
                        fecha: '',
                        hora: '',
                        observaciones: '',
                        monto: 0,
                        pagado: false,
                        patenteVehiculoId: '',
                        numeroRegistroId: 0
                    });
                } else {
                    toast.error('Error al eliminar la infracción', { duration: 5000 });
                }
            } catch (error) {
                console.error('Error deleting infraction:', error);
                toast.error('Error al eliminar la infracción', { duration: 5000 });
            }
        };
        // Display a confirmation toast before deleting
        toast(
            (t) => (
                <span>
                ¿Estás seguro de eliminar esta infracción?
                <br />
                <button
                    onClick={() => {
                    confirmDelete();
                    toast.dismiss(t.id);
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded-md ml-2"
                >
                    Confirmar
                </button>
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md ml-2"
                >
                    Cancelar
                </button>
                </span>
            ),
            { duration: 5000 }
        );
    };
    
    return (
        <form onSubmit={initialData ? handleUpdateInfraccionSubmit : handleCreateInfraccionSubmit} className="bg-white dark:bg-gray-800 dark:text-gray-100 p-8 rounded-lg shadow-md max-w-lg mx-auto">
            <h2 className="text-2xl mb-4">{initialData ? 'Actualizar Infracción' : 'Crear Infracción'}</h2>
            <div className="grid grid-cols-2 gap-4">
            <label htmlFor="codigoInfraccion" className="col-span-2 dark:text-gray-100">
                Código de Infracción:
                <input
                    id="codigoInfraccion"
                    name="codigoInfraccion"
                    type="text"
                    value={infraccion.codigoInfraccion || ''}
                    onChange={(e) =>
                    setInfraccion({ ...infraccion, codigoInfraccion: e.target.value })
                    }
                    placeholder="Código de Infracción"
                    className="w-full p-2 mb-4 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                />
                {errors.codigoInfraccion && <p className="text-red-500 text-xs">{errors.codigoInfraccion}</p>}
            </label>
            <label htmlFor="fecha" className="dark:text-gray-100">
                Fecha:
                <input
                    id="fecha"
                    type="date"
                    name="fecha"
                    value={infraccion.fecha || ''}
                    onChange={(e) => setInfraccion({ ...infraccion, fecha: e.target.value })}
                    placeholder="Fecha"
                    className="w-full p-2 mb-4 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                />
                 {errors.fecha && <p className="text-red-500 text-xs">{errors.fecha}</p>}
            </label>
            <label htmlFor="hora" className="dark:text-gray-100">
                Hora:
                <input
                    id="hora"
                    name="hora"
                    type="time"
                    value={infraccion.hora || ''}
                    onChange={(e) => setInfraccion({ ...infraccion, hora: e.target.value })}
                    placeholder="Hora"
                    className="w-full p-2 mb-4 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                />
                {errors.hora && <p className="text-red-500 text-xs">{errors.hora}</p>}
            </label>
            <label htmlFor="observaciones" className="col-span-2 dark:text-gray-100">
                Observaciones:
                <textarea
                    id="observaciones"
                    name="observaciones"
                    value={infraccion.observaciones || ''}
                    onChange={(e) => setInfraccion({ ...infraccion, observaciones: e.target.value })}
                    placeholder="Observaciones"
                    required
                    className="w-full p-2 mb-4 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                />
            </label>
            <label htmlFor="monto" className="dark:text-gray-100">
                Monto:
                <input
                    id="monto"
                    name="monto"
                    type="number"
                    value={infraccion.monto || ''}
                    onChange={(e) => setInfraccion({ ...infraccion, monto: parseFloat(e.target.value) })}
                    placeholder="Monto"
                    className="w-full p-2 mb-4 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                />
                {errors.monto && <p className="text-red-500 text-xs">{errors.monto}</p>}
            </label>
            <label htmlFor="pagado" className="dark:text-gray-100">
                Pagado:
                <select
                    id="pagado"
                    name="pagado"
                    value={infraccion.pagado.toString()}
                    onChange={(e) => setInfraccion({ ...infraccion, pagado: e.target.value === 'true'})}
                    className="w-full p-2 mb-4 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                >

                    <option value="">Selecciona...</option>
                    <option value="true">Sí</option>
                    <option value="false">No</option>
                </select>
                {errors.pagado && <p className="text-red-500 text-xs">{errors.pagado}</p>}
            </label>
            <label htmlFor="vehiculo" className="col-span-2 dark:text-gray-100">
                Patente del Vehículo:
                <select
                    id="vehiculo"
                    name="vehiculo"
                    value={infraccion.patenteVehiculoId || ''}
                    onChange={(e) => setInfraccion({ ...infraccion, patenteVehiculoId: e.target.value })}
                    className="w-full p-2 mb-4 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                >
                    <option value="">Selecciona...</option>
                    {vehiculosOptions.map((option, index) => (
                        <option key={index} value={option.value}>{option.label}</option>
                    ))}
                </select>
                {errors.patenteVehiculoId && <p className="text-red-500 text-xs">{errors.patenteVehiculoId}</p>}
            </label>
            <label  htmlFor="registro" className="col-span-2 dark:text-gray-100">
                Número de Registro:
                <select
                    id="registro"
                    name="registro"
                    value={infraccion.numeroRegistroId}
                    onChange={(e) => setInfraccion({ ...infraccion, numeroRegistroId: parseInt(e.target.value) })}
                    className="w-full p-2 mb-4 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                >
                    <option value="">Selecciona...</option>
                    {registrosOptions.map((option, index) => (
                        <option key={index} value={option.value}>{option.label}</option>
                    ))}
                </select>
                {errors.numeroRegistroId && <p className="text-red-500 text-xs">{errors.numeroRegistroId}</p>}
            </label>
            </div>
            <button type="submit" className="w-full mt-4 p-2 mb-4 bg-blue-500 text-white rounded dark:bg-blue-600 dark:hover:bg-blue-800">
                {initialData ? 'Actualizar infracción' : 'Guardar infracción'}
            </button>
            {initialData && (
                <button type="button" onClick={handleDelete} className="w-full p-2 bg-red-500 hover:bg-red-700 text-white rounded dark:bg-red-600 dark:hover:bg-red-800">
                    Eliminar infracción
                </button>
            )}
        </form>
    );
};

export default FormularioInfraccion;
