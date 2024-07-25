'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthRedirect } from '@/hooks/useAuthRedirect'; 
import { Registro } from '@/types/registro';

const Registros = () => {
  useAuthRedirect();
  const [registros, setRegistros] = useState<Registro[] | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  // useEffect to fetch registro data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const query = `
        query {
          registros {
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

        setRegistros(response.data.data.registros);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  if (!registros) return <p className="flex min-h-screen items-center justify-center text-xl font-bold">Cargando...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Registros</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {registros.map((registro) => (
          <div key={registro.numeroRegistro} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl mb-2 font-bold">Registro #{registro.numeroRegistro}</h2>
            <p>Nombre: {registro.nombre}</p>
            <p>Apellido: {registro.apellido}</p>
            <p>Edad: {registro.edad}</p>
            <h3 className="mt-2 font-bold">Domicilio:</h3>
            <p>Calle: {registro.domicilioCalle}</p>
            <p>Número: {registro.domicilioNumero}</p>
            <p>Ciudad: {registro.domicilioCiudad}</p>
            <p className='mt-2'>Fecha de Emisión: {registro.fechaEmision}</p>
            <p>Fecha de Vencimiento: {registro.fechaVencimiento}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Registros;
