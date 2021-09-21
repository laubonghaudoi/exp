var IMG_PATH =
  "https://www.sas.upenn.edu/~hzen/CrossGist/stimuli_exp1_vsc/";

var IMG_PATH_VCS =
  "https://www.sas.upenn.edu/~hzen/CrossGist/stimuli_exp1_vsc/";

var TURK = 1; // change to 1 when posting on Mturk

var DEBUG = 0; // change to 0 when ready for the real deal

var SANDBOX = 0; // change to 0 when ready for the real deal

var batch = 1; // change to 0 when ready for the real deal

var audioValue = 0;

var condition = getRandomInt(2); //0 = control, 1 = experiment condition
console.log("condition=" + condition);

/* numbers of trials and things */

var currInst = 0; // instruction counter
var currTask = 0; // task counter (input to taskFunctions)
var currTaskCount = 0; // task counter (show to participants)
var currTrial = 0; // trial counter

var currExpoTrial = 0; // exposure trial counter
var currTrainTrial = 0; // trial counter

var currMemoryTrial = 0; // trial counter - memory test
var currDefTestTrial = 0; // trial counter - definition test

var numExpoTrial = 4; //number of exposure trials
var numTrainTrial = 4; //number of training trials

var numTypTest = 2; //number of memory trials
var numMemTest = 16; //number of memory trials
var numDefTest = 4; //number of memory trials

var numTask = 5; //participants' progress

var shape_selection = 10;

var color_selection = 1;

var wordsTrain = []; //words in order for unambiguous training trials; going to be generated later
var wordsTest = []; //words in order for testing trials; going to be generated later

var imagesExpo = []; //4 images
var imagesTrain = []; //4 images
var imagesMemory = [];

var imagesSameUnse = []; //save an exemplar of unselected category in same trials

var imageLoc = new Array(numTrainTrial);

var imgSoundTrain = new Array(numTrainTrial);

for (var i = 0; i < imgSoundTrain.length; i++) {
  imgSoundTrain[i] = new Array(2);
}

var imgSoundTypTest = new Array(numTypTest);
var imgSoundDefTest = new Array(numDefTest);

var expoResponse = []; //to check if their choice in exposure trials are consistent
var trainResponse = [];

var testTypResponse = [];
var testDefResponse = [[], [], []];

var i; // index of which item is being presented

var imageSize = 100; // assumes square. make sure this matches .stim height and width

var boxIdx = ["image1", "image2"]; // indexing to loop over the two images

var startMemoryTestTime;

var iti = 400; // in ms, inter-trial interval

var initVal = "Enter the number you hear";

//preload audioFiles
/*audio related function and files */
var audioFiles = [
  IMG_PATH + "lific.wav",
  IMG_PATH + "tolen.wav",
  IMG_PATH + "77.wav",
  IMG_PATH + "dog.wav",
  IMG_PATH + "cat.wav",
  //'https://www.sas.upenn.edu/~hzen/CrossGist/images/80.mp3'
];
//make and preload all images

var allImages = [
  IMG_PATH_VCS + "500.jpg",
  IMG_PATH + "dog1.jpg",
  IMG_PATH + "bird1.jpg",
  IMG_PATH + "cat1.jpg",
  IMG_PATH + "sheep1.jpg",
  IMG_PATH + "dog2.jpg",
  IMG_PATH + "bird2.jpg",
  IMG_PATH + "cat2.jpg",
  IMG_PATH + "sheep2.jpg",
  IMG_PATH + "tDog.jpg",
  IMG_PATH + "atDog.jpg",
  IMG_PATH + "tCat.jpg",
  IMG_PATH + "atCat.jpg",
  IMG_PATH + "dog3.jpg",
  IMG_PATH + "cat3.jpg",
  IMG_PATH + "horse1.jpg",
  IMG_PATH + "mouse1.jpg",
];

var allImagesTest = [];

/* names of the variables */
var randomOrder = getRandomInt(2);
if (randomOrder == 0) {
  var wordsType = ["same", "switch"];
} else {
  var wordsType = ["switch", "same"];
}

var words = ["lific", "tolen"];
words = Shuffle(words);

var shapeCat = [0, 1];
shapeCat = Shuffle(shapeCat);

var shapeCatOrd = [
  shapeCat[0],
  shapeCat[0] + 2,
  shapeCat[1],
  shapeCat[1] + 2,
];

var step_inc = 16;

//make trials
function makeTrials(
  word,
  trialType,
  shapeCats,
  allImgs,
  expoImgs,
  expoRes1,
  expoRes2
) {
  this.word = word;
  this.trialType = trialType;
  this.shapeCats = shapeCats;
  this.allImgs = allImgs;
  this.expoImgs = expoImgs;
  this.expoRes1 = expoRes1;
  this.expoRes2 = expoRes2;
}

let trial1 = new makeTrials(
  words[0],
  wordsType[0],
  [shapeCat[0], shapeCat[0] + 2],
  [
    [[], []],
    [[], []],
  ],
  [],
  []
);
let trial2 = new makeTrials(
  words[1],
  wordsType[1],
  [shapeCat[1], shapeCat[1] + 2],
  [
    [[], []],
    [[], []],
  ],
  [],
  []
);

var catImages = [[], [], [], []];

var catImagesCatNum = [];

var catImagesColorNum = [[], [], [], []];
//all category images
for (var i = 0; i < 4; i++) {
  var temp_cat = shapeCatOrd[i] * 90 + shape_selection;
  catImagesCatNum.push(temp_cat);

  for (var j = 0; j < 4; j++) {
    var temp_color = shapeCatOrd[i] * 90 + j * step_inc + color_selection; //image index of cat1

    catImagesColorNum[i].push(temp_color);

    name_image = "s" + temp_cat.toString() + "_c" + temp_color.toString();

    catImages[i].push(name_image);
    allImages.push(IMG_PATH_VCS + name_image + ".jpg");
  }
}

function findCat(img) {
  if (img == "500") {
    return 500;
  }

  for (var i = 0; i < 4; i++) {
    var temp = catImages[i].includes(img, 0);

    if (temp == true) {
      return i;
    }
  }
}

//exposure images as well as training images

trial1.allImgs[0][0] = catImages[0].slice(0, 2);
trial1.allImgs[0][0] = Shuffle(trial1.allImgs[0][0]);
trial1.allImgs[0][1] = catImages[1].slice(2, 4);
trial1.allImgs[0][1] = Shuffle(trial1.allImgs[0][1]);
trial1.allImgs[0] = Shuffle(trial1.allImgs[0]);

trial1.allImgs[1][0] = catImages[0].slice(2, 4);
trial1.allImgs[1][0] = Shuffle(trial1.allImgs[1][0]);
trial1.allImgs[1][1] = catImages[1].slice(0, 2);
trial1.allImgs[1][1] = Shuffle(trial1.allImgs[1][1]);
trial1.allImgs[1] = Shuffle(trial1.allImgs[1]);
trial1.allImgs = Shuffle(trial1.allImgs);

trial2.allImgs[0][0] = catImages[2].slice(0, 2);
trial2.allImgs[0][0] = Shuffle(trial2.allImgs[0][0]);
trial2.allImgs[0][1] = catImages[3].slice(2, 4);
trial2.allImgs[0][1] = Shuffle(trial2.allImgs[0][1]);
trial2.allImgs[0] = Shuffle(trial2.allImgs[0]);

trial2.allImgs[1][0] = catImages[2].slice(2, 4);
trial2.allImgs[1][0] = Shuffle(trial2.allImgs[1][0]);
trial2.allImgs[1][1] = catImages[3].slice(0, 2);
trial2.allImgs[1][1] = Shuffle(trial2.allImgs[1][1]);
trial2.allImgs[1] = Shuffle(trial2.allImgs[1]);
trial2.allImgs = Shuffle(trial2.allImgs);

var saveforCurtain = [];

if (condition == 1) {
} else {
  var temp = getRandomInt(2);

  if (trial1.trialType == "switch") {
    imagesMemory.push([trial1.allImgs[0][temp][0], "ExpoUnse_switch"]);
    imagesMemory.push([trial1.allImgs[0][temp][1], "ExpoUnse_switch"]);

    saveforCurtain = trial1.allImgs[0][temp];

    trial1.allImgs[0][temp] = ["500", "500"];
  } else {
    imagesMemory.push([trial2.allImgs[0][temp][0], "ExpoUnse_switch"]);
    imagesMemory.push([trial2.allImgs[0][temp][1], "ExpoUnse_switch"]);

    saveforCurtain = trial2.allImgs[0][temp];

    trial2.allImgs[0][temp] = ["500", "500"];
  }
}

for (var i in allImages) {
  preloadImage(allImages[i]);
}

//insturctions

var welcome =
  "<p>Thank you for participating! <p/> <p>The HIT should take around five minutes to complete. <p/> <p>You will be paid $0.8 upon completion. </p>Please do this HIT in a web browser on a computer screen only (no phones, tablets, etc.). <p>Press CONTINUE to begin.</p>";

var audioInstruction1 =
  "<p>Please turn on your audio. <p/> <p>Type the two-digit number you hear into the box below. <p/> <p>Click *Play Audio* if you would like to hear the number again. </p>Click *Continue* after you enter the two-digit number. The button will work only after you enter your response.";

var audioInstruction2 =
  "<p>Please make sure your audio is turned on. <p/> <p>Type the two-digit number you hear into the box below. <p/> <p>Click *Play Audio* if you would like to hear the number again. </p>Click *Continue* after you enter the two-digit number. The button will work only after you enter your response.";

var startInstruction =
  "<p>Today you will begin working as an assistant in a botanical garden. <p/>In order to do this job, you are going to have to learn to identify the seeds of different plants in the garden. <p> You will be seeing drawings of individual seeds that have been collected in the garden, and you will have to learn the names of these seeds.</p>";

var practiceInstruction =
  "<p>To get started, I want to see if you can guess which names correspond to which types of seeds. <p/><p> Let's practice with animals you are familiar with first. You will see examples of animals and you will see and hear the name of one of them. Click on the animal that is named. <p/> Please try to be consistent with your guesses each time you hear the same name. <p> Click continue to start.</p>";

if (condition == 1) {
  var expoInstruction =
    "<p> Now, you will see examples of seeds and you will see and hear the name of one of them. I want you to guess which seed is named. <p> Just follow your intuition. As we move through this part of your training, you will hear each name more than once. <p> *Again, please try to be consistent with your guesses each time you hear the same name.* <p>Please click continue to start.</p>";
} else if (condition == 0) {
  var expoInstruction =
    "<p> Now, you will see examples of seeds and you will see and hear the name of one of them. Sometimes the seeds will be hidden under a curtain. I want you to guess which seed is named. <p> Just follow your intuition. As we move through this part of your training, you will hear each name more than once. <p> *Again, please try to be consistent with your guesses each time you hear the same name.* <p>Please click continue to start.</p>";
}

var trainInstruction =
  "You are off to a good start in your training for this job. Some of your guesses were wrong and some were right, so now I am going to tell you the correct name for each type of seed. Please click continue to start.";

var testInstruction =
  "Now I want to find out how much you have learned about the different types of seeds in the garden. Again, let's practice with animals first.";

var typInstruction = "Ready for the real test? Click continue.";

var memInstruction =
  "<p>On the next display, I am going to show you a series of seeds, and for each one, tell me whether you have seen that particular seed during your training in the garden. </p><p> Many of the seeds look similar to each other, so I want you to think about just the specific seeds that you have seen in your training today. </p><p>Click continue to start.</p>";

var defInstruction =
  "<p>We are almost done with your job in the botanical garden. </p><p>The last thing I would like you to do is to look at a bunch of different seeds and click on all of the seeds that are associated with the names. </p><p>Again, let's practice with animals first and then we will move on to the seeds. Click continue to start.</p>";

/* show the current trial number out of all trials */

function updateTaskCounter() {
  currTaskCount++;

  tc = document.getElementById("taskCounter");
  tc.innerText = "Section: " + currTaskCount + "/" + numTask;

  $("#taskCounter").show();
}

var taskFunctions = [
  function () {
    createInputElement(condition, "condition"), showInstruct(welcome);
  },
  function () {
    hideVisibleInstructions(), showPreInstructions();
  },

  function () {
    audioTest("77", audioInstruction1);
  },

  function () {
    $("#audioTestBox").hide(),
      createInputElement(audioValue, "audioCheck1"),
      (audioTestBox.value = "");
    showInstruct(startInstruction);
  },

  function () {
    showInstruct(practiceInstruction);
  },
  function () {
    showPracticeTrials();
  },

  function () {
    showInstruct(expoInstruction);
    updateTaskCounter();
  },
  function () {
    generateExpoTrials();
  },
  function () {
    showExpoTrials();
  },

  function () {
    showInstruct(trainInstruction);
    updateTaskCounter();
  },
  function () {
    generateTrainTrials();
    showTrainTrials();
  },

  function () {
    showInstruct(testInstruction);
  },
  function () {
    showPracTypTest();
  },

  function () {
    showInstruct(typInstruction);
    updateTaskCounter();
  },
  function () {
    generateTypTest();
    showTypTestTrials();
  },

  function () {
    showInstruct(memInstruction);
    updateTaskCounter();
  },
  function () {
    generateMemTest();
    showMemoryTrials();
  },

  function () {
    showInstruct(defInstruction);
    updateTaskCounter();
  },
  function () {
    generateDefTest();
    showDefTrials();
  },

  function () {
    postTest();
  },
  function () {
    endExperiment();
  },
];

$(document).ready(function () {
  $("#submitButton").click(function () {
    if ($("#submitButton").is(":hidden")) {
      return false;
    }
    return true;
  });
});

function checkForm(id, buttonID) {
  var getAudioValue = document.getElementById(id).value;
  var cansubmit = getAudioValue.length > 0;

  if (cansubmit > 0) {
    $("#contButton").removeAttr("disabled");
    audioValue = getAudioValue;
  }
}

//functions that help the experiment proceeds
function proceedTask() {
  currTask++;
  taskFunctions[currTask]();
}

function hideAll() {
  $("#practiceImages").hide();
  $("#images").hide();

  $("#preInstructions").hide();

  //$('#taskInstructions').hide();
  $("#taskInstruction").hide();
  $("#trialsInstruct").hide();

  $("#playButton").hide();
  $("#audioTestBox").hide();

  $("#contButton").hide();
  $("#contButtonExpo").hide();

  $("#trainImages").hide();
  $("#testTypImages").hide();
  $("#testDefImages").hide();
  $("#memoryImages").hide();

  $("#demogs").hide();
  $("#feedback").hide();
}

function pairwiseShuf(array) {
  for (let i = 0; i < array.length / 2; i++) {
    temp = Shuffle([array[2 * i], array[2 * i + 1]]);
    array.splice(2 * i, 2, temp[0], temp[1]);
  }

  return array;
}

var wordsTypeExpo;
var words;
var wordsExpo;
//the experiments

var currPracticeProgress = 0;

var imagesPractice = [
  "dog1",
  "bird1",
  "cat1",
  "sheep1",
  "dog2",
  "bird2",
  "cat2",
  "sheep2",
];
imagesPractice = pairwiseShuf(imagesPractice);

var practiceResponse = [];

function showPracticeTrials() {
  if (currPracticeTrial >= numPracticeTrial) {
    console.log("imagesPractice=" + imagesPractice);
    console.log("practiceResponse=" + practiceResponse);
    pass = 0;
    proceedTask();
  } else {
    hideAll();
    showPracticeQuestion();
  }
}
var currPracticeTrial = 0;
var numPracticeTrial = 4;

var wordsPractice = ["dog", "cat", "dog", "cat"];
var pass = 0;

function showPracticeQuestion() {
  if (pass == 2) {
    pass = 0;
    currPracticeTrial++;

    showPracticeTrials();
  } else {
    $("#taskInstruction").hide();
    $("#taskInstructions").show();
    $("#contButtonExpo").hide();
    $("#trialsInstruct").hide();

    enableImageOnclick();

    if (pass == 0) {
      document.getElementById("image5").style.visibility = "visible";
      document.getElementById("image6").style.visibility = "visible";

      /* 1: left */
      boxElem1 = document.getElementById("image5");
      boxElem1.src =
        IMG_PATH + imagesPractice[2 * currPracticeTrial] + ".jpg";

      /* 2: right */
      boxElem2 = document.getElementById("image6");
      boxElem2.src =
        IMG_PATH + imagesPractice[2 * currPracticeTrial + 1] + ".jpg";

      document.getElementById("trialsInstruct").innerHTML =
        "Click on the one you think is a " +
        wordsPractice[currPracticeTrial] +
        ".";

      setTimeout(function () {
        $("#trialsInstruct").show();
      }, iti);
      setTimeout(function () {
        $("#practiceImages").show();
      }, iti);
      setTimeout(function () {
        play(wordsPractice[currPracticeTrial]);
      }, iti);
    } else {
      document.getElementById("trialsInstruct").innerHTML =
        "Now click on the other option that you did not choose.";
      $("#trialsInstruct").show();
    }

    pass++;
  }
}

/////EXPOSURE TRIALS/////

function generateExpoTrials() {
  $("#contButton").hide();

  pass = 0;

  wordsTypeExpo = wordsType.concat(wordsType);
  console.log("wordsTypeExpo=" + wordsTypeExpo);

  wordsExpo = words.concat(words);
  console.log("wordsExpo=" + wordsExpo);

  for (let i = 0; i < 2; i++) {
    imagesExpo.push(trial1.allImgs[0][0][i]);
    imagesExpo.push(trial1.allImgs[0][1][i]);
    imagesExpo.push(trial2.allImgs[0][0][i]);
    imagesExpo.push(trial2.allImgs[0][1][i]);
  }

  imagesExpo = pairwiseShuf(imagesExpo); //left right randomization

  for (let i = 0; i < 2; i++) {
    imagesTrain.push(trial1.allImgs[1][0][i]);
    imagesTrain.push(trial1.allImgs[1][1][i]);
    imagesTrain.push(trial2.allImgs[1][0][i]);
    imagesTrain.push(trial2.allImgs[1][1][i]);
  }

  imagesTrain = pairwiseShuf(imagesTrain); //left right randomization

  proceedTask();
}

var currExpoProgress = 0;

function showExpoTrials() {
  if (currExpoTrial >= numExpoTrial) {
    console.log("imagesExpo=" + imagesExpo);
    console.log("expoResponse=" + expoResponse);
    proceedTask();
  } else {
    hideAll();
    showExpoQuestion();
  }
}

function showExpoQuestion() {
  if (pass == 2) {
    pass = 0;
    currExpoTrial++;

    showExpoTrials();
  } else {
    $("#taskInstruction").hide();
    $("#taskInstructions").show();
    $("#contButtonExpo").hide();
    $("#trialsInstruct").hide();

    enableImageOnclick();

    if (pass == 0) {
      document.getElementById("image1").style.visibility = "visible";
      document.getElementById("image2").style.visibility = "visible";

      /* 1: left */
      boxElem1 = document.getElementById("image1");
      boxElem1.src =
        IMG_PATH_VCS + imagesExpo[2 * currExpoTrial] + ".jpg";

      /* 2: right */
      boxElem2 = document.getElementById("image2");
      boxElem2.src =
        IMG_PATH_VCS + imagesExpo[2 * currExpoTrial + 1] + ".jpg";

      if (
        imagesExpo[2 * currExpoTrial] == "500" ||
        imagesExpo[2 * currExpoTrial + 1] == "500"
      ) {
        document.getElementById("trialsInstruct").innerHTML =
          "Click on the one you think is a " +
          wordsExpo[currExpoTrial] +
          ". It may be the seed that is shown to you or the seed hidden behind the curtain.";
      } else {
        document.getElementById("trialsInstruct").innerHTML =
          "Click on the one you think is a " +
          wordsExpo[currExpoTrial] +
          ".";
      }

      setTimeout(function () {
        $("#trialsInstruct").show();
      }, iti);
      setTimeout(function () {
        $("#images").show();
      }, iti);
      setTimeout(function () {
        play(wordsExpo[currExpoTrial]);
      }, iti);
    } else {
      document.getElementById("trialsInstruct").innerHTML =
        "Now click on the other option that you did not choose.";
      //setTimeout(function () {$('#images').show();}, iti);
      //$('#images').show();
      //setTimeout(function () {$('#trialsInstruct').show();}, iti);
      $("#trialsInstruct").show();
    }

    //$('#trialsInstruct').hide();
    pass++;
  }
}

function disableImageOnclick() {
  document.getElementById("image1").onclick = null;
  document.getElementById("image2").onclick = null;
  document.getElementById("image5").onclick = null;
  document.getElementById("image6").onclick = null;
}

function enableImageOnclick() {
  document.getElementById("image1").onclick = function () {
    recordResponses(1);
  };
  document.getElementById("image2").onclick = function () {
    recordResponses(2);
  };
  document.getElementById("image5").onclick = function () {
    recordResponses(5);
  };
  document.getElementById("image6").onclick = function () {
    recordResponses(6);
  };
}

function recordResponses(id) {
  // incomplete
  disableImageOnclick();
  //$('#images').hide();
  $("#trialsInstruct").hide();

  /* record chosen image */

  if (pass == 1) {
    //pass already ++ after running showExpoQuestion -  target trial with word

    if (id == 5) {
      practiceResponse.push(imagesPractice[2 * currPracticeTrial]);
      document.getElementById("image5").style.border = "2px solid red";
      currPracticeProgress++;
      setTimeout(function () {
        showPracticeQuestion();
      }, iti);
    } else if (id == 6) {
      practiceResponse.push(imagesPractice[2 * currPracticeTrial + 1]);
      document.getElementById("image6").style.border = "2px solid red";
      currPracticeProgress++;
      setTimeout(function () {
        showPracticeQuestion();
      }, iti);
    }

    //expo responses
    else if (wordsTypeExpo[currExpoTrial] == "same" && id == 1) {
      expoResponse.push(imagesExpo[2 * currExpoTrial]);

      imagesMemory.push([imagesExpo[2 * currExpoTrial], "ExpoSele_same"]);
      imagesMemory.push([
        imagesExpo[2 * currExpoTrial + 1],
        "ExpoUnse_same",
      ]);

      imagesSameUnse.push(imagesExpo[2 * currExpoTrial + 1]);

      document.getElementById("image1").style.border = "2px solid red";

      currExpoProgress++;

      //hideAll();
      setTimeout(function () {
        showExpoQuestion();
      }, iti);
    } else if (wordsTypeExpo[currExpoTrial] == "same" && id == 2) {
      expoResponse.push(imagesExpo[2 * currExpoTrial + 1]);

      imagesMemory.push([
        imagesExpo[2 * currExpoTrial + 1],
        "ExpoSele_same",
      ]);
      imagesMemory.push([imagesExpo[2 * currExpoTrial], "ExpoUnse_same"]);

      imagesSameUnse.push(imagesExpo[2 * currExpoTrial]);

      document.getElementById("image2").style.border = "2px solid red";

      currExpoProgress++;
      //hideAll();
      setTimeout(function () {
        showExpoQuestion();
      }, iti);
    } else if (wordsTypeExpo[currExpoTrial] == "switch" && id == 1) {
      expoResponse.push(imagesExpo[2 * currExpoTrial]);

      imagesMemory.push([
        imagesExpo[2 * currExpoTrial],
        "ExpoSele_switch",
      ]);
      imagesMemory.push([
        imagesExpo[2 * currExpoTrial + 1],
        "ExpoUnse_switch",
      ]);

      document.getElementById("image1").style.border = "2px solid red";

      currExpoProgress++;
      //hideAll();
      setTimeout(function () {
        showExpoQuestion();
      }, iti);
      //train responses
    } else if (wordsTypeExpo[currExpoTrial] == "switch" && id == 2) {
      expoResponse.push(imagesExpo[2 * currExpoTrial + 1]);

      imagesMemory.push([
        imagesExpo[2 * currExpoTrial + 1],
        "ExpoSele_switch",
      ]);
      imagesMemory.push([
        imagesExpo[2 * currExpoTrial],
        "ExpoUnse_switch",
      ]);

      document.getElementById("image2").style.border = "2px solid red";

      currExpoProgress++;
      //hideAll();
      setTimeout(function () {
        showExpoQuestion();
      }, iti);
    }
  } else {
    //expo responses
    if (id == 1 || id == 2) {
      document.getElementById("image1").style.border = "";
      document.getElementById("image2").style.border = "";
      currExpoProgress++;
      hideAll();
      setTimeout(function () {
        showExpoQuestion();
      }, iti);
    } else if (id == 5 || id == 6) {
      document.getElementById("image5").style.border = "";
      document.getElementById("image6").style.border = "";
      currPracticeProgress++;
      hideAll();
      setTimeout(function () {
        showPracticeQuestion();
      }, iti);
    }
  }
}

function generateTrainTrials() {
  for (let i = 0; i < 2; i++) {
    if (expoResponse[i] == "500") {
      imagesTrain = imagesTrain.filter(
        (item) => !(findCat(item) == findCat(saveforCurtain[0]))
      );
    } else {
      if (wordsType[i] == "switch") {
        imagesTrain = imagesTrain.filter(
          (item) => !(findCat(item) == findCat(expoResponse[i]))
        );
      } else if (wordsType[i] == "same") {
        imagesTrain = imagesTrain.filter(
          (item) => !(findCat(item) == findCat(imagesSameUnse[0]))
        );
      }
    }
  }
}

function showTrainTrials() {
  if (currTrainTrial >= numTrainTrial) {
    console.log("imagesTrain=" + imagesTrain);
    console.log("trainResponse=" + trainResponse);
    proceedTask();
  } else {
    hideAll();

    var expoCor;

    if (currTrainTrial < 2) {
      if (wordsType[currTrainTrial] == "same") {
        expoCor = "correct";
      } else {
        expoCor = "wrong";
      }

      document.getElementById("trialsInstruct").innerHTML =
        "Your guess about which seeds were examples of a " +
        wordsExpo[currTrainTrial] +
        " was " +
        expoCor +
        ". This is a " +
        wordsExpo[currTrainTrial] +
        ". Click on it to proceed.";
    } else {
      document.getElementById("trialsInstruct").innerHTML =
        "This is another " +
        wordsExpo[currTrainTrial] +
        ". Click on it to proceed.";
    }

    //add training images to memory test

    if (wordsTypeExpo[currTrainTrial] == "same") {
      imagesMemory.push([imagesTrain[currTrainTrial], "training_same"]);
    } else if (wordsTypeExpo[currTrainTrial] == "switch") {
      imagesMemory.push([imagesTrain[currTrainTrial], "training_switch"]);
    }

    /* train center image */
    imageLoc = getRandomInt(6) + 1;
    boxElem = document.getElementById("imageTrain" + imageLoc);
    boxElem.src = IMG_PATH_VCS + imagesTrain[currTrainTrial] + ".jpg";

    $("#taskInstructions").show();
    setTimeout(function () {
      $("#trainImages").show();
    }, iti);
    setTimeout(function () {
      $("#trialsInstruct").show();
    }, iti);
    setTimeout(function () {
      play(wordsExpo[currTrainTrial]);
    }, iti);

    startTrainTrialTime = new Date();
    $("#contButton").hide();
  }
}

function recordTrainResponses(id, imageLoc) {
  $("#trainImages").hide();
  $("#trialsInstruct").hide();

  if (id == imageLoc) {
    //when participants click the image

    trainResponse.push(imagesTrain[currTrainTrial]);
  } else {
    trainResponse.push(0);
  }

  var curTrainTime = new Date();

  createInputElement(
    curTrainTime - startTrainTrialTime,
    "trial" + currTrial + "_rt"
  );

  boxElem.src =
    "https://www.sas.upenn.edu/~hzen/CrossGist/images/white.jpg";

  currTrainTrial++;
  setTimeout(function () {
    showTrainTrials();
  }, iti);
}

var currPracTypTest = 0;
var numPracTypTest = 2;

var imagesPracTypTest = pairwiseShuf(["tDog", "atDog", "tCat", "atCat"]);
var testTypResponse = [];

var practiceWords = ["dog", "cat"];

//practice typical test
function showPracTypTest() {
  if (currPracTypTest >= numPracTypTest) {
    console.log("imagesTypTest=" + imagesTypTest);
    console.log("testTypResponse=" + testTypResponse);
    hideAll();
    proceedTask();
  } else {
    hideAll();
    document.getElementById("trialsInstruct").innerHTML =
      "Which of these seems to you to be the most typical " +
      practiceWords[currPracTypTest] +
      "? You can only select one.";

    /* 1: left */
    boxElem1 = document.getElementById("testTypPracImage1");
    boxElem1.src =
      IMG_PATH + imagesPracTypTest[2 * currPracTypTest] + ".jpg";

    /* 2: right */
    boxElem2 = document.getElementById("testTypPracImage2");
    boxElem2.src =
      IMG_PATH + imagesPracTypTest[2 * currPracTypTest + 1] + ".jpg";

    setTimeout(function () {
      $("#trialsInstruct").show();
    }, iti);
    setTimeout(function () {
      $("#testTypPracImages").show();
      $("#trialsInstruct").show();
    }, iti);
    setTimeout(function () {
      play(practiceWords[currPracTypTest]);
    }, iti);

    $("#contButton").hide();
  }
}

function recordTypPracResponses(id) {
  $("#testTypPracImages").hide();
  $("#trialsInstruct").hide();

  if (id == 1) {
    testTypResponse.push(imagesPracTypTest[2 * currPracTypTest]);
    currPracTypTest++;
    showPracTypTest();
  } else if (id == 2) {
    testTypResponse.push(imagesPracTypTest[2 * currPracTypTest + 1]);
    currPracTypTest++;
    showPracTypTest();
  }
}

//typical test
var imagesTypTest = [];

function generateTypTest() {
  for (let i = 0; i < 2; i++) {
    var avgAllTempColor =
      catImagesColorNum[findCat(imagesTrain[i])].reduce(
        (a, b) => a + b,
        0
      ) / catImagesColorNum.length;
    var avgTwoTempColor =
      (parseInt(imagesTrain[i].split("c").pop()) +
        parseInt(imagesTrain[i + 2].split("c").pop())) /
      2;

    imagesTypTest.push(
      "s" +
        catImagesCatNum[findCat(imagesTrain[i])].toString() +
        "_c" +
        avgAllTempColor.toString()
    );
    imagesTypTest.push(
      "s" +
        catImagesCatNum[findCat(imagesTrain[i])].toString() +
        "_c" +
        avgTwoTempColor.toString()
    );
  }

  imagesTypTest = pairwiseShuf(imagesTypTest);
}

var currTypTest = 0; // trial counter - typical test

function showTypTestTrials() {
  if (currTypTest >= numTypTest) {
    console.log("imagesTypTest=" + imagesTypTest);
    console.log("testTypResponse=" + testTypResponse);

    hideAll();
    proceedTask();
  } else {
    hideAll();
    document.getElementById("trialsInstruct").innerHTML =
      "Which of these seems to you to be the most typical " +
      words[currTypTest] +
      "? You can only select one.";

    /* 1: left */
    boxElem1 = document.getElementById("testTypImage1");
    boxElem1.src = IMG_PATH_VCS + imagesTypTest[2 * currTypTest] + ".jpg";

    /* 2: right */
    boxElem2 = document.getElementById("testTypImage2");
    boxElem2.src =
      IMG_PATH_VCS + imagesTypTest[2 * currTypTest + 1] + ".jpg";

    setTimeout(function () {
      $("#trialsInstruct").show();
    }, iti);
    setTimeout(function () {
      $("#testTypImages").show();
      $("#trialsInstruct").show();
    }, iti);
    setTimeout(function () {
      play(words[currTypTest]);
    }, iti);

    startTestTrialTime = new Date();

    $("#contButton").hide();
  }
}

function recordTypTestResponses(id) {
  $("#testImages").hide();
  $("#trialsInstruct").hide();

  if (id == 1) {
    testTypResponse.push(imagesTypTest[2 * currTypTest]);
    currTypTest++;
    showTypTestTrials();
    console.log(imagesTypTest[2 * currTypTest]);
  } else if (id == 2) {
    testTypResponse.push(imagesTypTest[2 * currTypTest + 1]);
    currTypTest++;
    showTypTestTrials();
    console.log(imagesTypTest[2 * currTypTest + 1]);
  }
}

//memory test

function generateMemTest() {
  var temp = catImages[findCat(imagesSameUnse[0])].filter(
    (item) => findCat(item) == findCat(imagesSameUnse[0])
  );

  temp = temp.filter((item) => !(imagesSameUnse.includes(item) == true));

  //unseen exemplars were exemplars from same - unselected category which were never shown to participants
  imagesMemory.push([temp[0], "unseen"]);
  imagesMemory.push([temp[1], "unseen"]);

  imagesMemory.push(["seed", "check"]);
  imagesMemory.push(["seed2", "check"]);

  imagesMemory = imagesMemory.filter((item) => !item.includes("500"));

  imagesMemory = Shuffle(imagesMemory);

  console.log("imagesMemory=" + imagesMemory);
  //if (Math.abs(temp[0]-imagesSameUnse[0]) >=  Math.abs(temp[1]-imagesSameUnse[0])) {
  //}
}

function showMemoryTrials() {
  hideAll();

  if (currMemoryTrial >= numMemTest) {
    proceedTask();
  } else {
    document.getElementById("trialsInstruct").innerHTML =
      "Do you remember seeing this particular seed during your training in the garden?";
    $("#taskInstructions").show();

    var boxElem = document.getElementById("image");

    if (
      imagesMemory[currMemoryTrial][0] == "seed" ||
      imagesMemory[currMemoryTrial][0] == "seed2"
    ) {
      boxElem.src = IMG_PATH + imagesMemory[currMemoryTrial][0] + ".jpg";
    } else {
      boxElem.src =
        IMG_PATH_VCS + imagesMemory[currMemoryTrial][0] + ".jpg";
    }

    setTimeout(function () {
      $("#yesButton").show();
    }, iti);
    setTimeout(function () {
      $("#noButton").show();
    }, iti);
    setTimeout(function () {
      $("#memoryImages").show();
    }, iti);
    setTimeout(function () {
      $("#trialsInstruct").show();
    }, iti);
  }
}

var testMemResponse = [];

function recordYes() {
  currMemoryTrial++;
  createInputElement(1, "memoryTest" + currMemoryTrial + "_resp");

  testMemResponse.push(1);
  $("#trialsInstruct").hide();
  $("#yesButton").hide();
  $("#noButton").hide();
  $("#memoryImages").hide();
  setTimeout(function () {
    showMemoryTrials();
  }, iti);
}

function recordNo() {
  currMemoryTrial++;
  createInputElement(0, "memoryTest" + currMemoryTrial + "_resp");

  testMemResponse.push(0);

  $("#trialsInstruct").hide();
  $("#yesButton").hide();
  $("#noButton").hide();
  $("#memoryImages").hide();

  setTimeout(function () {
    showMemoryTrials();
  }, iti);
}

/////definiton task

var imagesDefTest = [[], []];

function generateDefTest() {
  for (let i = 0; i < 2; i++) {
    if (wordsType[i] == "same") {
      imagesDefTest[i] = imagesDefTest[i].concat(imagesSameUnse);
      imagesDefTest[i] = imagesDefTest[i].concat([
        imagesTrain[i],
        imagesTrain[i + 2],
      ]);
    } else {
      //find selected switch expo exemplars
      //var temp = imagesMemory.filter(item => (item.includes("ExpoSele_switch") == true )) ;
      var imagesSele_switch = [];

      imagesSele_switch.push(expoResponse[i]);
      imagesSele_switch.push(expoResponse[i + 2]);

      if (imagesSele_switch.includes("500")) {
        imagesDefTest[i] = imagesDefTest[i].concat(saveforCurtain);
        imagesDefTest[i] = imagesDefTest[i].concat([
          imagesTrain[i],
          imagesTrain[i + 2],
        ]);
      } else {
        imagesDefTest[i] = imagesDefTest[i].concat(imagesSele_switch);
        imagesDefTest[i] = imagesDefTest[i].concat([
          imagesTrain[i],
          imagesTrain[i + 2],
        ]);
      }
    }

    imagesDefTest[i] = Shuffle(imagesDefTest[i]);
  }

  imagesDefTest.unshift(Shuffle(["dog3", "cat3", "horse1", "mouse1"]));
  imagesDefTest.unshift(["dog1", "dog2", "bird1", "bird2"]);
}

var numDefImage = 4;

var wordsDef = ["dog"].concat(words);

wordsDef = ["dog"].concat(wordsDef);

function showDefTrials() {
  hideAll();

  if (currDefTestTrial >= numDefTest) {
    console.log("imagesDefTest=" + imagesDefTest);
    console.log("testDefResponse=" + testDefResponse);
    currTask++;
    $("#testDefImages").hide();
    $("#nextButton").hide();
    taskFunctions[currTask]();
  } else {
    if (numDefImage == 4) {
      document.getElementById("testDefImage1").style.border = "";
      document.getElementById("testDefImage2").style.border = "";
      document.getElementById("testDefImage3").style.border = "";
      document.getElementById("testDefImage4").style.border = "";

      document.getElementById("testDefImages").style.visibility =
        "visible";

      /* 1 */
      boxElem1 = document.getElementById("testDefImage1");
      boxElem1.src =
        IMG_PATH_VCS + imagesDefTest[currDefTestTrial][0] + ".jpg";

      /* 2 */
      boxElem2 = document.getElementById("testDefImage2");
      boxElem2.src =
        IMG_PATH_VCS + imagesDefTest[currDefTestTrial][1] + ".jpg";

      /* 3 */
      boxElem3 = document.getElementById("testDefImage3");
      boxElem3.src =
        IMG_PATH_VCS + imagesDefTest[currDefTestTrial][2] + ".jpg";

      /* 4 */
      boxElem4 = document.getElementById("testDefImage4");
      boxElem4.src =
        IMG_PATH_VCS + imagesDefTest[currDefTestTrial][3] + ".jpg";

      document.getElementById("testDefImage1").style.visibility =
        "visible";
      document.getElementById("testDefImage2").style.visibility =
        "visible";
      document.getElementById("testDefImage3").style.visibility =
        "visible";
      document.getElementById("testDefImage4").style.visibility =
        "visible";
    }

    setTimeout(function () {
      $("#testDefImages").show();
    }, iti);

    if (currDefTestTrial <= 1) {
      document.getElementById("trialsInstruct").innerHTML =
        "Click on *ALL* of the animals that are examples of " +
        wordsDef[currDefTestTrial] +
        ". The ones you click on will be indicated by red square. Click 'Next' to finalize your response and continue to the real task.";
    } else {
      document.getElementById("trialsInstruct").innerHTML =
        "Click on *ALL* of the seeds that are examples of " +
        wordsDef[currDefTestTrial] +
        ". The ones you click on will be indicated by red square. Click 'Next' to finalize your response and continue to the next task.";
    }

    setTimeout(function () {
      $("#taskInstructions").show();
    }, iti);
    setTimeout(function () {
      $("#trialsInstruct").show();
    }, iti);
    setTimeout(function () {
      play(wordsDef[currDefTestTrial]);
    }, iti);
    setTimeout(function () {
      $("#nextButton").show();
    }, iti);
  }
}

function updateDefCount() {
  currDefTestTrial++;
  numDefImage = 4;

  setTimeout(function () {
    showDefTrials();
  }, iti);
}

function recordDefTestResponses(id) {
  if (
    document.getElementById("testDefImage" + id.toString()).style
      .border == ""
  ) {
    document.getElementById("testDefImage" + id.toString()).style.border =
      "2px solid red";
    testDefResponse[currDefTestTrial].push(
      imagesDefTest[currDefTestTrial][id - 1]
    );
    var numDefImage = numDefImage - 1;
  } else {
    //(document.getElementById("testDefImage" + id.toString()).style.border == "2px solid red") {
    document.getElementById("testDefImage" + id.toString()).style.border =
      "";
    testDefResponse[currDefTestTrial] = testDefResponse[
      currDefTestTrial
    ].filter(function (value, index, arr) {
      return value != imagesDefTest[currDefTestTrial][id - 1];
    });
  }

  //document.getElementById("testDefImage" + id.toString()).style.visibility = "hidden";
}

function postTest() {
  hideAll();

  $("#taskCounter").hide();
  $("#demogs").show();
  $("#feedback").show();

  currTask++;

  $("#contButton").show();
  $("#contButton").attr("disabled", true);
}

function recordArray(arrayData, arrayName) {
  for (i = 1; i < arrayData.length + 1; i++) {
    createInputElement(arrayData[i - 1], arrayName + i);
  }
}

function endExperiment() {
  hideVisibleInstructions();

  //record the trial orders

  recordArray(imagesPractice, "practiceImages");

  recordArray(practiceResponse, "practiceResponse");

  recordArray(imagesExpo, "expoImages");

  recordArray(expoResponse, "expoResponse");

  recordArray(imagesTrain, "trainImages");

  recordArray(trainResponse, "trainResponse");

  recordArray(imagesTypTest, "typTestImages");

  recordArray(testTypResponse, "typTestResponse");

  recordArray(imagesMemory, "memoryImages");

  recordArray(testMemResponse, "memTestResponse");

  recordArray(imagesDefTest, "imagesDefTest");

  recordArray(testDefResponse[0], "testDefPracResponse");

  recordArray(testDefResponse[1], "testDefResponse_1_");

  recordArray(testDefResponse[2], "testDefResponse_2_");

  recordArray(wordsType, "testTrialType");

  recordArray(words, "words");

  recordArray(catImages, "catImages");

  console.log(responses);

  $("#contButton").hide();

  document.getElementById("trialsInstruct").innerHTML =
    "You are done! Thank you for participating! Please click *Submit* to finish your HIT.";
  $("#trialsInstruct").show();

  $("#contButton").hide();

  $("#submitButton").show();

  if (TURK == 1) {
    $("#submitButton").show();
  }
}

checkHitAccepted();
