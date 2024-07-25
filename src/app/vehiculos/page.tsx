'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { Vehiculo } from '@/types/vehiculo';

const Vehiculos = () => {
  useAuthRedirect();
  const [vehiculos, setVehiculos] = useState<Vehiculo[] | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  // useEffect to fetch vehicle data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const query = `
        query {
          vehiculos {
            patenteVehiculo
            anioFabricacion
            nombrePropietario
            apellidoPropietario
            domicilioPropietarioCalle
            domicilioPropietarioNumero
            domicilioPropietarioCiudad
            marca
            modelo
          }
        }
      `;

      try {
        const response = await axios.post(
          `${apiUrl}`,
          { query },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        setVehiculos(response.data.data.vehiculos);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (!vehiculos) return <p className="flex min-h-screen items-center justify-center p-4 text-xl font-bold">Cargando...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Vehículos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehiculos.map((vehiculo) => (
          <div key={vehiculo.patenteVehiculo} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl mb-2 font-bold">Patente: {vehiculo.patenteVehiculo}</h2>
            <p>Modelo: {vehiculo.modelo}</p>
            <p>Marca: {vehiculo.marca}</p>
            <p>Año de Fabricación: {vehiculo.anioFabricacion}</p>
            <h3 className="mt-2 font-bold">Propietario:</h3>
            <p>Nombre: {vehiculo.nombrePropietario}</p>
            <p>Apellido: {vehiculo.apellidoPropietario}</p>
            <h3 className="mt-2 font-bold">Domicilio Propietario:</h3>
            <p>Calle: {vehiculo.domicilioPropietarioCalle}</p>
            <p>Número: {vehiculo.domicilioPropietarioNumero}</p>
            <p>Ciudad: {vehiculo.domicilioPropietarioCiudad}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Vehiculos;
