export interface Vehiculo {
    patenteVehiculo: string;
    anioFabricacion: number;
    nombrePropietario: string;
    apellidoPropietario: string;
    domicilioPropietarioCalle: string;
    domicilioPropietarioNumero: number;
    domicilioPropietarioCiudad: string;
    modelo: string;
    marca: string;
}

export interface FormularioVehiculoProps {
    initialData?: Vehiculo;
}