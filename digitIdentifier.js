const zero =  " _ " +
              "| |" +
              "|_|"

const one =   "   " +
              "  |" +
              "  |"

const two =   " _ " +
              " _|" +
              "|_ "

const three = " _ " +
              " _|" +
              " _|"

const four =  "   " +
              "|_|" +
              "  |"

const five =  " _ " +
              "|_ " +
              " _|"

const six =   " _ " +
              "|_ " +
              "|_|"

const seven = " _ " +
              "  |" +
              "  |"

const eight = " _ " +
              "|_|" +
              "|_|"

const nine =  " _ " +
              "|_|" +
              " _|"

const digitArray = [zero, one, two, three, four, five, six, seven, eight, nine]

const digitIdentifier = (rawDigit) => {
  return digitArray.findIndex( e => e == rawDigit);
}

exports.digitIdentifier = digitIdentifier;