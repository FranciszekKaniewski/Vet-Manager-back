export interface User{
    id: string;
    name: string;
    surname: string;
    email: string;
    password: string;
    phoneNumber?: number;
    avatar?: string;
    role: string;
}
