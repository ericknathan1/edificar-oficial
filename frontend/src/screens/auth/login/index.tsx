import { Button } from '@/src/shared/components/ui/button';
import { Input } from '@/src/shared/components/ui/input';
import { useNavigation } from '@/src/shared/constants/router';
import { useAuth } from '@/src/shared/hooks/useAuth';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Estado de loading local para o botão
  const navigation = useNavigation();
  const { login } = useAuth(); // Pegar a função de login do hook

  const validarLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha email e senha.');
      return;
    }

    setLoading(true);
    try {
      await login({ email: email, senha: password });
      // A navegação agora é tratada pelo RootLayout,
      // que reage à mudança no estado de autenticação.
      // Não precisamos mais do navigation.turmas() aqui.
    } catch (e: any) {
      console.error("Erro ao logar: ", e);
      Alert.alert('Erro no Login', 'Email ou senha inválidos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Usa ScreenContainer para um fundo padronizado (mas mantemos o estilo original do container)
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={styles.container.backgroundColor} />

      <View style={styles.mainContent}>
        <View style={styles.card}>
          <Image style={styles.logo} source={require("../../../../assets/images/logo.png")} />
          
          {/* Componente Input customizado */}
          <Input
            label="Email"
            style={styles.input}
            placeholder="Insira o email ou nome de usuário"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
            autoCapitalize="none"
          />

          {/* Componente Input customizado */}
          <Input
            label="Senha"
            style={styles.input}
            placeholder="Insira a senha"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
            editable={!loading}
          />

          {/* Componente Button customizado */}
          <Button
            title="Entrar"
            onPress={validarLogin}
            style={styles.button}
            loading={loading} // Passa o estado de loading
            disabled={loading}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Não possui uma conta? </Text>
        <TouchableOpacity onPress={navigation.register} disabled={loading}>
          <Text style={styles.footerLink}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003F72',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 35,
    paddingHorizontal: 25,
    alignItems: 'stretch', // Alinha os inputs
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  logo: {
    width: '100%', // Faz a logo se ajustar ao card
    height: 120,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20, // Espaço abaixo da logo
  },
  input: {
    // Estilos do Input já vêm do componente, mas podemos sobrescrever
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    marginBottom: 20,
    width: "100%",
    backgroundColor: '#3FA9F5', // Cor específica do login
  },
  footer: {
    padding: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: 'white',
    fontSize: 16,
  },
  footerLink: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;