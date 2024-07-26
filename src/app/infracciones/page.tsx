'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useAuthRedirect } from '@/hooks/useAuthRedirect'; 
import { Infraccion } from '@/types/infraccion'

const Infracciones = () => {
  useAuthRedirect();
  const [infracciones, setInfracciones] = useState<Infraccion[]>([]);
  const [filteredInfracciones, setFilteredInfracciones] = useState<Infraccion[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterPaid, setFilterPaid] = useState<string>('all');
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  // Fetch infracciones data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const query = `
        query {
          infracciones {
            numeroInfraccion
            codigoInfraccion
            fecha
            hora
            monto
            pagado
            observaciones
            numeroRegistroId
            patenteVehiculoId
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

        setInfracciones(response.data.data.infracciones);
        setFilteredInfracciones(response.data.data.infracciones);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [apiUrl]);

  // Handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterInfracciones(value, filterPaid);
  };

  // Handle filter change (paid status)
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilterPaid(value);
    filterInfracciones(searchTerm, value);
  };

  // Filter infracciones based on search term and paid status
  const filterInfracciones = (search: string, paid: string) => {
    const lowercasedSearch = search.toLowerCase();
    const filtered = infracciones
      .filter(infraccion => {
        // Check if the infracción matches the search term
        const matchesSearch = infraccion.codigoInfraccion.toLowerCase().includes(lowercasedSearch) ||
          infraccion.fecha.includes(lowercasedSearch) ||
          infraccion.hora.includes(lowercasedSearch) ||
          infraccion.monto.toString().includes(lowercasedSearch) ||
          infraccion.numeroRegistroId.toString().includes(lowercasedSearch) ||
          infraccion.patenteVehiculoId.toLowerCase().includes(lowercasedSearch) ||
          infraccion.observaciones.toLowerCase().includes(lowercasedSearch);
          
        // Check if the infracción matches the paid status filter
        const matchesPaid = paid === 'all' || infraccion.pagado.toString() === paid;
        return matchesSearch && matchesPaid;
      });

    setFilteredInfracciones(filtered);
  };

  if (!infracciones.length) return <p className="flex min-h-screen items-center justify-center p-4 text-xl font-bold">Cargando...</p>;

  return (
    <div className="p-8 dark:text-gray-100">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 space-y-4 md:space-y-0">
        <h1 className="text-2xl font-bold">Infracciones</h1>
        <div className="flex flex-col md:flex-row space-y-4  md:space-y-0 md:space-x-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Buscar..."
            className="w-64 md:w-64 p-2 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          />
          <select
            value={filterPaid}
            onChange={handleFilterChange}
            className="w-full md:w-auto p-2 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="all">Todos</option>
            <option value="true">Pagado</option>
            <option value="false">No Pagado</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredInfracciones.map((infraccion) => (
          <div key={infraccion.numeroInfraccion} className="bg-white p-4 rounded-lg shadow-md dark:bg-gray-800">
            <h2 className="text-xl mb-2 font-bold">Infracción N°{infraccion.numeroInfraccion}</h2>
            <p>Código de infracción: {infraccion.codigoInfraccion}</p>
            <p>Fecha: {infraccion.fecha}</p>
            <p>Hora: {infraccion.hora}</p>
            <p>Monto: ${infraccion.monto}</p>
            <p>Pagado: {infraccion.pagado ? "Sí" : "No"}</p>
            <p>Número de registro: {infraccion.numeroRegistroId}</p>
            <p>Patente del vehículo: {infraccion.patenteVehiculoId}</p>
            <p>Observaciones: {infraccion.observaciones}</p>
            <div className="mt-4 space-x-4">
              <Link href={`/formulario/${infraccion.numeroInfraccion}`}>
                <button className="inline-block bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded dark:bg-blue-600 dark:hover:bg-blue-800">Ver más</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Infracciones;
