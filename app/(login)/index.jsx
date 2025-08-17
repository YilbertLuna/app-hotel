import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useReservations } from '../context/ReservationContext';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const { setUser } = useReservations();

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  async function handleAuth(isLogin) {
    setIsLoading(true);
    const { email, password, name } = formData;

    try {
      const endpoint = isLogin ? "auth/login" : "auth/register";
      const body = isLogin ? { email, password } : { user: name, email, password };
      const localIp = '192.168.0.107'
      
      const response = await fetch(`http://${localIp}:3000/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || 
          (isLogin ? "Error al iniciar sesión" : "Error al registrarse"));
      }

      // Extracción de datos
      const authToken = responseData.token || responseData.access_token || "token-simulado";
      let userInfo = responseData.user || responseData.data || responseData;
      
      // Si userInfo no es objeto, usamos formData
      if (typeof userInfo !== 'object' || userInfo === null) {
        userInfo = { email, name };
      }

      // Validación mínima
      if (!userInfo.email && !email) {
        throw new Error("El servidor no proporcionó un email válido");
      }

      // Determinar rol
      const isAdmin = email === "admin@gmail.com" || 
                     (userInfo.role && userInfo.role.toLowerCase() === "admin");

      // Datos del usuario estructurados
      const userData = {
        name: userInfo.name || name || "Invitado",
        email: userInfo.email || email,
        role: isAdmin ? "admin" : (userInfo.role || "client"),
        ...(userInfo.id && { id: userInfo.id }),
        ...(userInfo.room && { room: userInfo.room }),
        ...(userInfo.phone && { phone: userInfo.phone })
      };

      // Guardar token y usuario
      await Promise.all([
        AsyncStorage.setItem('@HotelApp:authToken', authToken),
        AsyncStorage.setItem('@HotelApp:userData', JSON.stringify(userData))
      ]);

      // Establecer usuario en el contexto
      await setUser(userData);

      // Redirección
      router.push(isAdmin ? '/(admin)/dashboard' : '/(tabs)');

    } catch (error) {
      Alert.alert(
        "Error", 
        typeof error === 'object' ? error.message : String(error)
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f0f4f8' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.innerContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Bienvenido</Text>
            <Text style={styles.subtitle}>Inicie sesión o regístrese para continuar</Text>
          </View>

          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === "login" && styles.activeTab]}
              onPress={() => setActiveTab("login")}
              disabled={isLoading}
            >
              <Text style={[styles.tabText, activeTab === "login" && styles.activeTabText]}>
                Iniciar sesión
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === "register" && styles.activeTab]}
              onPress={() => setActiveTab("register")}
              disabled={isLoading}
            >
              <Text style={[styles.tabText, activeTab === "register" && styles.activeTabText]}>
                Registrarse
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            {activeTab === "login" ? (
              <>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Iniciar sesión</Text>
                  <Text style={styles.cardDescription}>Ingrese sus credenciales para acceder a su cuenta</Text>
                </View>
                <View style={styles.cardContent}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Correo electrónico</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="correo@ejemplo.com"
                      value={formData.email}
                      onChangeText={(text) => handleChange('email', text)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      editable={!isLoading}
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <View style={styles.passwordHeader}>
                      <Text style={styles.label}>Contraseña</Text>
                      <TouchableOpacity 
                        onPress={() => router.push("/forgot-password")}
                        disabled={isLoading}
                      >
                        <Text style={styles.linkText}>¿Olvidó su contraseña?</Text>
                      </TouchableOpacity>
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="Contraseña"
                      value={formData.password}
                      onChangeText={(text) => handleChange('password', text)}
                      secureTextEntry
                      editable={!isLoading}
                    />
                  </View>
                  <TouchableOpacity 
                    style={[styles.button, isLoading && styles.buttonDisabled]}
                    onPress={() => handleAuth(true)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Iniciar sesión</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Crear cuenta</Text>
                  <Text style={styles.cardDescription}>Ingrese sus datos para crear una nueva cuenta</Text>
                </View>
                <View style={styles.cardContent}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nombre completo</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Nombre"
                      value={formData.name}
                      onChangeText={(text) => handleChange('name', text)}
                      editable={!isLoading}
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Correo electrónico</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="correo@ejemplo.com"
                      value={formData.email}
                      onChangeText={(text) => handleChange('email', text)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      editable={!isLoading}
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Contraseña</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Contraseña"
                      value={formData.password}
                      onChangeText={(text) => handleChange('password', text)}
                      secureTextEntry
                      editable={!isLoading}
                    />
                  </View>
                  <TouchableOpacity 
                    style={[styles.button, isLoading && styles.buttonDisabled]}
                    onPress={() => handleAuth(false)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Crear cuenta</Text>
                    )}
                  </TouchableOpacity>
                </View>
                <View style={styles.cardFooter}>
                  <Text style={styles.footerText}>
                    Al crear una cuenta, acepta nuestros{" "}
                    <Text style={styles.linkText}>
                      términos y condiciones
                    </Text>
                    .
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f0f4f8',
    paddingTop: Platform.OS === 'ios' ? 44 : 20,
  },
  innerContainer: {
    width: '100%',
    maxWidth: 450,
    alignSelf: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? -40 : -20,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 10,
    color: '#1a365d',
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 16,
    color: '#4a5568',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: '80%',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    backgroundColor: '#edf2f7',
    borderRadius: 12,
    padding: 6,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: 'white',
    shadowColor: '#3182ce',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#718096',
  },
  activeTabText: {
    color: '#3182ce',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 20,
    overflow: 'hidden',
  },
  cardHeader: {
    padding: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    color: '#2d3748',
  },
  cardDescription: {
    fontSize: 15,
    color: '#718096',
    lineHeight: 22,
  },
  cardContent: {
    padding: 25,
  },
  cardFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#edf2f7',
    backgroundColor: '#f8fafc',
  },
  inputGroup: {
    marginBottom: 22,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
    color: '#2d3748',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#1a202c',
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#3182ce',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#3182ce',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#90cdf4',
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  linkText: {
    color: '#3182ce',
    fontSize: 14,
    fontWeight: '600',
  },
  footerText: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 21,
  },
});