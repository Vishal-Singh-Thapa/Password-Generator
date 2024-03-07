//Fetch the elements using custom attribute
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
//Is variable k under sare checkboxes ayenge
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

//string of all possible symbols
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';


//initially
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//set strength circle color to grey
setIndicator("#ccc");


//set passwordLength
//ye function password length ko UI p display krayega 
function handleSlider() {
    inputSlider.value = passwordLength;
    //initially password ki length 10 rhegi and number bhi side wala 10 k equal ho jayega
    lengthDisplay.innerText = passwordLength;
    //or kuch bhi karna chahiye ? - HW

    /* isse slided and unslided portion ka colour different show hoga */
    // kitna portion ek colour ka hoga and kitna portion different colour ka
    const min = inputSlider.min;
    const max = inputSlider.max;
    // (passwordLength - min)*100/(max - min)) -> itni width hogi
    // 100% height hogi
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

//colour and shadow set/change krega neeche wali batti ki depending on the strength of the password
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

//min to max k range m ek random number return krega 
function getRndInteger(min, max) {
    //Math.random function (inclusive)0-1(exclusive) k beech m number generate kreaga(maybe floating number)
    //* (max - min) -> range becomes (0 to max-min)
    //+ min -> now number will be generated in the range min to max-min
    //floor is done to convert the number into an integer value

    //Eg: max = 20       min = 8
    //let us consider Math.random generated 0.987 value
    //0.987*(20-8)+8
    //19.844
    //floor value = 19
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    //range is from 0(min) to 9(max)
    return getRndInteger(0,9);
}

function generateLowerCase() {  
    //97 -> 'a'
    //123 -> 'z'
    //fromCharCode -> converts integer to unicode character
    return String.fromCharCode(getRndInteger(97,123))
}

function generateUpperCase() {  
    return String.fromCharCode(getRndInteger(65,91))
}
 
function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    //charAt -> character at randNum index value from symbol string is returned
    return symbols.charAt(randNum);
}

//No fixed rules
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    //.checked -> agar checkbox checked h to true mark krdo
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

//await tabhi kaam krega jab async function k under likhenge
async function copyContent() {
    //error handling is done to avoid any possible errors
    try {
        //.writetext method text ko clipboard pe copy krega 
        //.writeText function ek promise return krega
        //await keyword is used becz 'copied' text tabhi show hoga when the password is successfully copied, unless it is not shown
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    //error aya to jha 'copied' likha ayega wha pr 'failed' likha hua ayega 
    catch(e) {
        copyMsg.innerText = "Failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    //itne time(2sec) baad 'copied' wala msg hat jayega khud ba khud
    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);

}

//ye algorithm password ko shuffle kr dega apneaap
function shufflePassword(array) {
    //Fisher Yates Method
    //0 to <i+1 ki range me ek random number find karenge and ith index ko is random index s swap krwa denge
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        //range of random number will be 0 to <i+1
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    //str string me array ke elements insert krenge and return krwa denge password(str) ko
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange() {
    checkCount = 0;
    //har ek checkbox ko check kro, ki kya wo ticked h ya nhi
    allCheckBox.forEach( (checkbox) => {
        //agar ticked h to checkCount ko increase krdo
        if(checkbox.checked)
            checkCount++;
    });

    //special condition (Edge case)
    //agar password ki length number of boxes ticked s kam h to password ki length ko checkcount k equal krdo
    if(passwordLength < checkCount ) {
        passwordLength = checkCount;
        handleSlider();
    }
}

//checkbox ko click krne pr ye chlega
//for all check boxes one by one
allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})


//jab bhi slider m koi input hoga i.e slider ko slide krenge to slider ki value ko i.e e ko passwrodlength k equal krdenge
//handleSlider() is called to update the passwordLength value
inputSlider.addEventListener('input', (e) => {
    //.value convert krega slider ki value ko interger m
    passwordLength = e.target.value;
    handleSlider();
})


//copy sirf click krne par hoga 
copyBtn.addEventListener('click', () => {
    //copy tabhi hoga, jab passwordDisplay ki koi value hogi
    if(passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener('click', () => {
    //none of the checkbox are selected
    //password generate hi ni hoga
    if(checkCount == 0) 
        return;

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // let's start the jouney to find new password
    console.log("Starting the Journey");
    //remove old password
    password = "";

    let funcArr = [];

    //Function array k ander hum functions insert kr rhe h
    //0th index = generateUpperCase function
    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    //1st index = generateLowerCase function    
    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    //2nd index = generateRandomNumber function
    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    //3rd index = generateSymbol function
    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //compulsory addition -> iska mtlb jo checkbox ticked hoga uska at least 1 character hona chaiye in our password
    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }
    console.log("COmpulsory adddition done");

    //remaining adddition
    //bache hue characters add krenge 
    for(let i=0; i<passwordLength-funcArr.length; i++) {
        let randIndex = getRndInteger(0 , funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("Remaining adddition done");
    
    //shuffle the password -> becz agar nhi krenge to hamesha pswd ka 1st character will be uppercase letter, 2nd will be lowercase letter....and so on
    //isko avoid krne k liye we will shuffle our pswd
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");

    //show in UI
    //placeholder ko replace kr dega password se
    passwordDisplay.value = password;
    console.log("UI adddition done");

    //calculate strength
    calcStrength();
});