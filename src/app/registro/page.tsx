'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link'
import { toast } from 'react-hot-toast';
import { Usuario } from '@/types/usuario';

const Registro = () => {
  const [formState, setFormState] = useState<Usuario>({ username: '', password: '', email: '' });
  const router = useRouter();
  const bcrypt = require('bcryptjs');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Hash the password before sending it to the server
    const hashedPassword = await bcrypt.hash(formState.password, 10);
    const mutation = `
      mutation CreateUser($nombre: String!, $contrasenia: String!, $email: String!) {
        createUsuario(nombre: $nombre, contrasenia: $contrasenia, email: $email) {
          usuario {
            id
            nombre
            email
          }
        }
      }
    `;

    const variables = {
      nombre: formState.username,
      contrasenia: hashedPassword,
      email: formState.email
    };

    try {
      const response = await axios.post(
        'http://localhost:5000/graphql',
        {
          query: mutation,
          variables: variables
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.data.data.createUsuario) {
        toast.success('Registro exitoso');
        router.push('/');
      } else {
        toast.error('Error en el registro');
      }
    } catch (error) {
      toast.error('Error en el registro');
      console.error('Registration failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update form state on input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl mb-4">Registrarse</h1>
        <input
          type="text"
          name="username"
          value={formState.username}
          onChange={handleChange}
          placeholder="Nombre"
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <input
          type="email"
          name="email"
          value={formState.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <input
          type="password"
          name="password" 
          value={formState.password}
          onChange={handleChange}
          placeholder="Contraseña"
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <button type="submit" disabled={loading} className="w-full p-2 mb-4 bg-blue-500 hover:bg-blue-700 text-white rounded cursor-pointer">
          {loading ? 'Cargando...' : 'Registrar'}
        </button>
        <Link href='/'>
          <button className="w-full p-2 bg-gray-500 hover:bg-gray-700 text-white rounded cursor-pointer">
            Volver
          </button>
        </Link>
      </form>
    </div>
  );
};

export default Registro;
