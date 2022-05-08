import axios from 'axios';
import CachedTopTracks from './topTracksCache.json';
import CachedAlbumTracks from './albumTracksCache.json';
import getEnv from './env';

const {
  SPOTIFY_API: { SHORT_TERM_API, LONG_TERM_API, ALBUM_TRACK_API_GETTER },
} = getEnv();

const NETWORK_FAILURE = new Error(
  'Network failure.\nCheck console for more details.\nRandom cached data is returned.'
);

const fetcher = async (url, token) => {
  try {
    return await axios(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const getMyTopTracks = async (token) => {
  const cache = { data: { items: CachedTopTracks } };
  try {
    let res = await fetcher(SHORT_TERM_API, token);
    if (!res || !res.data?.items.length) res = await fetcher(LONG_TERM_API, token);
    if (!res || !res.data?.items.length) res = cache;
    return res.data?.items;
  } catch (e) {
    console.error(e);
    alert(NETWORK_FAILURE);
    return cache;
  }
};

export const getAlbumTracks = async (albumId, token) => {
  try {
    const res = await fetcher(ALBUM_TRACK_API_GETTER(albumId), token);
    const transformedResponse = res.data?.tracks?.items?.map((item) => {
      item.album = { images: res.data?.images, name: res.data?.name };
      return item;
    });
    if (!transformedResponse) return CachedAlbumTracks;
    return transformedResponse;
  } catch (e) {
    console.error(e);
    alert(NETWORK_FAILURE);
    return CachedAlbumTracks;
  }
};
