import { render, waitFor } from '@testing-library/react-native';
import App from '../App';
import { Themes, Images } from '../assets/Themes';
import { SpotifyAuthButton } from '../components';
import { toBeOf, someOfToBeOf, findAllByType } from './utils';

jest.useFakeTimers();

expect.extend({
  toBeOf,
  someOfToBeOf,
});

describe('Non interactive test', () => {
  // beforeEach(async () => {
  //   // Why do we need beforeEach?
  //   // https://github.com/callstack/react-native-testing-library/issues/390
  //   await act(async () => {
  //     // act waits useEffect updates
  //     app = await waitFor(() => render(<App />));
  //   });
  // });
  // maybe in the future?
  // beforeAll(async () => {
  //   await act(async () => {
  //     app = await waitFor(() => render(<App />));
  //   });
  // });

  it('App renders correctly', async () => {
    expect(await waitFor(() => render(<App />))).toBeTruthy();
  });
});

describe('AuthButton tests', () => {
  const AuthButtonChildren = ['CONNECT WITH SPOTIFY', Images.spotify];
  let authButton;
  beforeEach(() => {
    authButton = render(<SpotifyAuthButton />).toJSON();
  });
  it('Can find AuthButton', () => {
    expect(authButton).toBeTruthy();
  });
  it('AuthButton has the right backgroundColor', () => {
    expect(authButton.props.style.backgroundColor).toBe(Themes.colors.spotify);
  });
  it('AuthButton is a pill', () => {
    expect(authButton.props.style.borderRadius).toBe(999999);
    // TO DO add other options from google doc draft
  });
  it('AuthButton has the right text', () => {
    const text = findAllByType(authButton, 'Text');
    expect(text.length).toBeGreaterThanOrEqual(1);
    expect(text[0].children).someOfToBeOf(AuthButtonChildren);
  });
  it('AuthButton has the right image', () => {
    const image = findAllByType(authButton, 'Image');
    expect(image).toBeTruthy();
    expect(image[0].props.source).toBeOf(AuthButtonChildren);
  });
  it('AuthButton has the right testID', () => {
    expect(authButton.props.testID).toBe('AuthButton');
  });
  it('AuthButton has an onPress', () => {
    expect(authButton.props.onClick).toBeTruthy();
    expect(authButton.props.onClick).toBeInstanceOf(Function);
  });
  it("AuthButton's elements are aligned", () => {
    expect(authButton.props.style.flexDirection).toBe('row');
    expect(authButton.props.style.alignItems).toBe('center');
  });
});
