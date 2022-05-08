import { StyleSheet, Text, View, FlatList, Image } from 'react-native';
import React from 'react';
import Song from './Song';
import { Themes, Images } from '../assets/Themes';

const renderItems = ({ item, index }) => {
  return (
    <Song
      imageUrl={item.album.images[0].url}
      songTitle={item.name}
      songArtist={item.artists}
      songIdx={index}
      albumName={item.album.name}
      duration={item.duration_ms}
    />
  );
};

const SongList = ({ tracks }) => {
  return (
    <>
      <View style={styles.titleContainer}>
        <Image source={Images.spotify} style={{ width: 24, height: 24, marginRight: 8 }} />
        <Text style={styles.spotifyTitle}>My Top Tracks</Text>
      </View>
      <FlatList
        data={tracks}
        renderItem={renderItems}
        keyExtractor={(_, id) => `${id}`}
        showsVerticalScrollIndicator={false}
        testID={'SongList'}
      />
    </>
  );
};

const styles = StyleSheet.create({
  spotifyTitle: {
    fontSize: 24,
    color: Themes.colors.white,
    fontWeight: '700',
  },
  titleContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
});

export default SongList;
