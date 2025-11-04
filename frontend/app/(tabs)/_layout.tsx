import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Importe os ícones
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#003F72', // Cor para a aba ativa
        tabBarInactiveTintColor: 'gray', // Cor para abas inativas
      })}>
      <Tabs.Screen
        name="turmas/index"
        options={{
          title: 'Turmas', // Adiciona um título legível
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="school-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="alunos/index"
        options={{
          title: 'Alunos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="professores/index"
        options={{
          title: 'Professores',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="usuarios/index"
        options={{
          title: 'Usuários',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cog-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil/index"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            // --- CORREÇÃO AQUI ---
            <Ionicons name="person-circle-outline" size={size} color={color} /> 
            // Era "IonicVect"
          ),
        }}
      />
    </Tabs>
  );
}