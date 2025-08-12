import { Footer } from '@/components/Footer';
import { HotelFeatures } from '@/components/HotelFeatures';
import { StaticRoomShowcase } from '@/components/StaticRooms';
import { Link } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HomePage() {
  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroContainer}>
            <View style={styles.heroContent}>
              <View style={styles.heroTextContainer}>
                <Text style={styles.heroTitle}>Hotel Astell</Text>
                <Text style={styles.heroSubtitle}>Disfrute de una estancia inolvidable</Text>
                <Text style={styles.heroDescription}>
                  Nuestro hotel ofrece el máximo confort, servicios de primera clase y una ubicación privilegiada para
                  hacer de su estancia una experiencia única.
                </Text>
              </View>
              <View style={styles.buttonGroup}>
                  <Link href="/explore" style={styles.buttonText}>Ver habitaciones</Link>
              </View>
            </View>
            <View style={styles.heroImageContainer}>
              <Image
                source={require('@/assets/images/image.png')}
                style={styles.heroImage}
                resizeMode="cover"
              />
            </View>
          </View>
        </View>

        <HotelFeatures />

        <StaticRoomShowcase />

        <Footer />

      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  heroSection: {
    width: '100%',
    paddingVertical: 80,
    backgroundColor: '#f8f9fa',
    position: 'relative',
    overflow: 'hidden',
  },
  heroContainer: {
    paddingHorizontal: 24,
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 2,
  },
  heroContent: {
    marginBottom: 32,
    width: '100%',
    maxWidth: 1200,
  },
  heroTextContainer: {
    marginBottom: 24,
    paddingTop: 40,
    gap: 16,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#4a6cf7',
    marginBottom: 16,
    textAlign: 'center',
  },
  heroDescription: {
    fontSize: 18,
    color: '#4b5563',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 28,
    maxWidth: 800,
    alignSelf: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
    marginTop: 24,
  },
  buttonText: {
    backgroundColor: '#4a6cf7',
    color: 'white',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    fontWeight: '600',
    fontSize: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#4a6cf7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonLink: {
    color: '#4a6cf7',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    fontWeight: '600',
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#4a6cf7',
  },
  heroImageContainer: {
    width: '100%',
    maxWidth: 1200,
    aspectRatio: 16/9,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    marginTop: 40,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
});