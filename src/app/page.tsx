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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { login } = useAuth();
  const router = useRouter();
  const bcrypt = require('bcryptjs');
  const [loading, setLoading] = useState<boolean>(false);
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  // Validate form inputs
  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    
    if (!username) {
      errors.username = 'El nombre de usuario es obligatorio';
    }
    
    if (!password) {
      errors.password = 'La contraseña es obligatoria';
    }
    
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Corrige los errores en el formulario.');
      return;
    }
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
        `${apiUrl}`,
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
    <div className="flex min-h-screen items-center justify-center p-4 dark:text-gray-100">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg p-8 shadow-md">
        <form onSubmit={handleSubmit} className=" ">
          <h1 className="text-2xl mb-4">Iniciar Sesión</h1>
          <div className="mb-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nombre"
              className={`w-full p-2 border ${errors.username ? 'border-red-500' : 'border-gray-300dark:border-gray-700'} rounded dark:border-gray-700 dark:text-gray-100`}
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
          </div>
          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className={`w-full p-2 border ${errors.password ? 'border-red-500' : 'border-gray-300dark:border-gray-700'} rounded dark:border-gray-700 dark:text-gray-100`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          <button type="submit" disabled={loading} className="w-full p-2 mb-4 bg-blue-500 hover:bg-blue-700 text-white rounded cursor-pointer dark:bg-blue-600 dark:hover:bg-blue-800">
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
