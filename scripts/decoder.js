const mainFormInputLetter = document.querySelector('.main_form_input_letter');
const mainFormOutputLetter = document.querySelector('.main_form_output_letter');
//const enDeCodeButton = mainFormInputLetter.querySelector('.en-de_code_button');
//const clearButton = mainFormOutputLetter.querySelector('.clear_button');

const alphabetBitDepth = 5;
const alphabet = [' ', 'а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ъ', 'ы', 'ь', 'э', 'ю', 'я', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', ',', '?', '!', ':', ';', '"', '(', ')', '-', '+', '=', '/', '|', '\n', '\\', 's', 't', 'r', 'n'];
const consonants = ['б', 'в', 'г', 'д', 'ж', 'з', 'й', 'к', 'л', 'м', 'н', 'п', 'р', 'с', 'т', 'ф', 'х', 'ц', 'ч', 'ш', 'щ'];
const vowels = ['а', 'у', 'о', 'и', 'э', 'ы', 'я', 'ю', 'е', 'ё'];
const otherLetters = ['ъ', 'ь'];

mainFormInputLetter.addEventListener('reset', function(evt) {
  evt.preventDefault();
  mainFormInputLetter.querySelector('.input_letter_greeting').value = '';
  mainFormInputLetter.querySelector('.input_letter_main_content').value = '';
  mainFormInputLetter.querySelector('.input_letter_farewell').value = '';
  mainFormOutputLetter.querySelector('.output_letter_greeting').value = '';
  mainFormOutputLetter.querySelector('.output_letter_main_content').value = '';
  mainFormOutputLetter.querySelector('.output_letter_farewell').value = '';
  mainFormOutputLetter.querySelector('.letter_background::before').style = 'opacity: 0.5';
});

mainFormInputLetter.addEventListener('submit', function(evt) {

  evt.preventDefault();
  const inputLetterGreeting = mainFormInputLetter.querySelector('.input_letter_greeting').value;
  const inputLetterMainContent = mainFormInputLetter.querySelector('.input_letter_main_content').value;
  const inputLetterFarewell = mainFormInputLetter.querySelector('.input_letter_farewell').value;

  const fullKey = getFullKey(inputLetterGreeting, inputLetterMainContent.length);
  const convertedLetter = enDeCodeText(fullKey, inputLetterMainContent);

  addLetterToResultForm(inputLetterGreeting, convertedLetter, inputLetterFarewell);

});

function getFullKey(greetingPhrase, mainLetterTextLen) {
  const greetingPhraseMassive = transformTextToMassive(greetingPhrase);
  const greetingPhraseLetters = getTextSymbolsList(greetingPhraseMassive);
  const key = getKey(greetingPhraseLetters, greetingPhrase);
  const fullKey = expandKey(key, mainLetterTextLen);

  return fullKey;
};

function transformTextToMassive(string) {
  return [...string.toLowerCase()];
}

function getTextSymbolsList(TextMassive) {
  const symbolsList = TextMassive.reduce( function(prevVal, item){
    if (!prevVal[item]) {
      prevVal[item] = 1;
    } else {
      prevVal[item] += 1;
    }
    return prevVal;
  }, {});
  return symbolsList;
}

function getKey(symbolMassive, symbolString) {
  const symbolStringLen = symbolString.length;
  let key = [0, 0, 0, 0, alphabetBitDepth, alphabetBitDepth, 0];
  key[0] = symbolStringLen;
  for(let i = 0; i<Object.keys(symbolMassive).length; i++) {
    if(consonants.find(symbol => symbol === Object.keys(symbolMassive)[i])) {
      key[1] = key[1] + symbolMassive[Object.keys(symbolMassive)[i]];
      if(symbolMassive[Object.keys(symbolMassive)[i]] === 1) {
        key[5]++;
      } else {
        key[3]++;
      };
    } else if(vowels.find(symbol => symbol === Object.keys(symbolMassive)[i])) {
      key[1] = key[1] + symbolMassive[Object.keys(symbolMassive)[i]];
      if(symbolMassive[Object.keys(symbolMassive)[i]] === 1) {
        key[2]++;
      } else {
        key[4]++;
      };
    } else if(otherLetters.find(symbol => symbol === Object.keys(symbolMassive)[i])) {
      key[1] = key[1] + symbolMassive[Object.keys(symbolMassive)[i]];
    };
  };
  key[6] = alphabet.findIndex(symbol => symbol === symbolString[symbolStringLen-1]);

  return key;
}

function expandKey(key, length) {
  let fullKey = key;
  while (fullKey.length < length) {
    fullKey = fullKey.concat(key);
  }
  return fullKey;
};

function enDeCodeText(fullKey, inputLetterText) {
  const letterLength = inputLetterText.length;
  inputLetterText = inputLetterText.toLowerCase();
  const convertedLetter = XORconverter(inputLetterText, letterLength, fullKey).join('');

  return convertedLetter;
};

function XORconverter(text, textLength, fullKey) {
  const convertedText = [];
  for(let i = 0; i < textLength; i++) {
    convertedText[i] = alphabet[alphabet.indexOf(text[i]) ^ fullKey[i]];
  }
  return convertedText;
};

function addLetterToResultForm(inputLetterGreeting, convertedLetter, inputLetterFarewell) {
  const outputLetterGreeting = mainFormOutputLetter.querySelector('.output_letter_greeting');
  const outputLetterMainContent = mainFormOutputLetter.querySelector('.output_letter_main_content');
  const outputLetterFarewell = mainFormOutputLetter.querySelector('.output_letter_farewell');
  outputLetterGreeting.value = inputLetterGreeting;
  outputLetterMainContent.value = convertedLetter;
  outputLetterFarewell.value = inputLetterFarewell;

  outputLetterGreeting.style = 'color: var(--active_color);';
  outputLetterMainContent.style = 'color: var(--active_color);';
  outputLetterFarewell.style = 'color: var(--active_color);';
  mainFormOutputLetter.querySelector('.letter_background::before').style = 'opacity: 0.65';
}