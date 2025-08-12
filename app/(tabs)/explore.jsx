import { Rooms } from '@/data/Rooms';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Modal,
    PanResponder,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useReservations } from '../context/ReservationContext';

export default function ExploreScreen () {
    // Estados inicializados correctamente
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [localLoading, setLocalLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFeatures, setSelectedFeatures] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [priceRange, setPriceRange] = useState([0, 150]);
    
    // Contexto con verificación de existencia
    const reservationContext = useReservations();
    if (!reservationContext) {
        throw new Error('useReservations debe usarse dentro de un ReservationProvider');
    }
    const { currentUser, addReservation, isLoading } = reservationContext;

    const sliderWidth = useRef(300).current;
    const thumbSize = 24;

    // Efecto para manejar el foco
    useFocusEffect(() => {
        setLocalLoading(false);
        return () => {
            // Limpieza si es necesaria
            setLocalLoading(true);
        };
    });

    // Controladores de precio
    const handleMinPriceChange = (value) => {
        const newMin = Math.min(value, priceRange[1] - 20);
        setPriceRange([newMin, priceRange[1]]);
    };
    
    const handleMaxPriceChange = (value) => {
        const newMax = Math.max(value, priceRange[0] + 20);
        setPriceRange([priceRange[0], newMax]);
    };

    // PanResponders para el slider manual
    const minThumbPanResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (evt, gestureState) => {
            const newPosition = Math.max(0, Math.min(gestureState.moveX, (priceRange[1]/300) * sliderWidth));
            const newValue = Math.round((newPosition / sliderWidth) * 300);
            handleMinPriceChange(newValue);
        }
    });

    const maxThumbPanResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (evt, gestureState) => {
            const newPosition = Math.max((priceRange[0]/300) * sliderWidth, Math.min(gestureState.moveX, sliderWidth));
            const newValue = Math.round((newPosition / sliderWidth) * 300);
            handleMaxPriceChange(newValue);
        }
    });

    // Características disponibles
    const availableFeatures = [...new Set(Rooms.flatMap(room => room.features))];

    // Función de reserva
    const handleReservation = async () => {
        if (!currentUser?.email) {
            Alert.alert("Error", "Debes iniciar sesión para reservar.");
            return;
        }

        try {
            const success = await addReservation({
                roomId: selectedRoom._id,
                userId: currentUser.email,
                roomName: selectedRoom.name,
                date: new Date().toISOString()
            });

            if (success) {
                setModalVisible(false);
                Alert.alert("¡Éxito!", `Reserva confirmada para ${selectedRoom.name}`);
            }
        } catch (error) {
            Alert.alert("Error", "Ocurrió un problema al procesar tu reserva");
        }
    };

    // Alternar características
    const toggleFeature = (feature) => {
        setSelectedFeatures(prev => 
            prev.includes(feature) 
                ? prev.filter(f => f !== feature) 
                : [...prev, feature]
        );
    };

    // Filtrar habitaciones
    const filteredRooms = Rooms.filter(room => {
        const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             room.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice = room.price >= priceRange[0] && room.price <= priceRange[1];
        const matchesFeatures = selectedFeatures.length === 0 || 
                               selectedFeatures.every(feature => room.features.includes(feature));
        
        return matchesSearch && matchesPrice && matchesFeatures;
    });

    // Renderizar item de habitación
    const renderRoomItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.roomCard} 
            onPress={() => {
                setSelectedRoom(item);
                setModalVisible(true);
            }}
            disabled={isLoading}
        >
            <Image 
                source={typeof item.images[0] === 'string' ? { uri: item.images[0] } : item.images[0]} 
                style={styles.roomImage} 
                onError={() => console.log("Error cargando imagen")}
            />
            <View style={styles.roomInfoContainer}>
                <Text style={styles.roomName}>{item.name}</Text>
                <Text style={styles.roomPrice}>${item.price}/noche</Text>
                <Text style={styles.roomDescription} numberOfLines={2}>{item.description}</Text>
                
                <View style={styles.featuresContainer}>
                    {item.features.slice(0, 3).map((feature, index) => (
                        <View key={`feature-${index}`} style={styles.featurePill}>
                            <Text style={styles.featureText}>{feature}</Text>
                        </View>
                    ))}
                    {item.features.length > 3 && (
                        <View style={styles.featurePill}>
                            <Text style={styles.featureText}>+{item.features.length - 3}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    // Mostrar loading si es necesario
    if (localLoading || (isLoading && !currentUser)) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Header con buscador */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Explora nuestras habitaciones</Text>
                    
                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Buscar habitaciones..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholderTextColor="#888"
                        />
                        <TouchableOpacity 
                            style={styles.filterButton}
                            onPress={() => setShowFilters(!showFilters)}
                        >
                            <Feather name="filter" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Filtros desplegables */}
                {showFilters && (
                    <View style={styles.filtersContainer}>
                        <Text style={styles.filterTitle}>Rango de precios (${priceRange[0]} - ${priceRange[1]})</Text>
                        
                        <View style={styles.sliderContainer}>
                            <View style={styles.sliderTrack}>
                                <View style={[styles.sliderProgress, {
                                    left: `${(priceRange[0] / 300) * 100}%`,
                                    right: `${100 - (priceRange[1] / 300) * 100}%`
                                }]} />
                                
                                <View 
                                    style={[styles.sliderThumb, { 
                                        left: `${(priceRange[0] / 300) * 100}%`,
                                        transform: [{ translateX: -thumbSize/2 }]
                                    }]}
                                    {...minThumbPanResponder.panHandlers}
                                />
                                
                                <View 
                                    style={[styles.sliderThumb, { 
                                        left: `${(priceRange[1] / 300) * 100}%`,
                                        transform: [{ translateX: -thumbSize/2 }]
                                    }]}
                                    {...maxThumbPanResponder.panHandlers}
                                />
                            </View>
                            <View style={styles.priceLabels}>
                                <Text style={styles.priceText}>$0</Text>
                                <Text style={styles.priceText}>$300</Text>
                            </View>
                        </View>

                        <Text style={styles.filterTitle}>Características</Text>
                        <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.featuresFilterContainer}
                        >
                            {availableFeatures.map((feature, index) => (
                                <TouchableOpacity
                                    key={`filter-${index}`}
                                    style={[
                                        styles.featureFilterPill,
                                        selectedFeatures.includes(feature) && styles.selectedFeaturePill
                                    ]}
                                    onPress={() => toggleFeature(feature)}
                                >
                                    <Text style={[
                                        styles.featureFilterText,
                                        selectedFeatures.includes(feature) && styles.selectedFeatureText
                                    ]}>
                                        {feature}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Lista de habitaciones */}
                <FlatList
                    data={filteredRooms}
                    renderItem={renderRoomItem}
                    keyExtractor={(item) => item._id.toString()}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Feather name="search" size={48} color="#ccc" />
                            <Text style={styles.emptyText}>No se encontraron habitaciones</Text>
                            <Text style={styles.emptySubtext}>Prueba ajustando tus filtros de búsqueda</Text>
                        </View>
                    }
                />

                {/* Modal de reserva */}
                <Modal visible={modalVisible} animationType="slide" transparent>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Image 
                                source={typeof selectedRoom?.images[0] === 'string' ? 
                                    { uri: selectedRoom?.images[0] } : 
                                    selectedRoom?.images[0]
                                } 
                                style={styles.modalImage} 
                            />
                            
                            <Text style={styles.modalTitle}>{selectedRoom?.name}</Text>
                            <Text style={styles.modalPrice}>${selectedRoom?.price}/noche</Text>
                            
                            <ScrollView style={styles.modalFeaturesContainer}>
                                {selectedRoom?.features.map((feature, index) => (
                                    <View key={`modal-feature-${index}`} style={styles.modalFeatureItem}>
                                        <Ionicons name="checkmark-circle" size={18} color="#2ecc71" />
                                        <Text style={styles.modalFeatureText}>{feature}</Text>
                                    </View>
                                ))}
                            </ScrollView>
                            
                            <Text style={styles.modalDescription}>{selectedRoom?.description}</Text>
                            
                            <View style={styles.modalButtons}>
                                <TouchableOpacity 
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setModalVisible(false)} 
                                >
                                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.modalButton, styles.confirmButton]}
                                    onPress={handleReservation} 
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text style={styles.confirmButtonText}>Reservar ahora</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: { 
        flex: 1, 
        backgroundColor: '#f8f9fa' 
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    header: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eaeaea',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f3f4',
        borderRadius: 24,
        paddingHorizontal: 16,
        height: 48,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: '#333',
    },
    filterButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#3498db',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    filtersContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eaeaea',
    },
    filterTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
        color: '#333',
    },
    sliderContainer: {
        marginBottom: 20,
    },
    sliderTrack: {
        height: 4,
        backgroundColor: '#ecf0f1',
        borderRadius: 2,
        position: 'relative',
        marginVertical: 20,
        width: '100%',
    },
    sliderProgress: {
        position: 'absolute',
        height: '100%',
        backgroundColor: '#3498db',
        borderRadius: 2,
    },
    sliderThumb: {
        position: 'absolute',
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#3498db',
        top: -10,
    },
    priceLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    priceText: {
        fontSize: 14,
        color: '#7f8c8d',
    },
    featuresFilterContainer: {
        paddingBottom: 8,
    },
    featureFilterPill: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
        backgroundColor: '#ecf0f1',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#dfe6e9',
    },
    selectedFeaturePill: {
        backgroundColor: '#3498db',
        borderColor: '#2980b9',
    },
    featureFilterText: {
        fontSize: 14,
        color: '#7f8c8d',
    },
    selectedFeatureText: {
        color: '#fff',
    },
    listContent: {
        padding: 16,
    },
    roomCard: { 
        marginBottom: 20, 
        backgroundColor: '#fff', 
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        overflow: 'hidden',
    },
    roomImage: { 
        width: '100%', 
        height: 200, 
        resizeMode: 'cover',
    },
    roomInfoContainer: {
        padding: 16,
    },
    roomName: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        marginBottom: 4,
        color: '#2c3e50',
    },
    roomPrice: { 
        fontSize: 16, 
        fontWeight: '600',
        color: '#27ae60', 
        marginBottom: 8,
    },
    roomDescription: {
        fontSize: 14,
        color: '#7f8c8d',
        marginBottom: 12,
        lineHeight: 20,
    },
    featuresContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    featurePill: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        backgroundColor: '#e8f4fc',
        marginRight: 8,
        marginBottom: 8,
    },
    featureText: {
        fontSize: 12,
        color: '#3498db',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#95a5a6',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#bdc3c7',
        marginTop: 8,
        textAlign: 'center',
    },
    modalContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(0,0,0,0.5)' 
    },
    modalContent: { 
        backgroundColor: 'white', 
        borderRadius: 16, 
        width: '90%',
        maxHeight: '80%',
        overflow: 'hidden',
    },
    modalImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        margin: 16,
        marginBottom: 8,
        color: '#2c3e50',
    },
    modalPrice: {
        fontSize: 18,
        fontWeight: '600',
        color: '#27ae60',
        marginHorizontal: 16,
        marginBottom: 16,
    },
    modalFeaturesContainer: {
        maxHeight: 120,
        marginHorizontal: 16,
        marginBottom: 16,
    },
    modalFeatureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    modalFeatureText: {
        fontSize: 14,
        color: '#34495e',
        marginLeft: 8,
    },
    modalDescription: {
        fontSize: 14,
        color: '#7f8c8d',
        marginHorizontal: 16,
        marginBottom: 20,
        lineHeight: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#ecf0f1',
    },
    modalButton: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#fff',
        borderRightWidth: 1,
        borderRightColor: '#ecf0f1',
    },
    confirmButton: {
        backgroundColor: '#2ecc71',
    },
    cancelButtonText: {
        color: '#e74c3c',
        fontWeight: '600',
    },
    confirmButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
});