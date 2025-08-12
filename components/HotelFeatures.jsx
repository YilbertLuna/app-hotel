import { Feather, FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function HotelFeatures() {
  const features = [
    {
      icon: <MaterialCommunityIcons name="bed-king" size={40} color="#007AFF" />,
      title: "Habitaciones de lujo",
      description: "Habitaciones espaciosas y elegantemente decoradas para su máximo confort.",
    },
    {
      icon: <Feather name="wifi" size={40} color="#007AFF" />,
      title: "WiFi gratuito",
      description: "Conexión a internet de alta velocidad en todas las áreas del hotel.",
    },
    {
      icon: <MaterialIcons name="restaurant" size={40} color="#007AFF" />,
      title: "Restaurante",
      description: "Disfrute de nuestra exquisita gastronomía en nuestro restaurante.",
    },
    {
      icon: <FontAwesome5 name="parking" size={40} color="#007AFF" />,
      title: "Estacionamiento",
      description: "Estacionamiento gratuito para todos nuestros huéspedes.",
    },
    {
      icon: <MaterialCommunityIcons name="pool" size={40} color="#007AFF" />,
      title: "Piscina",
      description: "Relájese en nuestra piscina con vistas panorámicas.",
    },
    {
      icon: <MaterialCommunityIcons name="map-marker" size={40} color="#007AFF" />,
      title: "Ubicación céntrica",
      description: "Ubicación privilegiada cerca de los principales puntos de interés.",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Nuestros servicios</Text>
        <Text style={styles.headerDescription}>
          Ofrecemos una amplia gama de servicios para hacer su estancia lo más cómoda posible.
        </Text>
      </View>
      
      <View style={styles.featuresGrid}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureCard}>
            {feature.icon}
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDescription}>{feature.description}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 80,
    backgroundColor: 'white',
  },
  headerContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 48,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 16,
    textAlign: 'center',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  headerDescription: {
    fontSize: 18,
    color: '#4b5563',
    textAlign: 'center',
    maxWidth: 800,
    lineHeight: 28,
  },
  featuresGrid: {
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
    paddingHorizontal: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 24,
  },
  featureCard: {
    width: '100%',
    maxWidth: 350,
    marginBottom: 0,
    padding: 32,
    borderRadius: 16,
    backgroundColor: 'white',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
    color: '#1a1a1a',
  },
  featureDescription: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 24,
  },
});
// For responsive layout on different screen sizes
const responsiveStyles = (dimensions) => StyleSheet.create({
  featureCard: {
    width: dimensions.width < 768 ? '100%' : dimensions.width < 1024 ? '48%' : '31%',
    marginBottom: 16,
  },
});