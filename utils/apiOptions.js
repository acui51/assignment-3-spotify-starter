import axios from 'axios';
import { getEnv } from './';

const {
  SPOTIFY_API: { SHORT_TERM_API, LONG_TERM_API, ALBUM_TRACK_API_GETTER },
} = getEnv();

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
  try {
    let res = await fetcher(SHORT_TERM_API, token);
    if (!res || !res.data?.items.length) res = await fetcher(LONG_TERM_API, token);
    return res.data?.items;
  } catch (e) {
    console.error(e);
  }
};

export const getAlbumTracks = async (albumId, token) => {
  try {
    const res = await fetcher(ALBUM_TRACK_API_GETTER(albumId), token);
    const transformedResponse = res.data?.tracks?.items?.map((item) => {
      item.album = { images: res.data?.images, name: res.data?.name };
      return item;
    });
    // TO DO maybe reply with a cached version of an album if spotify api is down or sth
    return transformedResponse;
  } catch (e) {
    console.error(e);
  }
};
