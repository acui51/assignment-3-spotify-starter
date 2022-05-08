import { render } from '@testing-library/react-native';
import { Themes } from '../assets/Themes';
import { Song, SongList } from '../components';

describe('SongList tests', () => {
  let songList;
  beforeEach(async () => {
    songList = render(<SongList />).toJSON();
  });
  it('Renders SongList correctly', () => {
    expect(songList).toBeTruthy();
    console.log(
      songList,
      songList[0].children,
      songList[0].props.style,
      JSON.stringify(songList[1].props.renderItem),
      songList[1].children
    );
  });
});
