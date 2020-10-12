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
