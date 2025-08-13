// app/(tabs)/profile.js
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useReservations } from '../context/ReservationContext';

export default function ProfileScreen() {
    const { 
        currentUser, 
        reservations, 
        isLoading,
        cancelReservation,
        handleLogout 
    } = useReservations();
    const router = useRouter();

    const handleCancel = async (roomId) => {
        const success = await cancelReservation(roomId);
        if (success) {
            Alert.alert("Éxito", "Reserva cancelada correctamente");
        } else {
            Alert.alert("Error", "No se pudo cancelar la reserva");
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <LinearGradient
                colors={['#4a6cf7', '#2541b2']}
                style={styles.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <Text style={styles.userName}>{currentUser?.name || 'Usuario'}</Text>
                <Text style={styles.userEmail}>{currentUser?.email || 'email@ejemplo.com'}</Text>
            </LinearGradient>

            <View style={styles.content}>
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <MaterialIcons name="person" size={24} color="#4a6cf7" />
                        <Text style={styles.cardTitle}>Información Personal</Text>
                    </View>
                    
                    <View style={styles.infoItem}>
                        <FontAwesome name="user-circle-o" size={18} color="#666" />
                        <Text style={styles.infoText}>Nombre: {currentUser?.name || 'No disponible'}</Text>
                    </View>
                    
                    <View style={styles.infoItem}>
                        <MaterialIcons name="email" size={18} color="#666" />
                        <Text style={styles.infoText}>Email: {currentUser?.email || 'No disponible'}</Text>
                    </View>
                    
                    <View style={styles.infoItem}>
                        <FontAwesome name="user-secret" size={18} color="#666" />
                        <Text style={styles.infoText}>Tipo: {currentUser?.role === 'admin' ? 'Administrador' : 'Cliente'}</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="ios-calendar" size={24} color="#4a6cf7" />
                        <Text style={styles.cardTitle}>Tus Reservas</Text>
                    </View>
                    
                    {reservations.length > 0 ? (
                        reservations.map((reservation) => (
                            <View key={`${reservation.roomId}-${reservation.date}`} style={styles.reservationItem}>
                                <View style={styles.infoItem}>
                                    <MaterialIcons name="meeting-room" size={18} color="#666" />
                                    <Text style={styles.infoText}>Habitación: {reservation.roomName}</Text>
                                </View>
                                
                                <View style={styles.infoItem}>
                                    <MaterialIcons name="date-range" size={18} color="#666" />
                                    <Text style={styles.infoText}>
                                        Entrada: {new Date(reservation.checkInDate).toLocaleDateString()}
                                    </Text>
                                </View>
                                
                                <View style={styles.infoItem}>
                                    <MaterialIcons name="date-range" size={18} color="#666" />
                                    <Text style={styles.infoText}>
                                        Salida: {new Date(reservation.checkOutDate).toLocaleDateString()}
                                    </Text>
                                </View>
                                
                                <View style={styles.infoItem}>
                                    <MaterialIcons name="nights-stay" size={18} color="#666" />
                                    <Text style={styles.infoText}>
                                        Duración: {reservation.daysStaying} día{reservation.daysStaying !== 1 ? 's' : ''}
                                    </Text>
                                </View>

                                <View style={styles.infoItem}>
                                    <MaterialIcons name="attach-money" size={18} color="#666" />
                                    <Text style={styles.infoText}>
                                        Total: ${
                                        reservation.totalPrice ??
                                        (reservation.roomPrice * reservation.daysStaying) ??
                                        "No disponible"
                                        }
                                    </Text>
                                </View>

                                <TouchableOpacity 
                                    style={styles.cancelButton}
                                    onPress={() => handleCancel(reservation.id)} // ¡Usa reservation.id!
                                >
                                    <Text style={styles.cancelButtonText}>Cancelar Reserva</Text>
                                </TouchableOpacity>
                            </View>
                            
                        ))
                    ) : (
                        <View style={styles.noReservation}>
                            <Ionicons name="ios-sad-outline" size={24} color="#999" />
                            <Text style={styles.noReservationText}>No tienes reservaciones activas</Text>
                        </View>
                    )}
                </View>

                <TouchableOpacity 
                    style={[styles.actionButton, styles.logoutButton]} 
                    onPress={async () => {
                        const success = await handleLogout();
                        if (success) {
                            router.push('/(login)');
                        } else {
                            Alert.alert("Error", "No se pudo cerrar sesión");
                        }
                    }}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Ionicons name="log-out-outline" size={20} color="#fff" />
                            <Text style={styles.actionButtonText}>Cerrar sesión</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logoutButton: {
        backgroundColor: '#e74c3c',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        marginTop: 20,
    },
    container: {
        flexGrow: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        paddingTop: 60,
        paddingBottom: 30,
        alignItems: 'center',
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    userName: {
        fontSize: 24,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 5,
    },
    userEmail: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
    },
    content: {
        padding: 20,
        paddingTop: 30,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 10,
        color: '#333',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    infoText: {
        fontSize: 16,
        marginLeft: 10,
        color: '#555',
    },
    noReservation: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
    },
    noReservationText: {
        fontSize: 16,
        color: '#999',
        marginLeft: 10,
    },
    actionButton: {
        backgroundColor: '#4a6cf7',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: '#4a6cf7',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    reservationItem: {
        marginBottom: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    cancelButton: {
        backgroundColor: '#ff6b6b',
        padding: 10,
        borderRadius: 6,
        marginTop: 10,
        alignSelf: 'flex-start',
        minWidth: 120,
        alignItems: 'center'
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    totalPrice: {
        fontSize: 16,
        fontWeight: '600',
        color: '#27ae60',
        marginLeft: 10,
    }
});