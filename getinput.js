async function getinput(inputstring, actionarray) {
    try {
        let replResult = "badchoice";
        let result = ""
      do {
        result = await inputfunct(inputstring);
        if (actionarray.includes(String(result))){
            replResult = result
        } else {
            replResult = "badchoice"
        }
        if (replResult == "badchoice") {
            console.log("Invalid option.")
        }
      }while (replResult == "badchoice");
        
      return replResult;
  
    }catch(e) {
      console.log('failed:', e);
    }
  }




  function inputfunct(inputstring) {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(inputstring, ans => {
        rl.close();
        resolve(ans);
    }))
 
  }

  module.exports = { getinput };