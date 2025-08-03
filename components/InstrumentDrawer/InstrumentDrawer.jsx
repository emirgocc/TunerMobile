import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Desteklenen enstrümanlar listesi
const instruments = [
  { 
    id: 'guitar', 
    name: 'Gitar', 
    emoji: '🎸'
  },
  { 
    id: 'violin', 
    name: 'Keman', 
    emoji: '🎻'
  },
  { 
    id: 'ukulele', 
    name: 'Ukulele', 
    emoji: '🪕'
  },
];

// Ritim seçenekleri
const rhythmOptions = [
  {
    id: 'metronome',
    name: 'Metronome',
    emoji: '🥁'
  },
  {
    id: 'tapToBpm',
    name: 'Tap to BPM',
    emoji: '👆'
  }
];

/**
 * Enstrüman ve ritim seçimi için çekmece menü bileşeni
 * @param {string} selectedInstrument - Seçili enstrüman ID'si
 * @param {string} selectedRhythm - Seçili ritim ID'si
 * @param {function} onSelectInstrument - Enstrüman seçildiğinde çağrılan fonksiyon
 * @param {function} onSelectRhythm - Ritim seçildiğinde çağrılan fonksiyon
 * @param {function} onClose - Çekmece kapatılırken çağrılan fonksiyon
 */
const InstrumentDrawer = ({ selectedInstrument, selectedRhythm, onSelectInstrument, onSelectRhythm, onClose }) => {
  
  const handleSelectInstrument = useCallback((instrumentId) => {
    onSelectInstrument(instrumentId);
  }, [onSelectInstrument]);

  const handleSelectRhythm = useCallback((rhythmId) => {
    onSelectRhythm(rhythmId);
  }, [onSelectRhythm]);

  return (
    <View style={styles.container}>
      {/* Çekmece arka planı - mevcut tema ile uyumlu gradient */}
      <LinearGradient
        colors={['rgba(44,49,54,0.85)', 'rgba(35,38,43,0.85)']}
        style={styles.drawerBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {/* Enstrüman Bölümü */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Enstrüman</Text>
          <View style={styles.sectionDivider} />
          <View style={styles.instrumentsList}>
            {instruments.map((instrument) => {
              const isSelected = selectedInstrument === instrument.id;
              
              return (
                <TouchableOpacity
                  key={instrument.id}
                  style={[
                    styles.instrumentItem,
                    isSelected && styles.instrumentItemSelected
                  ]}
                  onPress={() => handleSelectInstrument(instrument.id)}
                  activeOpacity={0.7}
                >
                  {/* Seçili enstrüman için gradient arka plan - React 18 uyumlu */}
                  <LinearGradient
                    colors={isSelected 
                      ? ['rgba(234,80,111,0.15)', 'rgba(234,80,111,0.05)']
                      : ['transparent', 'transparent']
                    }
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />
                  
                  {/* Enstrüman emoji'si */}
                  <Text style={styles.instrumentEmoji}>
                    {instrument.emoji}
                  </Text>
                  
                  {/* Enstrüman adı */}
                  <Text style={[
                    styles.instrumentName,
                    isSelected && styles.instrumentNameSelected
                  ]}>
                    {instrument.name}
                  </Text>
                  
                  {/* Seçili işareti */}
                  {isSelected && (
                    <View style={styles.selectedIndicator}>
                      <Text style={styles.selectedCheckmark}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Dikey boşluk */}
        <View style={styles.spacer} />

        {/* Ritim Bölümü */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ritim</Text>
          <View style={styles.sectionDivider} />
          <View style={styles.rhythmList}>
            {rhythmOptions.map((rhythm) => {
              const isSelected = selectedRhythm === rhythm.id;
              
              return (
                <TouchableOpacity
                  key={rhythm.id}
                  style={[
                    styles.rhythmItem,
                    isSelected && styles.rhythmItemSelected
                  ]}
                  onPress={() => handleSelectRhythm(rhythm.id)}
                  activeOpacity={0.7}
                >
                  {/* Seçili ritim için gradient arka plan */}
                  <LinearGradient
                    colors={isSelected 
                      ? ['rgba(234,80,111,0.15)', 'rgba(234,80,111,0.05)']
                      : ['transparent', 'transparent']
                    }
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />
                  
                  {/* Ritim emoji'si */}
                  <Text style={styles.rhythmEmoji}>
                    {rhythm.emoji}
                  </Text>
                  
                  {/* Ritim adı */}
                  <Text style={[
                    styles.rhythmName,
                    isSelected && styles.rhythmNameSelected
                  ]}>
                    {rhythm.name}
                  </Text>
                  
                  {/* Seçili işareti */}
                  {isSelected && (
                    <View style={styles.selectedIndicator}>
                      <Text style={styles.selectedCheckmark}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Footer bilgi metni */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Şu anda sadece Gitar modu aktif
          </Text>
          <Text style={styles.footerSubtext}>
            Diğer enstrümanlar yakında gelecek
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  drawerBackground: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EA506F',
    marginTop: 8,
    marginBottom: 8,
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : undefined,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: 12,
  },
  spacer: {
    height: 20,
  },
  instrumentsList: {
    marginBottom: 16,
  },
  rhythmList: {
    marginBottom: 16,
  },
  instrumentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14, // Artır: 12 → 14 (checkmark yakın olduğu için)
    paddingHorizontal: 16, // Artır: 14 → 16 (daha rahat)
    marginVertical: 3,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    position: 'relative',
    overflow: 'hidden',
  },
  instrumentItemSelected: {
    borderColor: 'rgba(234,80,111,0.3)',
    backgroundColor: 'rgba(234,80,111,0.05)',
  },
  instrumentEmoji: {
    fontSize: 24,
    marginRight: 14, // Artır: 12 → 14 (checkmark yakın olduğu için)
    width: 34, // Artır: 32 → 34 (daha dengeli)
    textAlign: 'center',
  },
  instrumentName: {
    fontSize: 16,
    color: '#bfc2c7',
    fontWeight: '500',
    flex: 1,
    letterSpacing: 0.3,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : undefined,
  },
  instrumentNameSelected: {
    color: '#EA506F',
    fontWeight: 'bold',
  },
  rhythmItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginVertical: 3,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    position: 'relative',
    overflow: 'hidden',
  },
  rhythmItemSelected: {
    borderColor: 'rgba(234,80,111,0.3)',
    backgroundColor: 'rgba(234,80,111,0.05)',
  },
  rhythmEmoji: {
    fontSize: 24,
    marginRight: 14,
    width: 34,
    textAlign: 'center',
  },
  rhythmName: {
    fontSize: 16,
    color: '#bfc2c7',
    fontWeight: '500',
    flex: 1,
    letterSpacing: 0.3,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : undefined,
  },
  rhythmNameSelected: {
    color: '#EA506F',
    fontWeight: 'bold',
  },
  selectedIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EA506F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCheckmark: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13, // Küçültüldü: 14 → 13
    color: '#888',
    textAlign: 'center',
    marginBottom: 3, // Küçültüldü: 4 → 3
    fontFamily: Platform.OS === 'android' ? 'Roboto' : undefined,
  },
  footerSubtext: {
    fontSize: 11, // Küçültüldü: 12 → 11
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    fontFamily: Platform.OS === 'android' ? 'Roboto' : undefined,
  },
});

export default InstrumentDrawer;