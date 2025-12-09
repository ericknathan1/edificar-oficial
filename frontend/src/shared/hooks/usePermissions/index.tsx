import { useAuth } from '../useAuth';

export const usePermissions = () => {
    const { user } = useAuth();

    const normalizeRole = (role: string) =>
        role.toUpperCase().startsWith("ROLE_") ? role : `${role}`;

    const userRoles = user?.roles?.map(normalizeRole) ?? [];

    const isAdmin = () => {
        if(userRoles.includes("ROLE_ADMINISTRADOR")){
            return true;
        }else{
            return false;
        }
    };

    const isProfessor = () => {
        if(userRoles.includes("ROLE_PROFESSOR")){
            return true;
        }else{
            return false;
        }
    };

    

    return {
        isAdmin: isAdmin(),
        isProfessor: isProfessor()
    };
};