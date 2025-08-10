import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Modal, TextInput, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';

const Metronome = ({ bpm = 100, onBpmChange, isPlaying = false, onPlayToggle }) => {
  const [showBpmInput, setShowBpmInput] = useState(false);
  const [tempBpm, setTempBpm] = useState(bpm.toString());
  const soundRef = useRef(null);
  const intervalRef = useRef(null);
  const holdIntervalRef = useRef(null);
  const bpmRef = useRef(bpm);

  const pendulumAngle = useSharedValue(0);

  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);

  useEffect(() => {
    const loadSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(require('./tick.mp3'));
        soundRef.current = sound;
        await soundRef.current.setVolumeAsync(0.8);
      } catch (e) {
        console.warn('Failed to load sound, falling back to silent:', e);
      }
    };
    loadSound();

    return () => {
      stopMetronome();
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
      }
      if (holdIntervalRef.current) {
        clearInterval(holdIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isPlaying) startMetronome();
    else stopMetronome();

    return () => stopMetronome();
  }, [isPlaying, bpm]);

  const startMetronome = () => {
    stopMetronome();
    const interval = (60 / bpmRef.current) * 1000;

    // Symmetrical animation to prevent stuttering
    pendulumAngle.value = withRepeat(
      withSequence(
        withTiming(45, { duration: interval / 2, easing: Easing.inOut(Easing.ease) }),
        withTiming(-45, { duration: interval, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: interval / 2, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    intervalRef.current = setInterval(playTick, interval);
  };

  const stopMetronome = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    pendulumAngle.value = withTiming(0, { duration: 200 });
  };

  const playTick = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.replayAsync();
      }
    } catch (error) {
      console.warn('Playback error:', error);
    }
  };

  const pendulumAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${pendulumAngle.value}deg` }],
  }));

  const clampBpm = (v) => Math.max(20, Math.min(300, v));

  const changeBpm = useCallback((newBpm) => {
    const clamped = clampBpm(Math.round(newBpm));
    bpmRef.current = clamped;
    onBpmChange(clamped);
  }, [onBpmChange]);

  const handlePlusPress = () => changeBpm(bpmRef.current + 1);
  const handleMinusPress = () => changeBpm(bpmRef.current - 1);

  const startHoldIncrement = (dir = 1) => {
    stopHold();
    changeBpm(bpmRef.current + dir);
    holdIntervalRef.current = setInterval(() => {
      changeBpm(bpmRef.current + dir);
    }, 120);
  };
  const stopHold = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  };

  const handleBpmTap = () => {
    setTempBpm(String(bpmRef.current));
    setShowBpmInput(true);
  };

  const handleBpmInputConfirm = () => {
    const newBpm = parseInt(tempBpm, 10);
    if (isNaN(newBpm) || newBpm < 20 || newBpm > 300) {
      Alert.alert('Geçersiz BPM', 'BPM değeri 20-300 arasında olmalıdır.');
      return;
    }
    changeBpm(newBpm);
    setShowBpmInput(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.pendulumContainer}>
        <Animated.View style={[styles.pendulum, pendulumAnimatedStyle]} />
        <View style={styles.pivot} />
      </View>

      <TouchableOpacity style={styles.bpmDisplay} onPress={handleBpmTap} activeOpacity={0.8}>
        <Text style={styles.bpmValue}>{bpmRef.current}</Text>
        <Text style={styles.bpmLabel}>BPM</Text>
      </TouchableOpacity>

      <View style={styles.controlsContainer}>
        <View style={styles.shadowWrap}>
          <TouchableOpacity
            onPress={handleMinusPress}
            onLongPress={() => startHoldIncrement(-1)}
            onPressOut={stopHold}
            activeOpacity={0.7}
            style={styles.controlButton}
          >
            <Text style={styles.controlButtonText}>-</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.shadowWrap}>
          <LinearGradient
            colors={isPlaying ? ['#EA506F', '#8b3042'] : ['#23262B', '#282B30']}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            style={styles.playButtonBase}
          >
            <TouchableOpacity
              style={styles.touchable}
              onPress={onPlayToggle}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={isPlaying ? ['#8b3042', '#EA506F'] : ['#282B30', '#23262B']}
                start={{ x: 0.2, y: 0 }}
                end={{ x: 0.8, y: 1 }}
                style={styles.playButtonInner}
              >
                <Text style={styles.playButtonText}>{isPlaying ? '■' : '▶'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View style={styles.shadowWrap}>
          <TouchableOpacity
            onPress={handlePlusPress}
            onLongPress={() => startHoldIncrement(1)}
            onPressOut={stopHold}
            activeOpacity={0.7}
            style={styles.controlButton}
          >
            <Text style={styles.controlButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={showBpmInput} transparent animationType="fade" onRequestClose={() => setShowBpmInput(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>BPM Değeri Girin</Text>
            <TextInput
              style={styles.bpmInput}
              value={tempBpm}
              onChangeText={setTempBpm}
              keyboardType="numeric"
              maxLength={3}
              autoFocus
              placeholder="100"
              placeholderTextColor="#666"
              selectTextOnFocus
              onSubmitEditing={handleBpmInputConfirm}
              returnKeyType="done"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowBpmInput(false)}>
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={handleBpmInputConfirm}>
                <Text style={styles.confirmButtonText}>Tamam</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  pendulumContainer: {
    height: 160, // Adjusted height
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end', // Anchor pendulum at the bottom of container
    marginBottom: 30, // Space between pendulum and BPM display
  },
  pivot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#bfc2c7',
    position: 'absolute',
    top: 0, // Position pivot at the top of the animation anchor
    zIndex: 2,
  },
  pendulum: {
    width: 4,
    height: 120, // Adjusted height
    backgroundColor: '#EA506F',
    borderRadius: 2,
    transformOrigin: 'top center', // Rotate from the top
    position: 'absolute',
    top: 6, // Start below the pivot
  },
  bpmDisplay: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 15,
    backgroundColor: 'rgba(40,43,48,0.95)',
    minWidth: 150,
    marginBottom: 30, // Space between BPM display and controls
  },
  bpmValue: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: Platform.OS === 'android' ? 'Roboto' : undefined,
    letterSpacing: 1,
  },
  bpmLabel: {
    fontSize: 16,
    color: '#bbb',
    marginTop: 4,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : undefined,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '80%', // Control width
  },
  shadowWrap: {
    borderRadius: 100,
    shadowColor: '#16191b',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#282B30',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  controlButtonText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#bfc2c7',
    lineHeight: 32,
  },
  playButtonBase: {
    borderRadius: 100,
    width: 80,
    height: 80,
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
  playButtonInner: {
    width: 68,
    height: 68,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2c3136',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    minWidth: 280,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
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
  },
  modalButtons: {
    flexDirection: 'row',
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    minWidth: 80,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  confirmButton: {
    backgroundColor: 'rgba(234,80,111,0.3)',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  confirmButtonText: {
    color: '#EA506F',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Metronome;
