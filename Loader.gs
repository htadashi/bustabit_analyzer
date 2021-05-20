// Port from https://jsfiddle.net/Dexon95/2fmuxLza/

/**
  * @desc Calculates the game result from its hash
  * @param binary seed - Hash of the game. Ex.: Buffer.from(seed)
  * @param string salt - Client seed; A bitcoin block hash
  * @return number
*/
const gameResult = (seed, salt) => {
  const nBits = 52; // number of most significant bits to use
  
  // 1. HMAC_SHA256(message=seed, key=salt)  
  const hmac = CryptoJS.HmacSHA256(seed, salt);
  seed = hmac.toString(CryptoJS.enc.Hex);

  // 2. r = 52 most significant bits
  seed = seed.slice(0, nBits / 4);
  const r = parseInt(seed, 16);

  // 3. X = r / 2^52
  let X = r / Math.pow(2, nBits); // uniformly distributed in [0; 1)

  // 4. X = 99 / (1-X)
  X = 99 / (1 - X);

  // 5. return max(trunc(X), 100)
  const result = Math.floor(X);
  return Math.max(1, result / 100);
};

function loadTable(numberOfGames = 10000, gameHashinput = 'cfcf238d48ab956c6eb9b39879cfe488fa670cfdbb6c645d30b4c8e1afb2221a') {
  let prevHash = null;
  for (let i = 0; i < numberOfGames; i++) {
    let hash = String(prevHash ? CryptoJS.SHA256(String(prevHash)) : gameHashinput);
    let bust = gameResult(CryptoJS.enc.Hex.parse(hash), '0000000000000000004d6ec16dafe9d8370958664c1dc422f452892264c59526');

    SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Data').appendRow(
      [hash, bust]
    );    
    prevHash = hash;
  };
}