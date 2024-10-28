var wbook = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1hrTAZ0IhJtvU64rTvzAacEzFvp_c9dQGklTHRRb3HxM/edit#gid=0');

var sheet = wbook.getSheetByName('Sheet1');

function doPost(e){
  
  var action = e.parameter.action;

  if(action == "addUser"){

    return addUser(e);

  }

}

function addUser(e){

  var rows = JSON.parse(e.postData.contents);

  var data = [];

  for(var i=0;i<rows.length;i++){

    sheet.appendRow(rows[i]);

    data.push(rows[i])

  }

  // return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);

  // var user = JSON.parse(e.postData.contents);

  // sheet.appendRow([user.Name,user.age,user.class]);

  return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
}