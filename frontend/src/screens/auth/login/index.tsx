import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform, // Importa Platform para checar o S.O.
} from 'react-native';
import LoginService from '../../../shared/services/auth/login/index';
import { useNavigation } from '@/src/shared/constants/router';



// Convenção do React: Componentes começam com letra maiúscula
const LoginScreen = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const validarLogin = async () => {
    if (email.length === 0) return
    try{
      await LoginService.validateUser(email,password);
      console.log("Login feito com sucesso");
      navigation.turmas();
    }catch(e){
      console.error("Erro ao logar: ", e);
    }
  }


  return (
    // SafeAreaView evita que o conteúdo fique atrás do "notch" (iOS)
    <View style={styles.container}>
      {/* Configura a barra de status (relógio, bateria) para ter texto claro */}
      <StatusBar barStyle="light-content" backgroundColor={styles.container.backgroundColor} />

      {/* View principal que centraliza o card */}
      <View style={styles.mainContent}>
        {/* O card branco */}
        <View style={styles.card}>
          <Text style={styles.logo}>Edificar</Text>

          <TextInput
            style={styles.input}
            placeholder="Insira o email ou nome de usuário"
            placeholderTextColor="#9E9E9E" // Cor do texto de placeholder
            keyboardType="email-address" // Mostra o teclado de email
            value={email}
            onChangeText={setEmail} // Atualiza o state 'email'
          />

          <TextInput
            style={styles.input}
            placeholder="Insira a senha"
            placeholderTextColor="#9E9E9E"
            secureTextEntry={true} // Esconde a senha (pontinhos)
            value={password}
            onChangeText={setPassword} // Atualiza o state 'password'
          />

          <TouchableOpacity onPress={validarLogin} style={styles.button}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotPasswordButton}>
            <Text style={styles.forgotPasswordText}>Esqueci a senha</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Rodapé da tela */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Não possui uma conta? </Text>
        {/* Usamos TouchableOpacity para o link ser clicável */}
        <TouchableOpacity onPress={navigation.register}>
          <Text style={styles.footerLink}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// --- ESTILOS ---
// Usar StyleSheet.create é melhor para performance
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003F72', // Azul escuro do fundo
  },
  mainContent: {
    flex: 1, // Faz esta View ocupar todo o espaço disponível (exceto o rodapé)
    justifyContent: 'center', // Centraliza o card verticalmente
    alignItems: 'center', // Centraliza o card horizontalmente
    paddingHorizontal: 20, // Dá um respiro nas laterais
  },
  card: {
    width: '100%', // O card ocupa 100% da largura do 'mainContent'
    backgroundColor: 'white',
    borderRadius: 16, // Bordas arredondadas
    paddingVertical: 35,
    paddingHorizontal: 25,
    alignItems: 'stretch', // Faz os filhos (inputs, button) esticarem
    // Sombra (iOS)
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    // Sombra (Android)
    elevation: 8,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#003F72', // Azul do logo (mesmo do fundo)
    textAlign: 'center',
    marginBottom: 30,
    // A fonte da imagem é Serifada (como Times New Roman)
    // Para usar a fonte exata, você precisaria importá-la no projeto
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
  },
  input: {
    height: 50,
    borderColor: '#D1D1D1', // Borda cinza clara
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#F9F9F9', // Fundo do input levemente cinza
  },
  button: {
    backgroundColor: '#3FA9F5', // Azul claro do botão
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPasswordButton: {
    alignSelf: 'center', // Centraliza o link
  },
  forgotPasswordText: {
    color: '#003F72', // Azul do link
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    padding: 30,
    flexDirection: 'row', // Coloca os textos lado a lado
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
    textDecorationLine: 'underline', // Sublinhado
  },
});

export default LoginScreen;