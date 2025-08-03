import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, Platform, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  useAnimatedGestureHandler,
  runOnJS,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import Tuner from './components/Tuner/Tuner';
import RecordButton from './components/RecordButton/RecordButton';
import Footer from './components/Footer/Footer';
import InstrumentDrawer from './components/InstrumentDrawer/InstrumentDrawer';
import autoCorrelate from './autocorrelate';
import {
  noteStrings,
  getNoteFromPitchFrequency,
  getPitchFrequencyFromNote,
  centsOffPitch
} from './utils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function App() {
  const [playingNote, setPlayingNote] = useState('');
  const [frequency, setFrequency] = useState(0);
  const [centsOff, setCentsOff] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [prevCentsOff, setPrevCentsOff] = useState(0);
  
  // Çekmece menü için yeni state'ler
  const [selectedInstrument, setSelectedInstrument] = useState('guitar');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const MAX_CENTS_JUMP = 8;
  const recordingRef = useRef(null);
  const isRecordingRef = useRef(false);
  
  // Drawer boyutu - önce tanımla
  const DRAWER_WIDTH = SCREEN_WIDTH * 0.90; // Optimum: %90
  
  // Reanimated değerleri - gesture ve animasyon için
  const drawerOffset = useSharedValue(DRAWER_WIDTH);
  const overlayOpacity = useSharedValue(0);
  
  // analysisIntervalRef kaldırıldı - artık gerekli değil
  
  // Enstrüman isimlerini Türkçe karşılıkları ile eşleştirme
  const instrumentNames = {
    guitar: 'Gitar',
    violin: 'Keman', 
    ukulele: 'Ukulele'
  };

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  // Çekmece menü kontrol fonksiyonları - Yumuşak animasyon
  const openDrawer = useCallback(() => {
    setIsDrawerOpen(true);
    drawerOffset.value = withTiming(0, { duration: 300 });
    overlayOpacity.value = withTiming(1, { duration: 300 });
  }, []);

  const closeDrawer = useCallback(() => {
    drawerOffset.value = withTiming(DRAWER_WIDTH, { duration: 300 });
    overlayOpacity.value = withTiming(0, { duration: 300 }, () => {
      runOnJS(setIsDrawerOpen)(false);
    });
  }, []);

  const toggleDrawer = () => {
    if (isDrawerOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  };

  const handleSelectInstrument = useCallback((instrumentId) => {
    console.log('Seçilen enstrüman:', instrumentId);
    
    // State güncelleme
    setSelectedInstrument(instrumentId);
    closeDrawer();
    // Şu an için sadece UI değişiyor, akort mantığı aynı kalıyor
  }, [closeDrawer]);

  // Gesture handler - sürükleyerek kapatma (basitleştirildi)
  const panGestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      // Gesture başladığında hiçbir şey yapma
    },
    onActive: (event) => {
      // Sadece sağa sürüklemeye izin ver (pozitif translationX)
      if (event.translationX > 0) {
        const newOffset = event.translationX;
        drawerOffset.value = Math.min(newOffset, DRAWER_WIDTH);
        
        // Overlay opacity'yi distance'a göre ayarla
        const progress = 1 - (event.translationX / DRAWER_WIDTH);
        overlayOpacity.value = Math.max(0, progress);
      }
    },
    onEnd: (event) => {
      const shouldClose = event.translationX > DRAWER_WIDTH * 0.3 || event.velocityX > 500;
      
      if (shouldClose) {
        // Drawer'ı kapat
        drawerOffset.value = withTiming(DRAWER_WIDTH, { duration: 300 });
        overlayOpacity.value = withTiming(0, { duration: 300 }, () => {
          runOnJS(setIsDrawerOpen)(false);
        });
      } else {
        // Drawer'ı geri getir
        drawerOffset.value = withTiming(0, { duration: 300 });
        overlayOpacity.value = withTiming(1, { duration: 300 });
      }
    },
  });

  // Animated styles
  const drawerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{
        translateX: drawerOffset.value,
      }],
      backgroundColor: 'rgba(44,49,54,0.95)', // Hafif transparan
      overflow: 'hidden', // Taşan içeriği gizle
    };
  });

  const overlayAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: overlayOpacity.value,
    };
  });

  const requestPermission = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Mikrofon izni gerekli', 'Uygulamanın çalışması için mikrofon izni vermelisiniz.');
        return false;
      }
      return true;
    } catch (error) {
      console.log('Permission error:', error);
      return false;
    }
  };

  const handleRecordToggle = async () => {
    console.log('Button pressed, isRecording:', isRecording);

    if (!isRecording) {
      const hasPermission = await requestPermission();
      if (!hasPermission) return;

      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
          staysActiveInBackground: false,
        });

        setIsRecording(true);
        isRecordingRef.current = true;
        startContinuousRecording(); // await kaldırıldı
        console.log('Continuous recording started');
      } catch (error) {
        console.log('Start recording error:', error);
        Alert.alert('Hata', 'Mikrofon başlatılamadı: ' + error.message);
      }
    } else {
      console.log('Stopping recording');
      stopRecording();
    }
  };

  const startContinuousRecording = async () => {
    try {
      console.log('Starting single continuous recording session');
      const recording = new Audio.Recording();

      await recording.prepareToRecordAsync({
        android: {
          extension: '.wav',
          outputFormat: Audio.AndroidOutputFormat.DEFAULT,
          audioEncoder: Audio.AndroidAudioEncoder.DEFAULT,
          sampleRate: 22050,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: '.wav',
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 22050,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {},
      });

      recordingRef.current = recording;
      await recording.startAsync();
      console.log('Single recording session started');

      // Periyodik analiz başlat
      startPeriodicAnalysis();

    } catch (error) {
      console.log('Recording session error:', error);
      if (isRecordingRef.current) {
        // Hata durumunda tekrar dene
        setTimeout(() => {
          if (isRecordingRef.current) {
            startContinuousRecording();
          }
        }, 2000);
      }
    }
  };

  const startPeriodicAnalysis = () => {
    const analyzeLoop = async () => {
      if (!isRecordingRef.current || !recordingRef.current) return;

      try {
        const status = await recordingRef.current.getStatusAsync();
        
        if (status.isRecording && status.durationMillis > 1000) {
          // 1 saniye geçtikten sonra analiz için geçici durdur
          await recordingRef.current.pauseAsync();
          const uri = recordingRef.current.getURI();
          
          if (uri) {
            await analyzeAudioFile(uri);
          }
          
          // Kaydı tekrar başlat
          if (isRecordingRef.current) {
            await recordingRef.current.startAsync();
          }
        }
        
        // Sonraki analiz için bekle
        if (isRecordingRef.current) {
          setTimeout(analyzeLoop, 200);
        }
        
      } catch (error) {
        console.log('Analysis loop error:', error);
        if (isRecordingRef.current) {
          setTimeout(analyzeLoop, 1000);
        }
      }
    };

    analyzeLoop();
  };



  const analyzeAudioFile = async (uri) => {
    try {
      const audioData = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const audioBuffer = extractPCMFromWAV(audioData);

      if (audioBuffer && audioBuffer.length > 512) {
        // Ses seviyesi kontrolü (web'deki gibi)
        const volumeCheck = audioBuffer.some(v => Math.abs(v) > 0.03);

        if (!volumeCheck) {
          return; // Sessizlik durumunda analiz yapma
        }

        const detectedFreq = autoCorrelate(audioBuffer, 22050);

        if (detectedFreq > 80 && detectedFreq < 1000) {
          setFrequency(detectedFreq);
          const midiPitch = getNoteFromPitchFrequency(detectedFreq);
          const currentNote = noteStrings[midiPitch % 12];
          setPlayingNote(currentNote);

          const cents = centsOffPitch(
            detectedFreq,
            getPitchFrequencyFromNote(midiPitch)
          );

          // Web'deki yumuşatma mantığı
          const centsDiff = Math.abs(cents - prevCentsOff);
          if (centsDiff > MAX_CENTS_JUMP) {
            const smoothedCents = prevCentsOff + (Math.sign(cents - prevCentsOff) * MAX_CENTS_JUMP);
            setCentsOff(smoothedCents);
            setPrevCentsOff(smoothedCents);
          } else {
            setCentsOff(cents);
            setPrevCentsOff(cents);
          }
        }
      }
    } catch (error) {
      console.log('Audio analysis error:', error);
    }
  };

  const extractPCMFromWAV = (base64Data) => {
    try {
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // WAV header'ı atla
      const dataStart = 44;
      if (bytes.length < dataStart) return null;

      const pcmData = bytes.slice(dataStart);
      const float32Array = new Float32Array(pcmData.length / 2);

      for (let i = 0; i < float32Array.length; i++) {
        const int16 = (pcmData[i * 2 + 1] << 8) | pcmData[i * 2];
        const signed = int16 > 32767 ? int16 - 65536 : int16;
        float32Array[i] = signed / 32768.0;
      }

      return float32Array;
    } catch (error) {
      console.log('PCM extraction error:', error);
      return null;
    }
  };

  const stopRecording = () => {
    console.log('Stopping all recording');
    isRecordingRef.current = false;
    setIsRecording(false);

    // Kaydı durdur
    if (recordingRef.current) {
      try {
        recordingRef.current.stopAndUnloadAsync();
      } catch (error) {
        console.log('Stop recording error:', error);
      }
      recordingRef.current = null;
    }

    // State'leri sıfırla
    setPlayingNote('');
    setFrequency(0);
    setCentsOff(0);
    setPrevCentsOff(0);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {/* Ana içerik */}
        <LinearGradient
          colors={['#2c3136', '#23262B']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
        <View style={styles.appContainer}>
          {/* Header - logo ve hamburger menü */}
          <View style={styles.headerContainer}>
            {/* Sol taraf - logo */}
            <View style={styles.headerLeft}>
              <Text style={styles.headerDimmed}>emirgocc's</Text>
              <Text style={styles.headerTitle}>Tuner</Text>
            </View>
            
            {/* Sağ taraf - hamburger menü */}
            <TouchableOpacity 
              style={styles.hamburgerButton}
              onPress={toggleDrawer}
              activeOpacity={0.7}
            >
              <Ionicons 
                name="menu" 
                size={28} 
                color="#EA506F" 
              />
            </TouchableOpacity>
          </View>

          {/* Seçili enstrüman - ayrı satır */}
          <View style={styles.instrumentContainer}>
            <Text style={styles.instrumentLabel}>
              {instrumentNames[selectedInstrument]}
            </Text>
          </View>

          <View style={styles.tunerBoxShadowWrap}>
            <LinearGradient
              colors={['rgba(62,67,76,1)', 'rgba(30,32,36,1)']}
              style={styles.tunerBoxOuter}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            >
              <LinearGradient
                colors={['rgba(49,56,61,1)', 'rgba(24,25,29,1)']}
                style={styles.tunerBoxInner}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
              >
                <Tuner
                  centsOff={centsOff}
                  frequency={frequency}
                  isRecording={isRecording}
                  playingNote={playingNote}
                />

                <RecordButton
                  onPress={handleRecordToggle}
                  pressed={isRecording}
                />
              </LinearGradient>
            </LinearGradient>
          </View>
          <Footer />
        </View>

        {/* Gesture Drawer - Smooth animasyon ile */}
        {isDrawerOpen && (
          <>
            {/* Animated Overlay - karartı */}
            <Animated.View style={[styles.drawerOverlayAnimated, overlayAnimatedStyle]}>
              <TouchableOpacity 
                style={styles.overlayTouchable}
                activeOpacity={1}
                onPress={closeDrawer}
              />
            </Animated.View>

            {/* Animated Drawer - Gesture ile kontrol edilebilir */}
            <PanGestureHandler onGestureEvent={panGestureHandler}>
              <Animated.View style={[styles.drawerAnimated, drawerAnimatedStyle]}>
                <InstrumentDrawer
                  selectedInstrument={selectedInstrument}
                  onSelectInstrument={handleSelectInstrument}
                  onClose={closeDrawer}
                />
              </Animated.View>
            </PanGestureHandler>
          </>
        )}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    padding: 12,
    justifyContent: 'flex-start',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 50,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  hamburgerButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(234,80,111,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Yeni enstrüman container - ayrı satır
  instrumentContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 4,
    paddingHorizontal: 16,
  },
  instrumentLabel: {
    color: '#bfc2c7',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1.2,
    textAlign: 'center',
    opacity: 0.9,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : undefined,
  },
  headerDimmed: {
    color: '#bfc2c7',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : undefined,
  },
  headerTitle: {
    color: '#EA506F',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : undefined,
  },
  tunerBoxShadowWrap: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
    zIndex: 1, // Drawer'dan düşük bir değer
    marginBottom: 20, // 40'tan 20'ye düşürüldü
    marginTop: 12, // 20'den 12'ye düşürüldü
    alignItems: 'center',
    width: SCREEN_WIDTH > 400 ? 300 : '85%',
    alignSelf: 'center',
    borderWidth: 3,
    borderColor: '#3E434C',
  },
  tunerBoxOuter: {
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  tunerBoxInner: {
    borderRadius: 17,
    paddingVertical: 24,
    paddingHorizontal: 14,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Gesture Drawer stilleri - Reanimated ile
  drawerOverlayAnimated: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 9998,
    elevation: 9998,
  },
  overlayTouchable: {
    flex: 1,
  },
  drawerAnimated: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: SCREEN_WIDTH * 0.90, // Optimum: %90
    zIndex: 9999,
    elevation: 9999,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    backgroundColor: 'rgba(44,49,54,0.95)', // Hafif transparan
    overflow: 'hidden', // Taşan içeriği gizle
  },
});
