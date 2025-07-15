import { useNavigate } from "react-router-dom";

export const useAppNavigation = () => {
    const navigate = useNavigate();

    return {
        goToHome: () => navigate("/"),
        goToSignup: () => navigate("/sign-up"),
        goToLogin: () => navigate("/login"),
        replaceToHome: () => navigate("/", { replace: true }),
    };
};
