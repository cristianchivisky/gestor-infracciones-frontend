'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link'
import { toast } from 'react-hot-toast';

const Infracciones = () => {
  const [infracciones, setInfracciones] = useState(null);
  
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

        setInfracciones(response.data.data.infracciones);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (numeroInfraccion) => {
    const confirmDelete = async () => {
      const mutation = `
        mutation {
          deleteInfraccion(numeroInfraccion: ${numeroInfraccion}) {
            infraccion {
              numeroInfraccion
            }
          }
        }
      `;

      try {
        const response = await axios.post(
          'http://localhost:5000/graphql',
          { query: mutation },
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );

        if (response.data.data.deleteInfraccion.infraccion) {
          toast.success('Infracción eliminada correctamente');
          // Refrescar la lista de infracciones después de eliminar
        } else {
          toast.error('Error al eliminar la infracción 1');
        }
      } catch (error) {
        console.error('Error deleting infraction:', error);
        toast.error('Error al eliminar la infracción 2');
      }
    };

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

  //console.log(infracciones)
  if (!infracciones) return <p className="flex min-h-screen items-center justify-center p-4">Cargando...</p>;
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Infracciones</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {infracciones.map((infraccion) => (
          <div key={infraccion.numeroInfraccion} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl mb-2">Infracción #{infraccion.numeroInfraccion}</h2>
            <p>Código: {infraccion.codigoInfraccion}</p>
            <p>Fecha: {infraccion.fecha}</p>
            <p>Hora: {infraccion.hora}</p>
            <p>Monto: ${infraccion.monto}</p>
            <p>Pagado: {infraccion.pagado ? "Sí" : "No"}</p>
            <p>Observaciones: {infraccion.observaciones}</p>
            <div className="mt-4 space-x-4">
              <Link href={`/infraccion/${infraccion.numeroInfraccion}`}>
                <button className="inline-block bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded">Ver más</button>
              </Link>
              
              <button onClick={() => handleDelete(infraccion.numeroInfraccion)} className="inline-block bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Infracciones;
