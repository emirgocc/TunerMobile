import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const BpmInputModal = ({ visible, tempBpm, onTempBpmChange, onConfirm, onCancel }) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      {/* Arka plan */}
      <View style={styles.background} />
      
      {/* Modal container */}
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>BPM Ayarı</Text>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onCancel}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={20} color="#bfc2c7" />
          </TouchableOpacity>
        </View>

        {/* Input Section */}
        <View style={styles.inputSection}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.bpmInput}
              value={tempBpm}
              onChangeText={onTempBpmChange}
              keyboardType="numeric"
              maxLength={3}
              autoFocus
              placeholder="120"
              placeholderTextColor="rgba(191,194,199,0.5)"
              selectTextOnFocus
              onSubmitEditing={onConfirm}
              returnKeyType="done"
            />
          </View>
          <Text style={styles.inputLabel}>BPM</Text>
        </View>

        {/* Range indicator */}
        <View style={styles.rangeContainer}>
          <Text style={styles.rangeText}>20 - 300 BPM</Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={onCancel}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>İptal</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.confirmButton}
            onPress={onConfirm}
            activeOpacity={0.7}
          >
            <Text style={styles.confirmButtonText}>Tamam</Text>
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
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContainer: {
    width: SCREEN_WIDTH * 0.75,
    maxWidth: 320,
    backgroundColor: '#2c3136',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EA506F',
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : undefined,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  inputContainer: {
    width: 120,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  bpmInput: {
    width: '100%',
    height: '100%',
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: Platform.OS === 'android' ? 'Roboto' : undefined,
    letterSpacing: 1,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  inputLabel: {
    fontSize: 14,
    color: '#bfc2c7',
    marginTop: 8,
    fontWeight: '500',
    letterSpacing: 0.3,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : undefined,
  },
  rangeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  rangeText: {
    fontSize: 12,
    color: '#bfc2c7',
    opacity: 0.6,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : undefined,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.02)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  confirmButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    backgroundColor: 'rgba(234,80,111,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(234,80,111,0.2)',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#bfc2c7',
    letterSpacing: 0.3,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : undefined,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EA506F',
    letterSpacing: 0.3,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : undefined,
  },
});

export default BpmInputModal;