# Gestor de Infracciones ( Frontend )

Este es el proyecto frontend para el sistema de gestión de infracciones de tránsito. El proyecto está desarrollado utilizando Next.js y se conecta a un backend implementado con Flask y GraphQL.


## Descripción

El sistema permite a los usuarios gestionar infracciones de tránsito, vehículos y registros. Los usuarios pueden ver, agregar y eliminar infracciones, registros y vehiculos a través de una interfaz web intuitiva. Además, la autenticación de usuarios está implementada para asegurar que solo usuarios registrados puedan realizar estas acciones.

## Tecnologías Utilizadas

- **Frontend**: Next.js, React
- **Backend**: Flask, GraphQL
- **Base de datos**: PostgreSQL
- **Estilo**: Tailwind CSS
- **Estado de la Aplicación**: Context API
- **Manejo de Solicitudes**: Axios

## Instalación

1. Clonar el repositorio:

```bash
    git clone https://github.com/cristianchivisky/gestor-infracciones-frontend.git
    cd gestor-infracciones-frontend
```
2. Instalar dependencias:

```bash
    npm install
```
3. Iniciar la aplicación:

```bash
    npm run dev
```
4. Abre http://localhost:3000 en tu navegador.

## Funcionalidades

- Autenticación: Los usuarios pueden iniciar sesión y cerrar sesión. Solo los usuarios autenticados pueden acceder a las páginas de gestión de infracciones, vehículos y registros.
- Gestión de infracciones: Visualizar, agregar, y eliminar infracciones.
- Gestión de vehículos: Visualizar y agregar vehículos.
- Gestión de registros: Visualizar y agregar registros.

## Contribuciones

Las contribuciones son bienvenidas. Sigue los siguientes pasos para contribuir:

1. Fork el repositorio.
2. Crea una nueva rama (git checkout -b feature/nueva-funcionalidad).
3. Realiza tus cambios y haz commit (git commit -m 'Agregar nueva funcionalidad').
4. Push a la rama (git push origin feature/nueva-funcionalidad).
5. Abre un Pull Request.

## Licencia

Este proyecto está bajo la licencia MIT. Puedes consultar el archivo LICENSE para más detalles.

## Contacto

Para más información, puedes contactarme a través de cristian.chivisky@gmail.com.