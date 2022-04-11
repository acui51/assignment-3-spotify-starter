import { create } from 'react-test-renderer';
import { View, Text } from 'react-native';

const isArr = Array.isArray;

const findAll = (root, predicate) => {
  if (!predicate) throw Error('findAll requires a predicate function');

  let results = [];
  // base case
  if (predicate(root)) {
    results.push(root);
  }
  // recursive case
  const children = root.children;
  if (children) {
    children.forEach((child) => {
      if (typeof child === 'string') return;
      results.push(...findAll(child, predicate));
    });
  }
  return results;
};

const findAllByType = (root, type) => {
  return findAll(root, (node) => node.type === type);
};

const toBeCloseTo = (actual, expectedObj, precision = 2) => {
  let pass = false;
  if (actual.toString().includes('%')) {
    // percentage case
    const expectedPercentage = expectedObj.percentage;
    if (!expectedPercentage) throw Error('toBeCloseTo requires a percentage object');
    const actualPercentage = parseFloat(actual.toString().replace('%', ''));
    pass = Math.abs(actualPercentage - expectedPercentage) < precision;
  } else {
    const expected = expectedObj.value;
    if (!expected) throw Error('toBeCloseTo requires a value object');
    pass = Math.abs(expected - actual) < Math.pow(10, -precision) / 2;
  }
  const message = () => `expected ${actual} to be around ${JSON.stringify(expectedObj)}`;
  return pass
    ? {
        message,
        pass: true,
      }
    : {
        message,
        pass: false,
      };
};

const toBeOf = (actual, expected) => {
  if (!isArr(expected)) throw Error('toBeOf requires an array of options');
  const message = () => `expected ${actual} to be one of ${JSON.stringify(expected)}`;
  return expected.some(
    (elemOfExpected) => JSON.stringify(elemOfExpected) === JSON.stringify(actual)
  )
    ? { message, pass: true }
    : { message, pass: false };
};

const checkStyle = (style, expected) => {
  // TO DO - abstract style checking to work even if style prop is an array
  // if (isArr(style)) {
  //   return expect.arrayContaining(expect.objectContaining(expected));
  // } else {
  //   return expect.objectContaining(expected);
  // }
};

export { findAll, findAllByType, toBeCloseTo, toBeOf };

// TESTS

const genRandomText = () => {
  const domain = 'ABCDEFHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  for (let i = 0; i < 10; i++) {
    text += domain.charAt(Math.floor(Math.random() * domain.length));
  }
  return text;
};

const genRandomId = () => {
  const domain = '0123456789';
  let id = '';
  for (let i = 0; i < 3; i++) {
    id += domain.charAt(Math.floor(Math.random() * domain.length));
  }
  return id;
};

describe('findAll', () => {
  it('finds all nodes of a given type', () => {
    const TEXT1 = genRandomText();
    const TEXT2 = genRandomText();
    const TEXT3 = genRandomText();
    const TESTID1 = genRandomId();
    const TESTID2 = genRandomId();
    const TESTID3 = genRandomId();
    const testElem = create(
      <View testID={TESTID1}>
        <Text>{TEXT1}</Text>
        <View testID={TESTID2}>
          <Text>{TEXT2}</Text>
          <Text>{TEXT3}</Text>
          <View testID={TESTID3} />
        </View>
      </View>
    );
    const textNodes = findAllByType(testElem.toJSON(), 'Text');
    expect(textNodes.length).toBe(3);
    expect(textNodes[0].children[0]).toBe(TEXT1);
    expect(textNodes[1].children[0]).toBe(TEXT2);
    expect(textNodes[2].children[0]).toBe(TEXT3);
    const viewNodes = findAllByType(testElem.toJSON(), 'View');
    expect(viewNodes.length).toBe(3);
    expect(viewNodes[0].props.testID).toBe(TESTID1);
    expect(viewNodes[1].props.testID).toBe(TESTID2);
    expect(viewNodes[2].props.testID).toBe(TESTID3);
  });
});

describe('toBeCloseTo', () => {
  it('ToBeCloseTo works as expected with percentages', () => {
    const actual = '10%';
    const expectedObj = {
      percentage: 10,
    };
    const { pass } = toBeCloseTo(actual, expectedObj);
    expect(pass).toBe(true);
  });
  it('ToBeCloseTo works as expected with values', () => {
    const value = 10;
    const expectedObj = {
      value: 10,
    };
    const { pass } = toBeCloseTo(value, expectedObj);
    expect(pass).toBe(true);
  });
  it('ToBeCloseTo works as expected with value and percentages 1', () => {
    const value = '10%';
    const expectedObj = {
      value: 10,
      percentage: 10,
    };
    const { pass } = toBeCloseTo(value, expectedObj);
    expect(pass).toBe(true);
  });
  it('ToBeCloseTo works as expected with value and percentages 2', () => {
    const value = 10;
    const expectedObj = {
      value: 10,
      percentage: 10,
    };
    const { pass } = toBeCloseTo(value, expectedObj);
    expect(pass).toBe(true);
  });
});

describe('toBeOf', () => {
  it('toBeOf finds 1 in [1,2,3]', () => {
    expect(toBeOf(1, [1, 2, 3]).pass).toEqual(true);
  });
  it("toBeOf finds {color: 'red' } in [{color: 'blue'}, {color: 'red'}]", () => {
    expect(toBeOf({ color: 'red' }, [{ color: 'blue' }, { color: 'red' }]).pass).toEqual(true);
  });
});
