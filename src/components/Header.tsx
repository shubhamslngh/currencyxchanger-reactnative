
import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';

const Header = () => {
    return (
        <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Currency Converter</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        width: '100%',
        height: 60, // You can adjust the height as needed
        backgroundColor: '#4A90E2', // Choose a background color that fits your app
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: StatusBar.currentHeight, // This adds padding to accommodate the status bar height
    },
    headerText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    }
});

export default Header;
