const { processRawAccountEntry, isValidChecksum } = require('./index');
const { digitIdentifier } = require ("./digitIdentifier");

const digits = [
  [ 0, ' _ | ||_|' ],
  [ 1, '     |  |' ],
  [ 2, ' _  _||_ ' ],
  [ 3, ' _  _| _|' ],
  [ 4, '   |_|  |' ],
  [ 5, ' _ |_  _|' ],
  [ 6, ' _ |_ |_|' ],
  [ 7, ' _   |  |' ],
  [ 8, ' _ |_||_|' ],
  [ 9, ' _ |_| _|' ]
]

// no longer using; now in favor of package 'line-reader'
// 
// test('should be able to open and check file for content', () => {
//   fileName = "account-test-123456789.txt";
//   const fileData = readAccountEntriesFile(fileName);
//   expect(fileData).not.toBe(null);
// });

test.each(digits)("digitIdentifier should identify numbers 0-9", (numericDigit, rawDigit) => {
  expect(digitIdentifier(rawDigit)).toBe(numericDigit);
})

test('should be able to read 4 lines to parse account number', () => {
  testLines = [
    '    _  _     _  _  _  _  _ ',
    '  | _| _||_||_ |_   ||_||_|',
    '  ||_  _|  | _||_|  ||_| _|',
    '                           '
  ]

  expect(processRawAccountEntry(testLines)).toBe("123456789");
});


test('should validate account number with checksum', () => {
  const validAccountNumber1 = "457508000";
  const validAccountNumber2 = "345882865";
  const invalidAccountNumber = "664371495";

  expect(isValidChecksum(validAccountNumber1)).toBe(true);
  expect(isValidChecksum(validAccountNumber2)).toBe(true);
  expect(isValidChecksum(invalidAccountNumber)).toBe(false);
})
