export type LoginCredentials = {
    username: string;
    password: string;
};

export const UserRole = {
    USER: "USER",
    ADMIN: "ADMIN",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export type SignupRequest = {
    nickname: string;
    password: string;
    password_confirm: string;
    username: string;
    phone_number: string;
    profile_image?: string | null;
    role?: UserRole;
};
