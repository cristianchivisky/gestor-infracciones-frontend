'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link'
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const query = `
      query Usuario($nombre: String!, $contrasenia: String!) {
        usuario(nombre: $nombre, contrasenia: $contrasenia) {
          id
          nombre
          email
        }
      }
    `;

    const variables = {
      nombre: username,
      contrasenia: password
    };

    try {
      const response = await axios.post(
        'http://localhost:5000/graphql',
        { query, variables },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.data.usuario) {
        login();
        toast.success('Inicio de sesión exitoso');
        router.push('/infracciones');
      } else {
        toast.error('Nombre de usuario o contraseña incorrectos');
        console.error('Login failed: Incorrect username or password');
      }
    } catch (error) {
      toast.error('Error en el inicio de sesión');
      console.error('Login failed:', error);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="flex justify-center items-center h-full">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl mb-4">Iniciar Sesión</h1>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nombre"
            required
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <button type="submit" className="w-full p-2 mb-4 bg-blue-500 hover:bg-blue-700 text-white rounded cursor-pointer">
            Iniciar Sesión
          </button>
          <Link href="/registro">
            <button type="submit" className="w-full p-2 bg-gray-500 hover:bg-gray-700 text-white rounded cursor-pointer">
              Registrarse
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}
