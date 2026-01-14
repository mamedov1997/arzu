function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Hədiyyə Kartı Sistemi')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function checkCardExists(cardNo) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Sheet1");
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0].toString() == cardNo) {
      return true;
    }
  }
  return false;
}

function findCard(cardNo) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Sheet1");
  var logSheet = ss.getSheetByName("Logs");
  var data = sheet.getDataRange().getValues();
  var results = []; 
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][0].toString() == cardNo) {
      var cardInfo = {
        success: true,
        balance: data[i][1],
        customerCode: data[i][2],
        nominal: data[i][3],
        row: i + 1,
        cardNo: cardNo,
        history: []
      };
      
      var logData = logSheet.getDataRange().getValues();
      var count = 0;
      for (var j = logData.length - 1; j >= 1; j--) {
        if (logData[j][1].toString() == cardNo) {
          cardInfo.history.push({
            date: Utilities.formatDate(new Date(logData[j][0]), "GMT+4", "dd.MM.yyyy HH:mm"),
            amount: logData[j][2],
            invoice: logData[j][3],
            cashier: logData[j][4],
            note: logData[j][6] || "-"
          });
          count++;
          if (count >= 10) break;
        }
      }
      results.push(cardInfo);
    }
  }
  return results;
}

function updateBalance(info) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var mainSheet = ss.getSheetByName("Sheet1");
  var logSheet = ss.getSheetByName("Logs");
  
  if (info.newBalance > info.nominal) {
    throw new Error("Xəta: Bərpa edilən məbləğ kartın nominalından çox ola bilməz!");
  }
  
  if (info.newBalance < 0) {
    throw new Error("Xəta: Balans mənfiyə düşə bilməz!");
  }

  mainSheet.getRange(info.row, 2).setValue(info.newBalance);
  logSheet.appendRow([new Date(), info.cardNo, info.amount, info.invoiceNo, info.cashier, info.customerCode, info.note]);
  
  if (info.amount < 0) {
    return "Məbləğ uğurla bərpa olundu!";
  } else {
    return "Ödəniş uğurla tamamlandı!";
  }
}

function registerNewCard(info) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var mainSheet = ss.getSheetByName("Sheet1");
  var logSheet = ss.getSheetByName("Logs");
  
  var data = mainSheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0].toString() == info.cardNo) {
      throw new Error("Bu kart kodu artıq sistemdə mövcuddur!");
    }
  }

  var initialBalance = info.nominal - info.usedAmount;
  if (initialBalance < 0) {
    throw new Error("Xəta: İlkin istifadə nominaldan çox ola bilməz!");
  }

  mainSheet.appendRow([info.cardNo, initialBalance, info.customerCode, info.nominal]);
  logSheet.appendRow([new Date(), info.cardNo, info.usedAmount, info.invoiceNo, info.cashier, info.customerCode, info.note || "YENİ SATIŞ"]);
  return "Yeni kart uğurla aktivləşdirildi!";
}
