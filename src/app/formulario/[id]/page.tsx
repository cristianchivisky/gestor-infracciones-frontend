'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import FormularioInfraccion from '@/components/FormularioInfraccion';
import FormularioVehiculo from '@/components/FormularioVehiculo';
import FormularioRegistro from '@/components/FormularioRegistro';
import toast from 'react-hot-toast';
import { Vehiculo } from '@/types/vehiculo';
import { Registro } from '@/types/registro';
import { useAuthRedirect } from '@/hooks/useAuthRedirect'; 

interface VehiculoOption {
    value: string;
    label: string;
}
  
interface RegistroOption {
    value: string;
    label: string;
}
  
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
  
interface FormularioProps {
    params: {
      id: number;
    };
}

const Formulario = ({ params }: FormularioProps) => {
    useAuthRedirect();
    const infraccionId = params.id > 0 ? params.id : null;
    const [vehiculosOptions, setVehiculosOptions] = useState<VehiculoOption[]>([]);
    const [registrosOptions, setRegistrosOptions] = useState<RegistroOption[]>([]);
    const [infraccionData, setInfraccionData] = useState<InfraccionData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Fetch the infracción data based on the ID
    useEffect(() => {
        const fetchInfraccionData = async () => {
        try {
            const query = `
            query GetInfraccion($numeroInfraccion: Int!) {
                infraccion(numeroInfraccion: $numeroInfraccion) {
                    numeroInfraccion
                    codigoInfraccion
                    fecha
                    hora
                    observaciones
                    monto
                    pagado
                    vehiculo {
                        patenteVehiculo
                        anioFabricacion
                        nombrePropietario
                        apellidoPropietario
                        domicilioPropietarioCalle
                        domicilioPropietarioNumero
                        domicilioPropietarioCiudad
                        modelo
                        marca
                    }
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
    
            const response = await axios.post('http://localhost:5000/graphql', {
                query,
                variables: { numeroInfraccion: infraccionId }
            }, {
                headers: { 'Content-Type': 'application/json' }
            });
    
            if (response.data.errors) {
                toast.error('Error al cargar la infracción');
                console.error('GraphQL Errors:', response.data.errors);
            } else {
                setInfraccionData(response.data.data.infraccion);
            }
        } catch (error) {
            toast.error('Error al cargar la infracción');
            console.error('Error fetching infracción:', error);
        } finally {
            setLoading(false);
        }
        };
        if (infraccionId){
            setLoading(true)
            fetchInfraccionData();
        };
    }, [infraccionId]);
    
    // Fetch options for vehicles and records
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
                const vehiculos = response.data.data.vehiculos.map((vehiculo: { patenteVehiculo: string }) => ({
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
                const registros = response.data.data.registros.map((registro: { numeroRegistro: number }) => ({
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

    if (loading) {
        return <p className="flex min-h-screen items-center justify-center p-4 text-xl font-bold">Cargando...</p>;
    };

    return (
        <div className="flex flex-wrap justify-center min-h-screen p-4">
            <div className="w-full lg:w-1/3 p-4">
                <FormularioInfraccion
                initialData={infraccionData || undefined}
                vehiculosOptions={vehiculosOptions}
                registrosOptions={registrosOptions}
                />
            </div>
            <div className="w-full lg:w-1/3 p-4">
                <FormularioVehiculo initialData={infraccionData?.vehiculo || undefined} />
            </div>
            <div className="w-full lg:w-1/3 p-4">
                <FormularioRegistro initialData={infraccionData?.registro || undefined} />
            </div>
        </div>
  );
};

export default Formulario;
