import type { LoginCredentials } from "@/entities/user";
import { useState } from "react";

export const useLoginForm = () => {
    const [credentials, setCredentials] = useState<LoginCredentials>({
        username: "",
        password: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return {
        credentials,
        setCredentials,
        handleInputChange,
    };
};
