export interface Registro {
    numeroRegistro: number;
    nombre: string;
    apellido: string;
    domicilioCalle: string;
    domicilioNumero: number;
    domicilioCiudad: string;
    edad: number;
    fechaEmision: string;
    fechaVencimiento: string;
}

export interface FormularioRegistroProps {
    initialData?: Registro;
}
