import React, { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

/**
 * BPM Finder komponenti - Tap to BPM işlevselliği
 * @param {boolean} isActive - BPM Finder aktif mi
 * @param {function} onTap - Tap yapıldığında çağrılan fonksiyon
 * @param {function} onSendToMetronome - BPM değerini metronome'a gönderme fonksiyonu
 */
const BpmFinder = ({ isActive, onTap, onSendToMetronome }) => {
  const [bpm, setBpm] = useState(0);
  const [tapCount, setTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [tapTimes, setTapTimes] = useState([]);
  const [isPressed, setIsPressed] = useState(false);
  const timeoutRef = useRef(null);

  const handleTap = useCallback(() => {
    // Pressed animasyonu
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
    
    const currentTime = Date.now();
    
    // İlk tap
    if (tapCount === 0) {
      setTapCount(1);
      setLastTapTime(currentTime);
      setTapTimes([currentTime]);
      console.log('İlk tap yapıldı');
      return;
    }

    // Sonraki tap'lar
    const newTapCount = tapCount + 1;
    const newTapTimes = [...tapTimes, currentTime];
    
    setTapCount(newTapCount);
    setLastTapTime(currentTime);
    setTapTimes(newTapTimes);

    console.log(`Tap sayısı: ${newTapCount}`);

    // BPM hesapla (en az 2 tap gerekli)
    if (newTapCount >= 2) {
      const intervals = [];
      for (let i = 1; i < newTapTimes.length; i++) {
        intervals.push(newTapTimes[i] - newTapTimes[i - 1]);
      }
      
      const averageInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / averageInterval);
      
      console.log(`Hesaplanan BPM: ${calculatedBpm}`);
      setBpm(calculatedBpm);
    }

    // Timeout'u sıfırla
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // 30 saniye sonra sıfırla (çok uzun süre)
    timeoutRef.current = setTimeout(() => {
      console.log('Timeout: BPM sıfırlanıyor');
      setBpm(0);
      setTapCount(0);
      setTapTimes([]);
    }, 30000);
  }, [tapCount, tapTimes]);

  const handleReset = useCallback(() => {
    console.log('Manuel sıfırlama');
    setBpm(0);
    setTapCount(0);
    setTapTimes([]);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const handleSendToMetronome = useCallback(() => {
    if (bpm > 0 && onSendToMetronome) {
      console.log(`Metronome'a gönderiliyor: ${bpm} BPM`);
      onSendToMetronome(bpm);
    }
  }, [bpm, onSendToMetronome]);

  if (!isActive) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* BPM Display - Tuner tarzında */}
      <View style={styles.bpmDisplay}>
        <Text style={styles.bpmValue}>
          {bpm > 0 ? bpm : '--'}
        </Text>
        <Text style={styles.bpmLabel}>BPM</Text>
      </View>

      {/* Tap ve Reset Buttons */}
      <View style={styles.buttonRow}>
        {/* Reset Button */}
        <View style={styles.shadowWrap}>
          <LinearGradient
            colors={['#23262B', '#282B30']}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            style={styles.resetButtonBase}
          >
            <TouchableOpacity
              style={styles.touchable}
              onPress={handleReset}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['#282B30', '#23262B']}
                start={{ x: 0.2, y: 0 }}
                end={{ x: 0.8, y: 1 }}
                style={styles.resetButtonInner}
              >
                <Ionicons name="refresh" size={20} color="#bfc2c7" />
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Tap Button - Record button tarzında */}
        <View style={styles.shadowWrap}>
          <LinearGradient
            colors={isPressed ? ['#EA506F', '#8b3042'] : ['#23262B', '#282B30']}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            style={styles.buttonBase}
          >
            <TouchableOpacity
              style={styles.touchable}
              onPress={handleTap}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={isPressed ? ['#8b3042', '#EA506F'] : ['#282B30', '#23262B']}
                start={{ x: 0.2, y: 0 }}
                end={{ x: 0.8, y: 1 }}
                style={[styles.innerBase, isPressed ? styles.innerPressed : styles.innerIdle]}
              >
                <Text style={styles.tapText}>TAP</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>

      {/* Send to Metronome Button */}
      <TouchableOpacity 
        style={[styles.sendButtonWrapper, bpm === 0 && styles.sendButtonDisabled]}
        onPress={handleSendToMetronome}
        activeOpacity={0.7}
        disabled={bpm === 0}
      >
        <View style={[styles.sendButtonGradient, bpm === 0 && styles.sendButtonGradientDisabled]}>
          <Text style={[styles.sendButtonText, bpm === 0 && styles.sendButtonTextDisabled]}>
            Metronome'a Yolla
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  bpmDisplay: {
    alignItems: 'center',
  },
  bpmValue: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 12,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : undefined,
  },
  bpmLabel: {
    fontSize: 20,
    color: '#888',
    marginBottom: 8,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : undefined,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 24,
    marginBottom: 8,
  },
  shadowWrap: {
    borderRadius: 100,
    shadowColor: '#16191b',
    shadowOffset: { width: 4, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  resetButtonBase: {
    borderRadius: 100,
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
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
  tapText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    opacity: 0.95,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : undefined,
  },
  sendButtonWrapper: {
    marginTop: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(234,80,111,0.2)',
  },
  sendButtonDisabled: {
    borderColor: 'rgba(255,255,255,0.05)',
  },
  sendButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(234,80,111,0.1)',
  },
  sendButtonGradientDisabled: {
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EA506F',
    letterSpacing: 0.3,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : undefined,
  },
  sendButtonTextDisabled: {
    color: '#bfc2c7',
    opacity: 0.5,
  },
});

export default BpmFinder; 