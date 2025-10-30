import { UsuarioSecurityRequest } from '@/src/core/types/usuario/index';
import { useNavigation } from '@/src/shared/constants/router';
import { RoleName } from '@/src/shared/enums/roleName';
import RegisterService from '@/src/shared/services/auth/register';
import React, { useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Importar o novo serviço e os tipos


const RegisterScreen = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();

  // --- NOVOS ESTADOS ---
  // Estado para controlar o tipo de conta (Role) selecionada
  const [role, setRole] = useState<RoleName>(RoleName.ROLE_PROFESSOR); // Padrão: Professor
  // Estado para controlar o "carregando" (loading)
  const [loading, setLoading] = useState(false);
  
  const handleRegister = async () => {
    if (!nome || !email || !password || !confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    // 2. Inicia o loading
    setLoading(true);

    // 3. Monta o objeto da requisição
    const request: UsuarioSecurityRequest = {
      nome: nome,
      email: email,
      senha: password,
      roles: [role] // Envia a role selecionada dentro de um array
    };

    // 4. Chama o serviço
    try {
      await RegisterService.createUser(request);
      
      // Sucesso!
      Alert.alert(
        'Sucesso!',
        'Sua conta foi criada. Você será redirecionado para o login.',
        [
          { text: 'OK', onPress: () => navigation.login() } // Navega para o login
        ]
      );

    } catch (error: any) {
      // 5. Trata o erro vindo do serviço
      Alert.alert('Erro no Cadastro', error.message);
    } finally {
      // 6. Para o loading, independente de sucesso ou falha
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={styles.container.backgroundColor} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.mainContent}>
          <View style={styles.card}>
            <Text style={styles.title}>Criar Conta</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              placeholderTextColor="#9E9E9E"
              value={nome}
              onChangeText={setNome}
              editable={!loading} // Não deixa editar enquanto carrega
            />

            <TextInput
              style={styles.input}
              placeholder="Insira o seu melhor email"
              placeholderTextColor="#9E9E9E"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              editable={!loading}
            />

            <TextInput
              style={styles.input}
              placeholder="Crie uma senha"
              placeholderTextColor="#9E9E9E"
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
              editable={!loading}
            />

            <TextInput
              style={styles.input}
              placeholder="Confirme a senha"
              placeholderTextColor="#9E9E9E"
              secureTextEntry={true}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              editable={!loading}
            />

            {/* --- SELETOR DE ROLE --- */}
            <Text style={styles.label}>Tipo de Conta:</Text>
            <View style={styles.roleContainer}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === RoleName.ROLE_PROFESSOR && styles.roleButtonActive
                ]}
                onPress={() => setRole(RoleName.ROLE_PROFESSOR)}
                disabled={loading}
              >
                <Text style={[
                  styles.roleText,
                  role === RoleName.ROLE_PROFESSOR && styles.roleTextActive
                ]}>
                  Professor
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === RoleName.ROLE_ADMINISTRADOR && styles.roleButtonActive
                ]}
                onPress={() => setRole(RoleName.ROLE_ADMINISTRADOR)}
                disabled={loading}
              >
                <Text style={[
                  styles.roleText,
                  role === RoleName.ROLE_ADMINISTRADOR && styles.roleTextActive
                ]}>
                  Admin
                </Text>
              </TouchableOpacity>
            </View>
            {/* --- FIM DO SELETOR DE ROLE --- */}

            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]} // Estilo de botão desabilitado
              onPress={handleRegister} // Chama a função de cadastro
              disabled={loading} // Desabilita o botão durante o loading
            >
              <Text style={styles.buttonText}>
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Já possui uma conta? </Text>
        <TouchableOpacity onPress={navigation.login}>
          <Text style={styles.footerLink}>Entre</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// --- ESTILOS (com adições para o seletor de Role) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003F72',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 35,
    paddingHorizontal: 25,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#003F72',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
  },
  input: {
    height: 50,
    borderColor: '#D1D1D1',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
  },
  // --- NOVOS ESTILOS PARA O SELETOR DE ROLE ---
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    fontWeight: '500',
    paddingLeft: 5,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  roleButton: {
    flex: 1, // Faz os botões dividirem o espaço
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D1D1',
    alignItems: 'center',
    marginHorizontal: 5, // Espaço entre os botões
  },
  roleButtonActive: {
    backgroundColor: '#003F72',
    borderColor: '#003F72',
  },
  roleText: {
    fontSize: 15,
    color: '#003F72',
    fontWeight: 'bold',
  },
  roleTextActive: {
    color: 'white',
  },
  // --- FIM DOS NOVOS ESTILOS ---
  button: {
    backgroundColor: '#3FA9F5',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: { // Estilo para botão desabilitado
    backgroundColor: '#B0DFFF',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
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

export default RegisterScreen;
