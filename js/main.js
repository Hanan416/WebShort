
// imGenerator takes the userInput string
// and generate an image based on the input
function imGenerator (e){
	console.log("start");

	// uncomment to get html content
	var textField = document.getElementById(e);
	var userInput = textField.value;

	// all chars and their image path
	var charToPath = {
		'א' : "Images/alef/alef_",
		'ב' : "Images/bet/bet_",
		'ג' : "Images/gimel/gimel_",
		'ד' : "Images/dalet/dalet_",
		'ה' : "Images/hey/hey_",
		'ו' : "Images/vav/vav_",
		'ז' : "Images/zain/zain_",
		'ח' : "Images/het/het_",
		'ט' : "Images/tet/tet_",
		'י' : "Images/yud/yud_",
		'כ' : "Images/kaf/kaf_",
		'ך' : "Images/kaf sofit/kaf sofit_",
		'ל' : "Images/lamed/lamed_",
		'מ' : "Images/mem/mem_",
		'ם' : "Images/mem sofit/mem sofit_",
		'נ' : "Images/non/non_",
		'ן' : "Images/non sofit/non sofit_",
		'ס' : "Images/samech/samech_",
		'ע' : "Images/ayin/ayin_",
		'פ' : "Images/phe/phe_",
		'ף' : "Images/phe sofit/phe sofit_",
		'צ' : "Images/zadik/zadik_",
		'ץ' : "Images/zadik sofit/zadik sofit_",
		'ק' : "Images/kof/kof_",
		'ר' : "Images/resh/resh_",
		'ש' : "Images/shin/shin_",
		'ת' : "Images/taf/taf_",
		'space' : "Images/space/space.png",
	};


	// letters size
	const srcImWidth = 275;
	const srcImHeight = 275;  // delete this one if symetric

	// Background size
	const bgWidth = 1920;
	const bgHeight = 1080;
	
	var allImages = [setLetterInfo("Images/floor_bg.png", 0,0)];
	var lineStart = bgWidth - srcImWidth - 100;
	var lineEnd = 100;

	var currX = lineStart;
	var currY = 150;
	var imSrc = '';

	// this need to be similar to the number
	// of letters fit inside textArea in html
	var lettersInLine = Math.round(bgWidth/srcImWidth);
	//console.log("lettersInLine = " , lettersInLine);		

	var currWord = [];		// used to collect a complete word and calculate its position
	var currWordLen = 0;

 	console.log(userInput);
	for (var i = 0; i < userInput.length ; i++){
	//	console.log("enter for..");
	//	console.log("currX: ", currX, ", currY: ", currY, ", letter: ", userInput.charAt(i));

		// in this case currWord contain a complete
		// word and needed to insert to allImages
		if (currWordLen <= lettersInLine){
	//		console.log("blah ", currWord);
			if (userInput.charAt(i) === '\n' || userInput.charAt(i) === ' ' || userInput.charAt(i) === '\0'){
			//	console.log("break word");
				currWord = setInMid(currWord, bgWidth, srcImWidth);
				allImages = pushWord(allImages, currWord);
				currWord = [];
				currWordLen = 0;
				currX = lineStart;
				currY = currY + srcImHeight;
			}
			// build a word
			else{
				// checking for valid word length
				if(currWordLen <= lettersInLine){
				//	console.log("building.. ", currWord);
					if(currX > lineEnd){
						imSrc = charToPath[userInput.charAt(i)]; // takes the character path
						currWord.push({src: imSrc, x: currX, y: currY});
						currWordLen++;
						currX = currX - srcImWidth;	
					}
				}
				else{
					console.log("Trying to insert too long word!");
					exit();
					//TODO: add error message
				}
			} // end of word build	
		} 
		else{
			console.log("word too LONG");
			console.log("currWord = ", currWord);
			console.log("allImages = ", allImages);
			exit();
		}
	}
	// push last word
	currWord = setInMid(currWord, bgWidth, srcImWidth);
	allImages = pushWord(allImages, currWord); // push the last word
	console.log("final result:\n",allImages);

	document.getElementById("msg").style.display ="none";
	
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
		
	var imArr = [];

	var bg = new Image(bgWidth, bgHeight);
	bg.src = "./Images/floor_bg.png";
	draw(ctx, bg, 0, 0);
	
		for(var i=1; i < allImages.length ;){
		imArr[i] = new Image();
			//if(animInd < 10)
				imArr[i].src = "./" + allImages[i].src + '000'+'.png';
			/*else if(animInd < 100)
				imArr[i].src = "./" + allImages[i].src + '0'+i+'.png';
			else
				imArr[i].src = "./" + allImages[i].src +i+'.png';
*/
	draw(ctx, imArr[i], allImages[i].x, allImages[i].y);
	i++;	
	}
//	var divHeight = document.getElementById("resIm").offsetHeight;
//	var divWidth = document.getElementById("resIm").offsetWidth;

//	console.log("divHeight = " ,divHeight, "\ndivWidth = ", divWidth);

	console.log("end");
}

function draw(ctx, img, x, y){	
	if(!img.complete){
		setTimeout(function(){
			draw(ctx, img, x, y);
		}, 50);
	}
	ctx.drawImage(img, x, y);
}

function setLetterInfo(pathName, xVal, yVal){
	var temp = {src: pathName, x: xVal, y: yVal};
	return temp;
}

// allImages and currWord is array of maps
function pushWord (allImages, currWord){
	for(var i = 0; i < currWord.length ; i++){
		allImages.push(currWord[i]);
	}
	return allImages;
}

// update the new parametes of the elements
// in currWord. currY should pass updated
function nextLineUpdate (currWord, currY, lineS, srcImWidth){
	for(var i = 0; i < currWord.length ; i++){
		currWord[i].x = lineS - (srcImWidth * i);
		currWord[i].y = currY;
	}
	return currWord;
}


// check the text area for correct input
// i.e. ת-א  or 0-9 or ?!., '\n'
// otherwise cleans the last one
function cleanTA(e){
  var textfield = document.getElementById(e);
  var regex = /[^א-ת \n]/gi;

  if (textfield.value.search(regex) > -1){
    document.getElementById('status').innerHTML = "ניתן לכתוב תוים מהצורה [א-ת 'רווח' 'אנטר']";
    textfield.value = textfield.value.replace(regex, "");
  }
}

function setInMid(currWord, bgWidth, srcImWidth){
	var mid = bgWidth/2; //takes mid of BG
	var startPos = Math.floor(mid + ((currWord.length-1) * srcImWidth * 0.5)); //adds half the wordLen
	console.log("startPos = ", startPos);

	for(var i = 0; i < currWord.length; i++){
		currWord[i].x = startPos;
		startPos = startPos - srcImWidth;
	}
	return currWord;
}