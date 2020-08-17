const fs = require('fs');
const alphaNums = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');

function getDistance(A, B) {
  var dot_p = 0;
  var mA = 0;
  var mB = 0;
  for (i = 0; i < A.length; i++) {
    dot_p += (A[i] * B[i]);
    mA += (A[i] * A[i]);
    mB += (B[i] * B[i]);
  }
  mA = Math.sqrt(mA);
  mB = Math.sqrt(mB);

  var similarity = (dot_p) / ((mA) * (mB))

  return similarity;
}

function getVectors(txt) {
  const rowArray = [];
  txt.split(' ').forEach((e, index) => {
    var colArray = new Array(alphaNums.length).fill(0.001);
    e.split('').forEach((f, jindex) => {
      colArray[alphaNums.indexOf(f)] = colArray[alphaNums.indexOf(f)]+ 1;
    });

    colArray.push(e.length)
    rowArray.push(colArray);
  });

  var output = new Array(rowArray[0].length).fill(0.001);
  for (let i = 0; i < rowArray[0].length; i++) {
    for (let j = 0; j < rowArray.length; j++) {
      output[i] = output[i] + rowArray[j][i];
    }
  }
  return output;
}

async function createWordArray(data) {
  const aData = data.toLowerCase().trim().replace(/-/g,' ').split(' ');
  const y = [];
  for (let i = 0; i < aData.length; i++) {
    if (y.indexOf(aData[i]) < 0) {
      y.push({ text: aData[i], vectors: getVectors(aData[i]) })
    }

  }
  return y;
}

class SpellCorrector {
  constructor() {
    this.dictionaries = [];
  }

  async createDictionaryFromFile(_path) {
     const data = fs.readFileSync(_path,  {encoding:'utf8', flag:'r'});
     this.dictionaries = await createWordArray(data);  
    
  }

  async createDictionaryFrom(_data) {
    this.dictionaries = await createWordArray(_data);  
   
 }

  async dictionaryCorrection(_usrText,count =1){
    var usrTextVectors = getVectors(_usrText);
    var results = this.dictionaries.map(x=>{ 
      var y = {text:x.text,confidence:getDistance(x.vectors,usrTextVectors)}  
      return y;
   });

   results = results.sort(function(a,b){return a.confidence-b.confidence});

   return results.splice((results.length)-count,count).sort(function(a,b){return b.confidence-a.confidence});
  }
}

if(module != undefined ){
 module.exports = SpellCorrector;
} 