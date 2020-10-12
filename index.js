const fs = require ('fs');
const lineReader = require('line-reader');
Promise = require('bluebird')

const { digitIdentifier } = require ("./digitIdentifier");

const parseAccountEntriesFile = (fileName) => {
  // grab every 27 char line and store each in array
  let rawAccountEntriesFileLines = [];
  var eachLine = Promise.promisify(lineReader.eachLine);

  eachLine(fileName, function(line) {
    rawAccountEntriesFileLines.push(line);
  }).then(function() {
    while (rawAccountEntriesFileLines.length >= 4) {
      accountNumber = processRawAccountEntry(rawAccountEntriesFileLines.splice(0,4));
      writeToFile(`processed-${fileName}`, accountNumber);
    }
  });
}

const processRawAccountEntry = lines => {
  // go through lines 3 chars at a time to isolate digit and then send to identifier
  let accountNumber = "";

  for(let offset = 0; offset <= 24; offset += 3) {
    rawDigit = "";
    for(let lineIndex = 0; lineIndex <= 2; lineIndex++) {
      for(let charIndex = offset; charIndex <= offset + 2; charIndex++) {
        rawDigit += lines[lineIndex][charIndex];
      }
    }
    accountNumber += digitIdentifier(rawDigit);
  }
  return accountNumber;
}

const isValidChecksum = accountNumber => {
  let accountNumberArray = accountNumber.toString().split("").map(Number).reverse();
  let calculation = accountNumberArray.reduce(
    (accumulator, currentValue, index) => accumulator + (currentValue * (index + 1)), 
  0)
  return (calculation % 11 == 0 ? true : false);
}

// no longer using; now in favor of package 'line-reader'
// 
// const readAccountEntriesFile = (fileName) => {
//   fs.readFile(fileName, 'utf8', (err, data) => {
//     if (err) throw err;
//     return data;
//   });
// }

const writeToFile = (fileName, data) => {
  fs.appendFileSync(fileName, data + "\n", (err) => {
    if (err) throw err;
  })
}

const process = (fileName) => {
  parseAccountEntriesFile(fileName);
  console.log("Finished processing file", fileName);
}

process("account-entries-use-case-1.txt");

exports.processRawAccountEntry = processRawAccountEntry;
exports.isValidChecksum = isValidChecksum;

// should have opened file and read line by line instead of loading all into memory
// wasted too much time trying to find a way to do a multiline JSON object to use key/value pairs; could have done it with ' _ | ||_|': 0,
//   but wanted to follow the "clue" and make the digits readable
// my goal was to at least hit the checksum use case 2 so after seeing I was "behind schedule"
// ideally would make the quick change to use CLI to pick which file to read, ie. "node index.js account-test-123456789.txt" so will do that after
// ran into issue where my editor trimmed trailing whitespace on the account entries file, for example if it ended in 9, the last char of the top line would be a " " which got trimmed when I saved, leading to undefined when trying to read it. Should improve that to make it more robust.