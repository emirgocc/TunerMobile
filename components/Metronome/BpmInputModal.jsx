import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const BpmInputModal = ({ visible, tempBpm, onTempBpmChange, onConfirm, onCancel }) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>BPM Değeri Girin</Text>
        <TextInput
          style={styles.bpmInput}
          value={tempBpm}
          onChangeText={onTempBpmChange}
          keyboardType="numeric"
          maxLength={3}
          autoFocus
          placeholder="100"
          placeholderTextColor="#666"
          selectTextOnFocus
          onSubmitEditing={onConfirm}
          returnKeyType="done"
        />
        <View style={styles.modalButtons}>
          <View style={styles.shadowWrap}>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['#23262B', '#282B30']}
                start={{ x: 0.2, y: 0 }}
                end={{ x: 0.8, y: 1 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.cancelButtonText}>İptal</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          
          <View style={styles.shadowWrap}>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={onConfirm}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['#EA506F', '#8b3042']}
                start={{ x: 0.2, y: 0 }}
                end={{ x: 0.8, y: 1 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.confirmButtonText}>Tamam</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
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
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    elevation: 9999,
  },
  modalContent: {
    backgroundColor: '#2c3136',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    minWidth: 280,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : undefined,
  },
  bpmInput: {
    width: 120,
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.03)',
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : undefined,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  shadowWrap: {
    borderRadius: 100,
    shadowColor: '#16191b',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  modalButton: {
    borderRadius: 100,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 100,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#bfc2c7',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: Platform.OS === 'android' ? 'Roboto' : undefined,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'android' ? 'Roboto' : undefined,
  },
});

export default BpmInputModal;
