import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Desteklenen enstrümanlar listesi
const instruments = [
  { 
    id: 'guitar', 
    name: 'Gitar', 
    emoji: '🎸',
    active: true // Varsayılan aktif enstrüman
  },
  { 
    id: 'violin', 
    name: 'Keman', 
    emoji: '🎻',
    active: false
  },
  { 
    id: 'ukulele', 
    name: 'Ukulele', 
    emoji: '🪕',
    active: false
  },
];

/**
 * Enstrüman seçimi için çekmece menü bileşeni
 * @param {string} selectedInstrument - Seçili enstrüman ID'si
 * @param {function} onSelectInstrument - Enstrüman seçildiğinde çağrılan fonksiyon
 * @param {function} onClose - Çekmece kapatılırken çağrılan fonksiyon
 */
const InstrumentDrawer = ({ selectedInstrument, onSelectInstrument, onClose }) => {
  
  const handleSelectInstrument = useCallback((instrumentId) => {
    // Reanimated ile smooth, timeout gereksiz
    onSelectInstrument(instrumentId);
  }, [onSelectInstrument]);

  return (
    <View style={styles.container}>
      {/* Çekmece arka planı - mevcut tema ile uyumlu gradient */}
      <LinearGradient
        colors={['rgba(44,49,54,0.85)', 'rgba(35,38,43,0.85)']}
        style={styles.drawerBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {/* Başlık */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Enstrüman Seç</Text>
        </View>

        {/* Enstrüman listesi */}
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
    paddingHorizontal: 16, // Geri düşürüldü: 18 → 16
    paddingBottom: 20,
  },
  header: {
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EA506F',
    textAlign: 'center',
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : undefined,
  },
  instrumentsList: {
    flex: 1,
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
  selectedIndicator: {
    width: 20, // Biraz küçült: 22 → 20
    height: 20, // Biraz küçült: 22 → 20
    borderRadius: 10, // Biraz küçült: 11 → 10
    backgroundColor: '#EA506F',
    justifyContent: 'center',
    alignItems: 'center',
    // marginLeft kaldırıldı - checkmark artık yakın
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