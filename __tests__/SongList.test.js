import { render } from '@testing-library/react-native';
import { Themes } from '../assets/Themes';
import { Song, SongList } from '../components';
import { findByTestID, findAllByType } from './utils';

describe('SongList tests', () => {
  let songList;
  beforeEach(async () => {
    songList = render(<SongList />).toJSON();
  });
  it('Renders SongList correctly', () => {
    expect(songList).toBeTruthy();
  });
  it('SongList has the testid "SongList"', () => {
    // expect(songList[1].props.testID).toBe('SongList');
    expect(findByTestID(songList, 'SongList')).toBeTruthy;
  });
  it('SongList has a flatList', () => {
    expect(findAllByType({ children: songList }, 'RCTScrollView').length).toBeGreaterThanOrEqual(1);
  });
  it('SongList has "My Top Tracks" text component', () => {
    expect(
      findAllByType({ children: songList }, 'Text').some((text) =>
        text.children.some((child) => child === 'My Top Tracks')
      )
    ).toBeTruthy();
  });
  it('SongList "My Top Tracks" component has the right font color', () => {
    findAllByType({ children: songList }, 'Text').forEach((text) => {
      if (text.children === 'My Top Tracks') {
        expect(text.props.style.color).toBe(Themes.colors.text);
      }
    });
  });
});
