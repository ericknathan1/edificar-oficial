import { useRouter } from "expo-router";

/**
 * @deprecated Use `useRouter` do `expo-router` diretamente.
 * Ex: `router.push('/auth/login')` ou `router.replace('/(tabs)/turmas')`
 */
export const useNavigation = () => {
    const router = useRouter();

    const navigateTo = {
        login: () => router.push("/auth/login"),
        register: () => router.push("/auth/register"),
        // As tabs agora são um grupo, então navegamos para a rota inicial das tabs
        turmas: () => router.push("/(tabs)/turmas"),
        alunos: () => router.push("/(tabs)/alunos"),
        professores: () => router.push("/(tabs)/professores"),
        usuarios: () => router.push("/(tabs)/usuarios"),
        perfil: () => router.push("/(tabs)/perfil"),
    }

    return navigateTo;
}