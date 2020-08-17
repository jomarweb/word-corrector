const spellCorrector = require('./spellcorrector');

const sc = new spellCorrector();



async function main(){

     await sc.createDictionaryFromFile('./text.txt');

     console.log(await sc.dictionaryCorrection('articial intilegence',3));
    
}


main();