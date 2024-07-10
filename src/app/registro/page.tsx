'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link'
import { toast } from 'react-hot-toast';

const Registro = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('datos: ', username, password, email)
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
      nombre: username,
      contrasenia: password,
      email: email
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
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl mb-4">Registrarse</h1>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nombre"
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
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
          Registrar
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
