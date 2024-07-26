'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link'
import { toast } from 'react-hot-toast';
import { Usuario } from '@/types/usuario';

const Registro = () => {
  const [formState, setFormState] = useState<Usuario>({ username: '', password: '', email: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();
  const bcrypt = require('bcryptjs');
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    
    if (!formState.username) {
      errors.username = 'El nombre es obligatorio';
    } else if (formState.username.length < 6) {
      errors.username = 'El nombre debe tener al menos 6 caracteres';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formState.email)) {
      errors.email = 'El email no es válido';
    }
    
    if (formState.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    } else if (!/[A-Z]/.test(formState.password)) {
      errors.password = 'La contraseña debe contener al menos una letra mayúscula';
    } else if (!/[a-z]/.test(formState.password)) {
      errors.password = 'La contraseña debe contener al menos una letra minúscula';
    } else if (!/[0-9]/.test(formState.password)) {
      errors.password = 'La contraseña debe contener al menos un número';
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formState.password)) {
      errors.password = 'La contraseña debe contener al menos un símbolo';
    }
    
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Corrige los errores en el formulario.');
      return;
    }
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
        `${apiUrl}`,
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
    <div className="flex min-h-screen items-center justify-center p-4 dark:text-gray-100">
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white  p-8 rounded-lg shadow-md dark:bg-gray-800">
        <h1 className="text-2xl mb-4">Registrarse</h1>
        <div className="mb-4">
          <input
            type="text"
            name="username"
            value={formState.username}
            onChange={handleChange}
            placeholder="Nombre"
            className={`w-full p-2 border ${errors.username ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded dark:bg-gray-900 dark:text-gray-100`}
            />
          {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
        </div>
        <div className="w-full mb-4">
          <input
            type="text"
            name="email"
            value={formState.email}
            onChange={handleChange}
            placeholder="Email"
            className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded dark:bg-gray-900 dark:text-gray-100`}
            />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        <div className="mb-4">
          <input
            type="password"
            name="password" 
            value={formState.password}
            onChange={handleChange}
            placeholder="Contraseña"
            className={`w-full p-2 border ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded dark:bg-gray-900 dark:text-gray-100`}
            />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>
        <button type="submit" disabled={loading} className="w-full p-2 mb-4 bg-blue-500 hover:bg-blue-700 text-white rounded cursor-pointer dark:bg-blue-600 dark:hover:bg-blue-800">
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
