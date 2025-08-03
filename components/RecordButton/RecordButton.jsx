import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

function RecordButton({ onPress, pressed }) {
  // Gradient renkleri
  const gradientColors = pressed
    ? ['#EA506F', '#8b3042']
    : ['#23262B', '#282B30'];
  const innerGradientColors = pressed
    ? ['#8b3042', '#EA506F']
    : ['#282B30', '#23262B'];

  return (
    <View style={styles.shadowWrap}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={styles.buttonBase}
      >
        <TouchableOpacity
          style={styles.touchable}
          onPress={onPress}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={innerGradientColors}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            style={[styles.innerBase, pressed ? styles.innerPressed : styles.innerIdle]}
          >
            <Ionicons name="musical-notes" size={28} style={styles.icon} />
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrap: {
    borderRadius: 100,
    shadowColor: '#16191b',
    shadowOffset: { width: 4, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
    marginTop: 24,
    marginBottom: 8,
  },
  buttonBase: {
    borderRadius: 100,
    width: 104,
    height: 104,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchable: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerBase: {
    width: 88,
    height: 88,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  innerPressed: {
    backgroundColor: 'rgba(234,80,111,0.95)',
  },
  innerIdle: {
    backgroundColor: 'rgba(40,43,48,0.95)',
  },
  icon: {
    color: '#fff',
    opacity: 0.95,
  },
});

export default RecordButton; 