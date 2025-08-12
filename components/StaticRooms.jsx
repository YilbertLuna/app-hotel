import { Rooms as staticRooms } from '@/data/Rooms';
import { MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function StaticRoomShowcase() {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Nuestras habitaciones</Text>
        <Text style={styles.headerDescription}>
          Descubra nuestras elegantes habitaciones diseñadas para su máximo confort.
        </Text>
      </View>
      
      <View style={styles.roomsGrid}>
        {staticRooms.map((room) => (
          <View key={room._id} style={styles.roomCard}>
            <Image
              source={room.images[0]}
              alt={`${room.name}`}
              style={styles.roomImage}
              resizeMode="cover"
            />
            <View style={styles.roomContent}>
              <View style={styles.roomHeader}>
                <Text style={styles.roomTitle}>{room.name}</Text>
                <View style={styles.priceBadge}>
                  <Text style={styles.priceText}>${room.price}/noche</Text>
                </View>
              </View>
              <Text style={styles.roomDescription}>{room.description}</Text>
              
              <View style={styles.featuresGrid}>
                {room.features.slice(0, 4).map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <MaterialIcons name="check" size={16} color="#007AFF" />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              <Link href={`/explore`} asChild>
                <TouchableOpacity style={styles.detailsButton}>
                  <Text style={styles.buttonText}>Ver detalles</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        ))}
      </View>

      <Link href={'/explore'} asChild>
        <TouchableOpacity style={styles.allRoomsButton}>
          <Text style={styles.allRoomsButtonText}>Ver todas las habitaciones</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 80,
    backgroundColor: '#f8f9fa',
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
  roomsGrid: {
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
    paddingHorizontal: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 40,
  },
  roomCard: {
    width: '100%',
    maxWidth: 380,
    marginBottom: 0,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  roomImage: {
    width: '100%',
    height: 240,
  },
  roomContent: {
    padding: 24,
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  roomTitle: {
    fontSize: 22,
    fontWeight: '700',
    flex: 1,
    color: '#1a1a1a',
  },
  priceBadge: {
    backgroundColor: '#f0f4ff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  priceText: {
    color: '#4a6cf7',
    fontWeight: '700',
    fontSize: 16,
  },
  roomDescription: {
    color: '#4b5563',
    marginBottom: 24,
    lineHeight: 24,
    fontSize: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    gap: 12,
  },
  featureItem: {
    width: 'calc(50% - 6px)',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  featureText: {
    marginLeft: 8,
    fontSize: 15,
    color: '#4b5563',
  },
  detailsButton: {
    backgroundColor: '#4a6cf7',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#4a6cf7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  allRoomsButton: {
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#4a6cf7',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  allRoomsButtonText: {
    color: '#4a6cf7',
    fontWeight: '600',
    fontSize: 16,
  },
});

// For responsive layout on different screen sizes
const responsiveStyles = (dimensions) => StyleSheet.create({
  roomCard: {
    width: dimensions.width < 768 ? '100%' : dimensions.width < 1024 ? '48%' : '31%',
    marginBottom: 24,
  },
});