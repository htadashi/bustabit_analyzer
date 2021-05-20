function KellyBettingSimulation() {

  // Define sheets
  const dataSheet       = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Data");
  const statisticsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Statistics");
  const simulationSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Simulation");
  
  // Clear previous simulation   
  simulationSheet.deleteRows(2, simulationSheet.getLastRow()-1);

  // Initial money on wallet 
  const initialInvestment = 1000;
  // Placed bet
  const bustBet = statisticsSheet.getRange("B1").getValues();
  // Statistics (estimated from historical data)
  const winProbability  = statisticsSheet.getRange("B3").getValues();
  const loseProbability = statisticsSheet.getRange("B4").getValues();
  // Fraction to bet from initial investment  
  const KellyFraction = winProbability - (loseProbability/bustBet);
  // Margin of safety
  const safetyFactor = 0.8;
  // Get previous historical data 
  const busts = dataSheet.getRange("B2:B").getValues();
  
  let wallet = initialInvestment;

  for(let i = 0; i < busts.length; i++){

    betSize = wallet * KellyFraction * safetyFactor;
    simulationSheet.appendRow([wallet, betSize]);    
    wallet  = wallet - betSize;

    if(wallet < 1){
      console.log("Broke 💸");
      break;
    }

    if(bustBet <= busts[i][0]){
      betGain = bustBet * betSize;
    }else{
      betGain = 0;
    }    

    wallet = wallet + betGain;    
  }
  
  return wallet;
}
