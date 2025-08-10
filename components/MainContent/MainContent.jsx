import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Tuner from '../Tuner/Tuner';
import RecordButton from '../RecordButton/RecordButton';
import BpmFinder from '../BpmFinder/BpmFinder';
import Metronome from '../Metronome/Metronome';

/**
 * Ana içerik komponenti - Tuner ve BpmFinder arasında geçiş
 */
const MainContent = ({ 
  selectedRhythm,
  centsOff,
  frequency,
  isRecording,
  playingNote,
  onRecordToggle,
  // Metronom props'ları
  metronomeBpm,
  isMetronomePlaying,
  onMetronomeBpmChange,
  onMetronomePlayToggle
}) => {
  return (
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
          {/* Tuner, BpmFinder veya Metronome göster */}
          {selectedRhythm === 'tapToBpm' ? (
            <BpmFinder 
              isActive={true}
              onTap={() => {}}
            />
          ) : selectedRhythm === 'metronome' ? (
            <Metronome
              bpm={metronomeBpm}
              onBpmChange={onMetronomeBpmChange}
              isPlaying={isMetronomePlaying}
              onPlayToggle={onMetronomePlayToggle}
            />
          ) : (
            <>
              <Tuner
                centsOff={centsOff}
                frequency={frequency}
                isRecording={isRecording}
                playingNote={playingNote}
              />

              <RecordButton
                onPress={onRecordToggle}
                pressed={isRecording}
              />
            </>
          )}
        </LinearGradient>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  tunerBoxShadowWrap: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
    zIndex: 1,
    marginBottom: 20,
    marginTop: 12,
    alignItems: 'center',
    width: '85%',
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
});

export default MainContent; 