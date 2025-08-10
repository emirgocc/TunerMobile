import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const BpmInputModal = ({ visible, tempBpm, onTempBpmChange, onConfirm, onCancel }) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.6)']}
        style={styles.gradient}
      />
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>BPM Değeri Girin</Text>
        
        <TextInput
          style={styles.bpmInput}
          value={tempBpm}
          onChangeText={onTempBpmChange}
          keyboardType="numeric"
          maxLength={3}
          autoFocus
          placeholder="120"
          placeholderTextColor="#888"
          selectTextOnFocus
          onSubmitEditing={onConfirm}
          returnKeyType="done"
        />
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={onCancel}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['#484F58', '#3A4047']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>İptal</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={onConfirm}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['#EA506F', '#D32F2F']}
              style={styles.buttonGradient}
            >
              <Text style={[styles.buttonText, styles.confirmButtonText]}>Tamam</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    elevation: 9999,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: '#2C3136',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    width: '80%',
    maxWidth: 320,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
  },
  bpmInput: {
    width: '90%',
    height: 70,
    backgroundColor: '#22252A',
    borderRadius: 15,
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E0E0E0',
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
  },
  confirmButtonText: {
    color: '#FFF',
  },
});

export default BpmInputModal;