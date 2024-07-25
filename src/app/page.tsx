'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link'
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { login } = useAuth();
  const router = useRouter();
  const bcrypt = require('bcryptjs');
  const [loading, setLoading] = useState<boolean>(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const query = `
      query Usuario($nombre: String!) {
        usuario(nombre: $nombre) {
          id
          nombre
          email
          contrasenia
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
      const user = response.data.data.usuario; // Extract user data from response
      // Check if user exists and password matches
      if (user && await bcrypt.compare(password, user.contrasenia)) {
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
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg p-8 shadow-md">
        <form onSubmit={handleSubmit} className=" ">
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
          <button type="submit" disabled={loading} className="w-full p-2 mb-4 bg-blue-500 hover:bg-blue-700 text-white rounded cursor-pointer">
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
          
        </form>
        <Link href="/registro">
          <button className="w-full p-2 bg-gray-500 hover:bg-gray-700 text-white rounded cursor-pointer">
            Registrarse
          </button>
        </Link>
      </div>
    </div>
  );
}
