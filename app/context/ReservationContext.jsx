// app/context/ReservationContext.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

const ReservationContext = createContext();

export const ReservationProvider = ({ children }) => {
    const [reservations, setReservations] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const setUser = async (userData) => {
        try {
            await AsyncStorage.setItem('@HotelApp:userData', JSON.stringify(userData));
            setCurrentUser(userData);
            await loadReservations(userData.email);
        } catch (error) {
            console.error("Error setting user:", error);
        }
    };

    const loadData = async () => {
        try {
            setIsLoading(true);
            const userString = await AsyncStorage.getItem('@HotelApp:userData');
            if (userString) {
                const user = JSON.parse(userString);
                setCurrentUser(user);
                await loadReservations(user.email);
            }
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadReservations = async (userId) => {
        try {
            const resString = await AsyncStorage.getItem('@HotelApp:reservations');
            if (resString) {
                const allReservations = JSON.parse(resString);
                setReservations(allReservations.filter(res => res.userId === userId));
            }
        } catch (error) {
            console.error("Error loading reservations:", error);
        }
    };

    const addReservation = async (newReservation) => {
        try {
            const updatedReservations = [...reservations, newReservation];
            setReservations(updatedReservations);
            
            const allReservationsString = await AsyncStorage.getItem('@HotelApp:reservations');
            let allReservations = allReservationsString ? JSON.parse(allReservationsString) : [];
            allReservations.push(newReservation);
            await AsyncStorage.setItem('@HotelApp:reservations', JSON.stringify(allReservations));
            
            return true;
        } catch (error) {
            console.error("Error adding reservation:", error);
            return false;
        }
    };

    const cancelReservation = async (roomId) => {
        try {
            const updated = reservations.filter(res => res.roomId !== roomId);
            setReservations(updated);
            
            const allReservationsString = await AsyncStorage.getItem('@HotelApp:reservations');
            if (allReservationsString) {
                const allReservations = JSON.parse(allReservationsString);
                const updatedAll = allReservations.filter(res => 
                    !(res.userId === currentUser?.email && res.roomId === roomId)
                );
                await AsyncStorage.setItem('@HotelApp:reservations', JSON.stringify(updatedAll));
            }
            
            return true;
        } catch (error) {
            console.error("Error canceling reservation:", error);
            return false;
        }
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.multiRemove([
                '@HotelApp:authToken',
                '@HotelApp:userData'
            ]);
            setCurrentUser(null);
            setReservations([]);
            return true;
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            return false;
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <ReservationContext.Provider
            value={{
                reservations,
                currentUser,
                isLoading,
                setUser,
                addReservation,
                cancelReservation,
                handleLogout,
                refreshReservations: loadData
            }}
        >
            {children}
        </ReservationContext.Provider>
    );
};

export const useReservations = () => {
    const context = useContext(ReservationContext);
    if (!context) {
        throw new Error('useReservations debe usarse dentro de un ReservationProvider');
    }
    return context;
};