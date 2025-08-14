import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, Alert, Animated, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useReservations } from '../context/ReservationContext';
export default function AdminDashboard() {
  const { 
    reservations = [], 
    users = [],
    currentUser,
    isLoading = false,
    handleLogout,
    loadReservations
  } = useReservations();

  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Carga inicial de datos
  useEffect(() => {
    if (currentUser?.role === 'admin') {
      loadReservations();
    }
  }, [currentUser]);

  // Animación de entrada
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Cálculos optimizados
  const totalGanancias = reservations.reduce((sum, res) => {
  return sum + (res.totalPrice || (res.roomPrice * res.daysStaying) || 0);
}, 0);
  const reservasActivas = reservations.filter(res => {
    const hoy = new Date();
    const checkOut = new Date(res.checkOutDate);
    return checkOut > hoy;
  });
  const habitacionesPopulares = calcularHabitacionesPopulares(reservations);

  return (
    <Animated.View style={[styles.container, { 
        opacity: fadeAnim,
        paddingTop: Platform.OS === 'ios' ? 30 : 10  // Ajuste para iOS/Android
      }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Panel Administrativo</Text>
          <View style={styles.userBadge}>
            <Ionicons name="person-circle-outline" size={20} color="#4a6cf7" />
            <Text style={styles.welcomeText}>
              {currentUser?.name ? `Hola, ${currentUser.role}` : 'Sesión activa'}
            </Text>
          </View>
        </View>

        {/* Tarjetas de Estadísticas */}
        <View style={styles.statsContainer}>
          <StatCard 
            icon="cash-outline" 
            title="Ganancias Totales" 
            value={`$${totalGanancias.toLocaleString()}`} 
            color="#10B981"
          />
          <StatCard 
            icon="calendar-check-outline" 
            title="Reservas Activas" 
            value={reservasActivas.length} 
            color="#3B82F6"
            subtitle={`de ${reservations.length}`}
          />
        </View>

        {/* Sección de Reservas Recientes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Últimas Reservas</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          
          {reservations.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No hay reservas registradas</Text>
            </View>
          ) : (
            reservations.slice(0, 3).map(reservation => (
              <ReservationCard 
                key={reservation.id} 
                reservation={reservation} 
                esActiva={new Date(reservation.checkOutDate) > new Date()}
              />
            ))
          )}
        </View>

        {/* Sección de Habitaciones Populares */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Habitaciones Populares</Text>
          <View style={styles.popularRoomsContainer}>
            {habitacionesPopulares.slice(0, 3).map((room, index) => (
              <PopularRoomCard 
                key={index} 
                room={room} 
                index={index}
              />
            ))}
          </View>
        </View>

        {/* Botón de Logout */}
        <TouchableOpacity 
          style={[styles.actionButton, styles.logoutButton]} 
          onPress={async () => {
            const success = await handleLogout();
            if (success) router.push('/(login)');
            else Alert.alert("Error", "No se pudo cerrar sesión");
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="log-out-outline" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Cerrar sesión</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );
}

// Componentes Auxiliares
const StatCard = ({ icon, title, value, color, subtitle }) => (
  <View style={[styles.statCard, { borderLeftColor: color }]}>
    <Ionicons name={icon} size={24} color={color} style={styles.statIcon} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statTitle}>{title}</Text>
    {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
  </View>
);

const ReservationCard = ({ reservation }) => {
  const isActive = new Date(reservation.checkOutDate) > new Date();
  
  return (
    <View style={[styles.reservationCard, isActive && styles.activeReservation]}>
      <Text style={styles.roomName}>{reservation.roomName || 'Habitación no especificada'}</Text>
      <Text style={styles.userEmail}>{reservation.userId || 'Usuario desconocido'}</Text>
      
      <View style={styles.dateRow}>
        <Ionicons name="calendar-outline" size={14} color="#666" />
        <Text style={styles.dates}>
          {reservation.checkInDate 
            ? new Date(reservation.checkInDate).toLocaleDateString('es-ES') 
            : 'Fecha no definida'} - {' '}
          {reservation.checkOutDate 
            ? new Date(reservation.checkOutDate).toLocaleDateString('es-ES') 
            : 'Fecha no definida'}
        </Text>
      </View>

      <Text style={styles.priceText}>
        Total: ${reservation.totalPrice || (reservation.roomPrice * reservation.daysStaying) || '0'}
      </Text>
      
      {isActive && (
        <View style={styles.activeBadge}>
          <Text style={styles.activeText}>ACTIVA</Text>
        </View>
      )}
    </View>
  );
};

const PopularRoomCard = ({ room, index }) => (
  <View style={styles.popularRoomCard}>
    <View style={styles.roomRank}>
      <Text style={styles.rankText}>#{index + 1}</Text>
    </View>
    <Text style={styles.popularRoomName}>{room.key}</Text>
    <Text style={styles.reservationCount}>{room.value} reserva{room.value !== 1 ? 's' : ''}</Text>
  </View>
);

// Función auxiliar
const calcularHabitacionesPopulares = (reservations) => {
  const counts = {};
  reservations.forEach(res => {
    counts[res.roomName] = (counts[res.roomName] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([key, value]) => ({ key, value }))
    .sort((a, b) => b.value - a.value);
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: 10,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  container: {
      flex: 1,
      backgroundColor: '#F9FAFB',
      paddingTop: 10,
  },
  header: {
      paddingTop: 40,
      paddingBottom: 24,
      paddingHorizontal: 16,
      marginTop: 20,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
      marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  welcomeText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  seeAllText: {
    color: '#4F46E5',
    fontWeight: '500',
    fontSize: 14,
  },
  reservationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  reservationActive: {
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  reservationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  reservationPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
  },
  clientEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dates: {
    fontSize: 14,
    color: '#4B5563',
  },
  activeBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 'auto',
  },
  activeBadgeText: {
    fontSize: 12,
    color: '#065F46',
    fontWeight: '600',
  },
  popularRoomsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  popularRoomCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  roomRank: {
    backgroundColor: '#F5F3FF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  rankText: {
    color: '#8B5CF6',
    fontWeight: '700',
  },
  popularRoomName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
    textAlign: 'center',
  },
  reservationCount: {
    fontSize: 12,
    color: '#6B7280',
  },
  actionButton: {
    backgroundColor: '#4a6cf7',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#4a6cf7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    marginTop: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  activeReservation: {
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  activeBadge: {
      backgroundColor: '#D1FAE5',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      alignSelf: 'flex-start',
      marginTop: 8,
  },
  activeText: {
      color: '#065F46',
      fontSize: 12,
      fontWeight: 'bold',
  },
  priceText: {
      fontWeight: 'bold',
      marginTop: 8,
      color: '#333',
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  headerTitle: {
    fontSize: 24,  // Reducido ligeramente
    fontWeight: '700',  // Semibold en lugar de black
    color: '#111827',
  },
  welcomeText: {
    fontSize: 14,
    color: '#6B7280',
  },
});