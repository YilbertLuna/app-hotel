import { Link } from 'expo-router'; // Asumiendo que estás usando Expo Router
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function Footer () {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Reserve su habitación hoy mismo</Text>
          <Text style={styles.subtitle}>
            Disfrute de nuestras tarifas especiales y beneficios exclusivos al reservar directamente en nuestra web.
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <Link href="/explore" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Ver disponibilidad</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 120,
    backgroundColor: '#1a1a1a',
    position: 'relative',
  },
  contentContainer: {
    width: '100%',
    maxWidth: 1200,
    marginHorizontal: 'auto',
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    gap: 16,
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    textAlign: 'center',
    color: '#ffffff',
    letterSpacing: -0.5,
    lineHeight: 48,
  },
  subtitle: {
    fontSize: 18,
    color: '#9ca3af',
    textAlign: 'center',
    maxWidth: 700,
    lineHeight: 28,
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 16,
  },
  button: {
    backgroundColor: '#4a6cf7',
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#4a6cf7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});