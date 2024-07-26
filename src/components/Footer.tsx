import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gray-800">
      <div className="max-w-7xl mx-auto py-4 px-2 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center sm:flex-row sm:items-center sm:justify-between">
          <div className="text-gray-400 text-sm text-center mb-4 sm:mb-0">
            © 2024 Gestor de Infracciones. Todos los derechos reservados.
          </div>
          <div className="flex flex-wrap justify-center space-x-4 sm:space-x-4">
            <div className="relative group">
              <Image src="/icons/react.svg" alt="React" width={18} height={18} />
              <div className="absolute top-[-1.5rem] left-1/2 transform -translate-x-1/2 -translate-y-2 text-xs bg-gray-900 text-white rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                React
              </div>
            </div>
            <div className="relative group">
              <Image src="/icons/nextjs.svg" alt="Next.js" width={18} height={18} />
              <div className="absolute top-[-1.5rem] left-1/2 transform -translate-x-1/2 -translate-y-2 text-xs bg-gray-900 text-white rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                Next.js
              </div>
            </div>
            <div className="relative group">
              <Image src="/icons/tailwindcss.svg" alt="Tailwind CSS" width={18} height={18} />
              <div className="absolute top-[-1.5rem] left-1/2 transform -translate-x-1/2 -translate-y-2 text-xs bg-gray-900 text-white rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                Tailwind CSS
              </div>
            </div>
            <div className="relative group">
              <Image src="/icons/postgresql.svg" alt="PostgreSQL" width={18} height={18} />
              <div className="absolute top-[-1.5rem] left-1/2 transform -translate-x-1/2 -translate-y-2 text-xs bg-gray-900 text-white rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                PostgreSQL
              </div>
            </div>
            <div className="relative group">
              <Image src="/icons/flask.svg" alt="Flask" width={18} height={18} />
              <div className="absolute top-[-1.5rem] left-1/2 transform -translate-x-1/2 -translate-y-2 text-xs bg-gray-900 text-white rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                Flask
              </div>
            </div>
            <div className="relative group">
              <Image src="/icons/graphql.svg" alt="GraphQL" width={18} height={18} />
              <div className="absolute top-[-1.5rem] left-1/2 transform -translate-x-1/2 -translate-y-2 text-xs bg-gray-900 text-white rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                GraphQL
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
