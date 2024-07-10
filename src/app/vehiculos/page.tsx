'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';

const Vehiculos = () => {
  const [vehiculos, setVehiculos] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const query = `
        query {
          vehiculos {
            patenteVehiculo
            anioFabricacion
            nombreyapellidoPropietario
            domicilioPropietario
            marca
            modelo
          }
        }
      `;

      try {
        const response = await axios.post(
          'http://localhost:5000/graphql',
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
  if (!vehiculos) return <p className="flex min-h-screen items-center justify-center p-4">Cargando...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Vehículos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehiculos.map((vehiculo) => (
          <div key={vehiculo.patenteVehiculo} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl mb-2">Patente: {vehiculo.patenteVehiculo}</h2>
            <p>Propietario: {vehiculo.nombreyapellidoPropietario}</p>
            <p>Modelo: {vehiculo.modelo}</p>
            <p>Marca: {vehiculo.marca}</p>
            <p>Año de Fabricación: {vehiculo.anioFabricacion}</p>
            <p>Domicilio: {vehiculo.domicilioPropietario}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Vehiculos;
