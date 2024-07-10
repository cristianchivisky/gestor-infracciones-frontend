'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';

const Registros = () => {
  const [registros, setRegistros] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const query = `
        query {
          registros {
            numeroRegistro
            nombreyapellido
            domicilio
            edad
            fechaEmision
            fechaVencimiento
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

        setRegistros(response.data.data.registros);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  if (!registros) return <p className="flex min-h-screen items-center justify-center p-4">Cargando...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Registros</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {registros.map((registro) => (
          <div key={registro.numeroRegistro} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl mb-2">Registro #{registro.numeroRegistro}</h2>
            <p>Nombre: {registro.nombreyapellido}</p>
            <p>Domicilio: {registro.domicilio}</p>
            <p>Edad: {registro.edad}</p>
            <p>Fecha de Emisión: {registro.fechaEmision}</p>
            <p>Fecha de Vencimiento: {registro.fechaVencimiento}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Registros;
