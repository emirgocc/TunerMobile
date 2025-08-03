import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, Animated } from 'react-native';
import Svg, { G, Line, Path, Circle } from 'react-native-svg';
import { getColorsArray } from '../../utils';

const WIDTH = 320;
const HEIGHT = 180;
const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT * 0.88;
const RADIUS = 120;
const SEGMENTS = 31;
const START_ANGLE = -Math.PI;
const END_ANGLE = 0;
const IN_TUNE_START = 13;
const IN_TUNE_END = 17;
const GAP_DEGREES = 2; // segmentler arası boşluk (derece cinsinden)
const GAP_RAD = (GAP_DEGREES * Math.PI) / 180;
const SEGMENT_LENGTH = 1.0; // Tüm segmentler için uzunluk artırıldı

function polarToCartesian(cx, cy, r, angle) {
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  };
}

// Animasyonlu segment bileşeni
const AnimatedSegment = ({ segAngle1, segAngle2, outerR, baseInnerR, pulseAnim, color, isInTune }) => {
  const [innerR, setInnerR] = useState(baseInnerR);

  useEffect(() => {
    if (isInTune) {
      const listener = pulseAnim.addListener(({ value }) => {
        setInnerR(RADIUS - 20 * SEGMENT_LENGTH * value);
      });
      return () => pulseAnim.removeListener(listener);
    } else {
      setInnerR(baseInnerR);
    }
  }, [isInTune, pulseAnim, baseInnerR]);

  const p1 = polarToCartesian(CENTER_X, CENTER_Y, outerR, segAngle1);
  const p2 = polarToCartesian(CENTER_X, CENTER_Y, outerR, segAngle2);
  const p3 = polarToCartesian(CENTER_X, CENTER_Y, innerR, segAngle2);
  const p4 = polarToCartesian(CENTER_X, CENTER_Y, innerR, segAngle1);
  const d = `M${p1.x},${p1.y} L${p2.x},${p2.y} L${p3.x},${p3.y} L${p4.x},${p4.y} Z`;

  return <Path d={d} fill={color} opacity={1} />;
};

const Tuner = ({ centsOff = 0, frequency = 0, isRecording = false, playingNote = '--' }) => {
  // İbre açısı: -50 cent = -90°, 0 cent = 0°, +50 cent = +90°
  const percent = Math.max(-50, Math.min(50, centsOff));
  const angle = ((percent + 50) / 100) * Math.PI - Math.PI; // -PI (sol) ile 0 (sağ) arası

  const colors = getColorsArray();
  
  // In-tune kontrolü ve animasyon
  const isInTune = isRecording && Math.abs(centsOff) <= 5;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isInTune) {
      // Pulse animasyonu başlat
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 400,
            useNativeDriver: false,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      // Animasyonu durdur
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [isInTune]);

  // Segmentleri çiz
  const segments = [];
  for (let i = 0; i < SEGMENTS; i++) {
    // Segmentin toplam açısı
    const totalAngle = Math.PI / SEGMENTS;
    // Gap'i ikiye bölüp baştan ve sondan kırp
    const segAngle1 = START_ANGLE + i * totalAngle + GAP_RAD / 2;
    const segAngle2 = START_ANGLE + (i + 1) * totalAngle - GAP_RAD / 2;
    const outerR = RADIUS;
    const baseInnerR = RADIUS - 20 * SEGMENT_LENGTH;
    
    // Orta segmentlerin rengi (normal renk, yeşil yapma)
    let segmentColor = colors[i];
    // Yeşil renk kaldırıldı - sadece Hz yazısı yeşil olacak
    
    // Orta segmentler için animasyonlu bileşen
    if (i >= IN_TUNE_START && i <= IN_TUNE_END) {
      segments.push(
        <AnimatedSegment
          key={i}
          segAngle1={segAngle1}
          segAngle2={segAngle2}
          outerR={outerR}
          baseInnerR={baseInnerR}
          pulseAnim={pulseAnim}
          color={segmentColor}
          isInTune={isInTune}
        />
      );
    } else {
      // Normal segmentler
      const p1 = polarToCartesian(CENTER_X, CENTER_Y, outerR, segAngle1);
      const p2 = polarToCartesian(CENTER_X, CENTER_Y, outerR, segAngle2);
      const p3 = polarToCartesian(CENTER_X, CENTER_Y, baseInnerR, segAngle2);
      const p4 = polarToCartesian(CENTER_X, CENTER_Y, baseInnerR, segAngle1);
      const d = `M${p1.x},${p1.y} L${p2.x},${p2.y} L${p3.x},${p3.y} L${p4.x},${p4.y} Z`;
      
      segments.push(
        <Path
          key={i}
          d={d}
          fill={segmentColor}
          opacity={1}
        />
      );
    }
  }

  // İbre (needle) - Web'deki GaugeComponent gibi sivri
  const needleLength = RADIUS - 30;
  const needleAngle = angle;
  const needleBase = polarToCartesian(CENTER_X, CENTER_Y, 0, 0);
  const needleTip = polarToCartesian(CENTER_X, CENTER_Y, needleLength, needleAngle);
  
  // Web'deki pointer gibi sivri şekil için path oluştur
  const baseWidth = 25; // Web'deki baseWidth
  const tipWidth = 2;   // Uç genişliği
  
  // İbre açısına dik olan vektörler (sivri şekil için)
  const perpAngle1 = needleAngle + Math.PI / 2;
  const perpAngle2 = needleAngle - Math.PI / 2;
  
  // Taban noktaları (geniş)
  const baseLeft = polarToCartesian(CENTER_X, CENTER_Y, baseWidth / 2, perpAngle1);
  const baseRight = polarToCartesian(CENTER_X, CENTER_Y, baseWidth / 2, perpAngle2);
  
  // Uç noktaları (dar)
  const tipLeft = polarToCartesian(needleTip.x, needleTip.y, tipWidth / 2, perpAngle1);
  const tipRight = polarToCartesian(needleTip.x, needleTip.y, tipWidth / 2, perpAngle2);
  
  const needlePath = `M${baseLeft.x},${baseLeft.y} L${tipLeft.x},${tipLeft.y} L${tipRight.x},${tipRight.y} L${baseRight.x},${baseRight.y} Z`;

  return (
    <View style={styles.container}>
      <Svg width={WIDTH} height={HEIGHT}>
        <G>
          {/* Segmentler */}
          {segments}
          {/* İbre - Web'deki GaugeComponent gibi sivri */}
          <Path
            d={needlePath}
            fill="#161719"
          />
          {/* İbre merkezi */}
          <Circle
            cx={needleBase.x}
            cy={needleBase.y}
            r={12} // Web'deki baseWidth/2 gibi
            fill="#161719"
          />
        </G>
      </Svg>
      <Text style={styles.noteDisplay}>
        {isRecording ? (playingNote || '--') : '--'}
      </Text>
      <Text style={[
        styles.frequencyDisplay,
        isInTune && { color: '#00FF88' } // In-tune durumunda yeşil
      ]}>
        {isRecording ? `${frequency.toFixed(2)} Hz` : '--'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  noteDisplay: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#EA506F',
    marginVertical: 12,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : undefined,
  },
  frequencyDisplay: {
    fontSize: 20,
    color: '#888',
    marginBottom: 8,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : undefined,
  },
});

export default Tuner; 