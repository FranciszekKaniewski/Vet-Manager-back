export interface User{
    id?: string;
    name: string;
    surname: string;
    email: string;
    password: string;
    phoneNumber?: number | null;
    avatar?: string | null;
    role: 'admin'|'doctor'|'user';
}
