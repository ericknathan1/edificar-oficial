import { AuthProvider, useAuth } from "@/src/shared/hooks/useAuth";
import { SplashScreen, Stack, useRouter } from "expo-router";
import { useEffect } from "react";

// Impede o splash screen de esconder antes da verificação de auth
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (token) {
        // Usuário logado, vai para as tabs
        router.replace("/(tabs)/turmas");
      } else {
        // Usuário deslogado, vai para o login
        router.replace("/auth/login");
      }
      // Esconde o splash screen
      SplashScreen.hideAsync();
    }
  }, [isLoading, token, router]);

  // Durante o isLoading, o splash screen nativo ainda está visível
  // Retornamos null para não renderizar nada até a auth estar pronta
  if (isLoading) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="auth" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    // Engloba todo o app com o Provedor de Autenticação
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}