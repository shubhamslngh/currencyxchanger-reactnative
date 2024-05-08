import 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/theme';
import ApplicationNavigator from './navigators/Application';
import './translations';
import React, { useState, useEffect } from 'react';
import { Button,View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { MMKV } from 'react-native-mmkv'
const storage = new MMKV();

const CurrencyConverter = () => {
      const [baseCurrency, setBaseCurrency] = useState(() => storage.getString('baseCurrency') || 'USD');
    const [targetCurrency, setTargetCurrency] = useState(() => storage.getString('targetCurrency') || 'EUR');
    const [amount, setAmount] = useState(() => storage.getString('amount') || "1");
    const [convertedAmount, setConvertedAmount] = useState("0");

    const [rates, setRates] = useState({});
    const popularCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD'];
const swapCurrencies = () => {
    setBaseCurrency(prevCurrency => {
        setTargetCurrency(baseCurrency);
		setBaseCurrency(targetCurrency);
        return prevCurrency;
    });
};
const clearInputs = () => {
    setAmount("1");
    setConvertedAmount("0");
};
 useEffect(() => {
        storage.set('baseCurrency', baseCurrency);
        storage.set('targetCurrency', targetCurrency);
        storage.set('amount', amount);
    }, [baseCurrency, targetCurrency, amount]);

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const response = await axios.get(`https://v6.exchangerate-api.com/v6/96bba7a8b4cbaa0d7cd82495/latest/${baseCurrency}`);
                setRates(response.data.conversion_rates);
                convertCurrency(response.data.conversion_rates);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };
        fetchRates();
    }, [baseCurrency]);

    useEffect(() => {
        convertCurrency(rates);
    }, [targetCurrency, amount]);

    const convertCurrency = (currentRates) => {
        const rate = currentRates[targetCurrency];
        if (rate) {
            const result = (parseFloat(amount) * rate).toFixed(2);
            setConvertedAmount(result);
        } else {
            setConvertedAmount('Error in conversion');
        }
    };

    return (
        <ScrollView style={styles.container}>
			   <Text style={styles.header}>Currency Converter</Text>
           <View style={styles.innerContainer}>
    <Picker
        style={styles.picker}
        selectedValue={baseCurrency}
        onValueChange={setBaseCurrency}
    >
        {popularCurrencies.map(currency => (
            <Picker.Item key={currency} label={currency} value={currency} />
        ))}
    </Picker>
    <TextInput
        style={styles.input}
        onChangeText={value => {
            if (/^\d*\.?\d*$/.test(value)) {
                setAmount(value);
            }
        }}
        value={amount}
        keyboardType="numeric"
        placeholder="Enter amount"
    />
    <Picker
        style={styles.picker}
        selectedValue={targetCurrency}
        onValueChange={setTargetCurrency}
    >
        {popularCurrencies.map(currency => (
            <Picker.Item key={currency} label={currency} value={currency} />
        ))}
    </Picker>
    <Button title="Swap Currencies" onPress={swapCurrencies} color="#4A90E2" />
    <Button title="Clear" onPress={clearInputs} color="#4A90E2" />
    <Text style={styles.resultText}>Converted Amount: {convertedAmount}</Text>
</View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 120,
        backgroundColor: 'white'  
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',  
        alignItems: 'center',      
        padding: 10
	    },
		header: {
			fontSize: 20,
			fontWeight: 'bold',
			marginBottom: 10,
        textAlign: 'center'  ,
        backgroundColor: 'green',
		padding:20 


			
		},
    input: {
        width: '90%',              // Slightly less than full width for padding
        height: 40,
        marginVertical: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,          // Rounded corners for better aesthetics
        borderColor: '#ccc',      // Light grey border
        textAlign: 'center'       // Center text inside input box
    },
    picker: {
        width: '60%',
        height: 100,
        marginBottom: 110,

    },
    button: {
        width: '90%',
        margin: 10,
        backgroundColor: '#4A90E2',  // A pleasant blue background for buttons
        color: '#ffffff',            // White text color
        padding: 10,
        borderRadius: 5
    },
    resultText: {
        fontSize: 16,
        marginTop: 10
    }
});

export default CurrencyConverter;
