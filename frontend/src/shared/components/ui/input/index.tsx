import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';

interface Props extends TextInputProps {
  label: string;
  error?: string;
}

/**
 * Componente de Input padronizado com Label, tratamento de erro e ícone de senha.
 */
export const Input = ({ label, error, style, secureTextEntry, ...props }: Props) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Se secureTextEntry for passado (para senhas), controlamos a visibilidade
  const isSecure = secureTextEntry && !isPasswordVisible;

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input, 
            !!error && styles.inputError, 
            style, 
            // Se for senha, damos espaço para o ícone
            secureTextEntry && { paddingRight: 40 } 
          ]}
          placeholderTextColor="#9E9E9E"
          secureTextEntry={isSecure}
          {...props}
        />
        
        {/* Ícone de Olho para Senhas */}
        {secureTextEntry && (
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
            <Ionicons 
              name={isPasswordVisible ? "eye-off" : "eye"} 
              size={24} 
              color="#9E9E9E" 
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    height: 50,
    borderColor: '#D1D1D1',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
    width: '100%',
  },
  inputError: {
    borderColor: '#dc3545',
    borderWidth: 2,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    padding: 5, // Aumenta a área de toque
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: 4,
  },
});