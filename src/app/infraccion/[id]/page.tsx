'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

const Infraccion = ({ params }: { params: { id: string } }) => {
    const [infraccion, setInfraccion] = useState<any>(null);
    const id = parseInt(params.id, 10);
    //console.log('numero: ',id)
    useEffect(() => {
        const fetchData = async () => {
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
                            nombreyapellidoPropietario
                            domicilioPropietario
                            modelo
                            marca
                        }
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
                numeroInfraccion: id
            };
            try {
                const response = await axios.post(
                'http://localhost:5000/graphql', 
                { 
                    query, 
                    variables
                },
                {
                    headers: {
                    'Content-Type': 'application/json',
                    },
                }
                );
                if (response.data.errors) {
                    console.error('GraphQL Errors:', response.data.errors);
                  } else {
                    setInfraccion(response.data.data.infraccion);
                  }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [id]);

    if (!infraccion) return <p className="flex min-h-screen items-center justify-center p-4">Cargando...</p>;
    //console.log(infraccion)
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-8">Detalles de Infracción</h1>
            <div className="bg-white shadow-md rounded p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Infracción #{infraccion.numeroInfraccion}</h2>
                    <p><strong>Código:</strong> {infraccion.codigoInfraccion}</p>
                    <p><strong>Fecha:</strong> {infraccion.fecha}</p>
                    <p><strong>Hora:</strong> {infraccion.hora}</p>
                    <p><strong>Observaciones:</strong> {infraccion.observaciones}</p>
                    <p><strong>Monto:</strong> ${infraccion.monto}</p>
                    <p><strong>Pagado:</strong> {infraccion.pagado ? 'Sí' : 'No'}</p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4">Vehículo</h2>
                    <p><strong>Patente:</strong> {infraccion.vehiculo.patenteVehiculo}</p>
                    <p><strong>Año de fabricación:</strong> {infraccion.vehiculo.anioFabricacion}</p>
                    <p><strong>Marca:</strong> {infraccion.vehiculo.marca}</p>
                    <p><strong>Modelo:</strong> {infraccion.vehiculo.modelo}</p>
                    <p><strong>Propietario:</strong> {infraccion.vehiculo.nombreyapellidoPropietario}</p>
                    <p><strong>Domicilio:</strong> {infraccion.vehiculo.domicilioPropietario}</p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4">Registro</h2>
                    <p><strong>Número:</strong> {infraccion.registro.numeroRegistro}</p>
                    <p><strong>Nombre y Apellido:</strong> {infraccion.registro.nombreyapellido}</p>
                    <p><strong>Domicilio:</strong> {infraccion.registro.domicilio}</p>
                    <p><strong>Edad:</strong> {infraccion.registro.edad}</p>
                    <p><strong>Fecha de emisión:</strong> {infraccion.registro.fechaEmision}</p>
                    <p><strong>Fecha de vencimiento:</strong> {infraccion.registro.fechaVencimiento}</p>
                </div>
                <Link href="/infracciones">
                    <button className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded">Volver</button>
                </Link>
            </div>
            
        </div>

    );
};

export default Infraccion;
