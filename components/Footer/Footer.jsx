import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';

const socials = [
  {
    title: 'GitHub',
    url: 'https://github.com/emirgocc',
    icon: 'github',
  },
  {
    title: 'LinkedIn',
    url: 'https://linkedin.com/in/emirgocc',
    icon: 'linkedin',
  },
  {
    title: 'Twitter',
    url: 'https://x.com/Emirgocc',
    icon: 'twitter',
  },
  {
    title: 'Instagram',
    url: 'https://www.instagram.com/emir.goc/',
    icon: 'instagram',
  },
];

function Footer() {
  return (
    <View style={styles.container}>
      <View style={styles.socialsContainer}>
        {socials.map(({ title, url, icon }) => (
          <TouchableOpacity
            key={title}
            style={styles.link}
            onPress={() => Linking.openURL(url)}
          >
            <Feather name={icon} size={28} style={styles.icon} />
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.loveText}>
        From 22 with love
        <Text style={styles.author}> Emir Göç</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 80,
    padding: 16,
    marginTop: 20,
    textAlign: 'center',
  },
  socialsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  link: {
    paddingHorizontal: 16,
  },
  icon: {
    color: '#888',
  },
  loveText: {
    color: '#888',
    fontSize: 14,
  },
  author: {
    fontWeight: 'bold',
    color: '#EA506F',
  },
});

export default Footer; 