var signUpForm = document.getElementById("sign-up-form");
var logInForm = document.getElementById("log-in-form");
var loginButton = document.getElementById("log-in-button");
var signUpButton = document.getElementById("sign-up-button");
var createAccountButton = document.getElementById("create-account-button");
var authBox = document.getElementById("auth-box");
var myTasksHeader = document.getElementById("my-tasks-header");
var taskArchiveHeader = document.getElementById("task-archive-header");
var listHeading = document.getElementById("list-heading");
var taskItems = document.getElementById("tasks");
var myTasksButton = document.getElementById("my-tasks-button");
var viewTaskArchiveButton = document.getElementById("view-task-archive-button");
var saveChangesButton = document.getElementById("save-changes-button");
var showArchiveButton = document.getElementById("archive-completed-button");
var archiveCompletedButton = document.getElementById("archive-completed-button");
var saveButton = document.getElementById("save-changes-button");
var taskArchiveButton = document.getElementById("view-task-archive-button");
var archiveWrapper = document.getElementById("archive-wrapper");
var archiveBox = document.getElementById("archive-box");
var archiveListHeading = document.getElementById("archive-list-heading");
var captchaForm= document.getElementById("verification-code-form");
var verificationFields = document.getElementById("verification-fields");
var sendCodeButton = document.getElementById("send-code-button");
var verifyCodeButton = document.getElementById("verify-code-button");
var verifiedBlock = document.getElementById("verified-block");
var codeVerifier = document.getElementById('code-verifier');
var verCodeInput = document.getElementById('verification-code-input');
var monthsWith31Days = ["01","03","05","07","08","10","12"];
var monthsWith30Days = ["04","06","09","11"];  
var sentCode = "";
var currentTime = "";
var currentDate = "";
var currentDateAndTime = "";

var convertFromMilitaryToStd = function (fourDigitTime){
    var hours24 = parseInt(fourDigitTime.substring(0,2));
    var hours = ((hours24 + 11) % 12) + 1;
    var amPm = hours24 > 11 ? 'pm' : 'am';
    var minutes = fourDigitTime.substring(2);

    return hours + minutes + amPm;
};



function showSignUpForm(){

    signUpButton.style.setProperty("display","none");
    createAccountButton.style.setProperty("display","none");
    loginButton.style.setProperty("display","none");
    authBox.style.setProperty("display","block");
    signUpForm.style.setProperty("display","block");
    
}

function showLoginForm(){
    signUpButton.style.setProperty("display","none");
    loginButton.style.setProperty("display","none");
    authBox.style.setProperty("display","block");
    logInForm.style.setProperty("display","block");
}

function createNewAccount(){
        var email = document.getElementById("sign-up-email").value;
        var password = document.getElementById("sign-up-password").value;     
        firebase.auth().createUserWithEmailAndPassword(email, password,).then(function(){
            writeUserData();
            }).catch(function(error) {
            alert(error.message);
            });
}
       

function loginToExistingAccount(){

        var email = document.getElementById("login-email").value;
        var password = document.getElementById("login-password").value;
        firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
        window.location.href = "dashboard.html";
        }).catch(function(error) {
        alert(error.message);
        });
}

function cancel(){
    location.reload();
}

function logOutUser(){

    firebase.auth().signOut().then(function() {
          window.location.href = "index.html";
      }).catch(function(error) {
            alert(error);
        });
 }

 function setUserName(un,pp){

    var user = firebase.auth().currentUser;

    user.updateProfile({

        displayName: un,
        photoURL: pp.name,

        }).then(function() {
        var userName = document.getElementById("sign-up-username").value;
        var number = document.getElementById("sign-up-number").value;
        saveNumber(userName,number);
        }).catch(function(error) {
            alert(error);
        });

}

function savePic(un,pp){

    storageRef.child(`images/${un}/${pp.name}`).put(pp); 

}

function saveNumber(un,pn){

    var dbPath = firebase.database().ref(`usernames/${un}`);
        dbPath.set({
        number: pn
        }).then(()=>{
            window.location.href = "dashboard.html";
        });
}

 function writeUserData(){

    var userName = document.getElementById("sign-up-username").value;
    var profilePic = document.getElementById("sign-up-pic").files[0];
    savePic(userName,profilePic);
    setUserName(userName,profilePic);
}

function renderAccount(){

firebase.auth().onAuthStateChanged(function(user){
    if(user == null){
        window.location.href = "index.html";
    }else{
            listenForAddedTasks(user);
            var userName = user.displayName;
            var profilePic = user.photoURL;
            const storageService = firebase.storage();
            const storageRef = storageService.ref();
            storageRef.child(`images/${userName}/${profilePic}`).getDownloadURL().then(function(url){
                document.querySelector('img').src = url;
            }).catch(function(error){
                alert(error);
            });
            var greeting = document.getElementById("greeting");
            greeting.innerHTML = `Welcome back<br> ${userName}!`;

    };
});
}


function addTask(){

    var task = document.getElementById("task").value;
    var dueDate = document.getElementById("due-date").value;
    var time = document.getElementById("time").value;
    var alertFrequency = document.getElementById("alert-frequency").value;
    var year = parseInt(dueDate.substring(0,4));
    var month = parseInt(dueDate.substring(5,7))
    var day = parseInt(dueDate.slice(8));
    var minutes = parseInt(time.slice(3));
    var hour = parseInt(time.substring(0,3));  
    var now = new Date();
    var d = now.getDate();
    var y = now.getFullYear();
    var m = now.getMonth()+1;

    if(m < 10){
        m = `0${m}`;
    }
    if(d < 10){
        d = `0${d}`;
    }

    yr = dueDate.split('-')[0];
    mth = dueDate.split('-')[1];
    dy = dueDate.split('-')[2];
    var dateSelected = parseInt(`${yr}${mth}${dy}`);
    var todaysDate = parseInt(`${y}${m}${d}`);

    if(dateSelected < todaysDate){
        alert("date cannot be in the past");
        return;
    }

function formatAlert(){

    if(alertFrequency == "1 Day prior"){

        day -= 1;

        if(day < 10 && day != 0){
            day =`0${day.toString()}`;
        }
        
        function handle0edgecase(){

            if(month < 10){
            month = `0${month.toString()}`;
            }
            if(month >= 10){
            month = month.toString();
            }

            month = parseInt(month) - 1;

            if(month < 10){
                month = `0${month.toString()}`;
            }
            if(month <= 10){
                month = month.toString();
            }
            if(month == 0){
                month = "12";
                year -= 1;
            }
            


            var isMoWith30days = monthsWith30Days.find(function(mo){
                return month == mo;
            });
    
            var isMoWith31Days = monthsWith31Days.find(function(mo){
                return month == mo;
            });


            if((isMoWith30days == undefined) && (isMoWith31Days == undefined)){
                day = "28";
                return;
            }
            if(isMoWith31Days !== undefined){
                day = "31";
                return;
            }
            if(isMoWith30days !== undefined){
                day = "30";
                return;
            }

        }

        if(day == 0){
            handle0edgecase();
        }

        if(day >= 10){
            day = day.toString();
        }

        
        return `${year.toString()}-${month}-${day} @${convertFromMilitaryToStd(time)}`;

    }else if(alertFrequency  == "1 Hour prior"){

        hour -= 1;
        
        if(hour == 0){
            hour = hour.toString();
            hour = "12";
        }
        if((hour > 0) && (hour < 10)){
            hour = `0${hour.toString()}`;
        }
        if(hour > 10){
            hour = hour.toString();
        }
       
        return `${dueDate} @${convertFromMilitaryToStd(`${hour}:${minutes}`)}`;

    }else if(alertFrequency == "30 min prior"){

        minutes -= 30;
        if(minutes < 0){
            minutes += 60;
            hour -= 1;
            minutes = minutes.toString();
        }else if(minutes == 0 ){
            minutes = `0${minutes.toString()}`;
        }else if((minutes > 0) && (minutes <10)){
            minutes = `0${minutes.toString()}`;
        }
        return `${dueDate} at ${convertFromMilitaryToStd(`${hour.toString()}:${minutes}`)}`;
    }else if(alertFrequency == "1 min prior"){

        minutes -= 1;

        if(minutes < 0){
            minutes += 60;
            hour -= 1;
            minutes = minutes.toString();
        }else if(minutes == 0){
            minutes = `0${minutes.toString()}`;
        }else if((minutes > 0) && (minutes < 10)){
            minutes = `0${minutes.toString()}`;
        }else if((minutes > 0) && (minutes > 10)){
            minutes = `${minutes.toString()}`;
        }

        if(hour == 0){
            hour = hour.toString();
            hour = "12";   
        }
        if((hour > 0) && (hour < 10)){
            hour = `0${hour.toString()}`;
        }
        if(hour > 10){
            hour = hour.toString();
        }

        return `${dueDate} @${convertFromMilitaryToStd(`${hour}:${minutes}`)}`;
    }
}



    if(task == "" || dueDate == "" || alertFrequency == "" || time == ""){
        alert("all fields are required to add task");
    }else{
        var dateAndTimeToAlert = formatAlert();
        var user = firebase.auth().currentUser;
        firebase.database().ref(`usernames/${user.displayName}/tasks/${task}`).set({
            Task:task,
            DueDate:dueDate,
            Time:time,
            AlertFrequency:dateAndTimeToAlert,
            
        });
        window.location.href = "dashboard.html";
    }
}

function listenForAddedTasks(user){
    
    var tasksBox = document.getElementById("tasks");
    var tasks = "";
    var path = `usernames/${user.displayName}/tasks/`;
    var dbTasks = firebase.database().ref(path);
    

    while(tasksBox.firstChild){
        tasksBox.removeChild(tasksBox.firstChild);
    }

    dbTasks.on('value',function(snapshot){

    snapshot.forEach(function(task){
        var toDoItem = task.val().Task;
        var dueDate = task.val().DueDate;
        var time = task.val().Time;
        var alertFrequency = task.val().AlertFrequency;

        tasks += `<div class="row rendered-list">
                    <input onchange = "showSaveButton()" id = "to-do-item" type="text" value = "${toDoItem}" >
                    <input onchange = "showSaveButton()" id = "to-do-date" type="date" value = "${dueDate}" min="2018-12-01">
                    <input onchange = "showSaveButton()" id = "to-do-time" type="time" value = "${time}">
                    <select onchange = "showSaveButton()" required="true" name="alert-frequency-set" id="alert-frequency-set">
                    <option>${alertFrequency}</option>
                    <option>1 Day prior</option>
                    <option>1 Hour prior</option>
                    <option>30 min prior</option>
                    <option>1 min prior</option>
                    </select>
                    <input onclick = "showArchiveCompletedButton()" type="checkbox" class="mt-4 check-box" style="margin:0 auto;justify-content:center;align-items:center;width:5px;">
                    </div>`;
                   

        tasksBox.innerHTML = tasks;
    });
});
};

function showSendCodeButton(){
    var phoneNumberInput = document.getElementById("sign-up-number").value;
    if(phoneNumberInput.length >= 10){
        sendCodeButton.style.setProperty("display","block");
    }else{
        return;
    }
}

function showVerifyCodeFields(){
    sendCodeButton.style.setProperty("display","none");
    verificationFields.style.setProperty("display","block");
    var phoneNumberInput = document.getElementById("sign-up-number").value;
    var endpoint = "";

    function isDomestic(pn){
        if(pn.length == 10){
            return true;
        }else{
            return false;
        }
    };

        if(isDomestic(phoneNumberInput) == true){
            var internationalizedNumber = "1"+phoneNumberInput;
            endpoint = `/sendCode/${internationalizedNumber}`;
            
                return axios.get(endpoint).then(function(res){
                sendCodeButton.style.setProperty("display","none");
                verificationFields.style.setProperty("display","block");
                sentCode = res.data;
                return sentCode;

            });


        }else{
            endpoint = `/sendCode/${phoneNumberInput}`;
            return axios.get(endpoint).then(function(res){
            sendCodeButton.style.setProperty("display","none");
            verificationFields.style.setProperty("display","block");
            sentCode = res.data;
            return sentCode;
            });
        }
}


function showVerifyCodeButton(){
    var verificationCode = document.getElementById("verification-code-input").value;
    if(verificationCode.length == 6){
        verifyCodeButton.style.setProperty("display","block");
    }else{
        return;
    }
}

function verifyCode(codeInput){
        if(codeInput == sentCode){
            codeVerifier.style.setProperty("display","none");
            verCodeInput.style.setProperty("display","none");
            verifyCodeButton.style.setProperty("display","none");
            verifiedBlock.style.setProperty("display","block");
            createAccountButton.style.setProperty("display","block");
            
            return;
        }else{
            alert("Incorrect verification code");
            return;
        }

}


function showSaveButton(){
    saveButton.style.setProperty("display","block");
}

function showArchiveCompletedButton(){
    var checkBoxes = document.getElementsByClassName("check-box");
    var checkBoxesArray = Array.from(checkBoxes);
    var findCompletedTasks = checkBoxesArray.find(function(checkbox){
        return checkbox.checked == true;
    });

   if(findCompletedTasks != undefined){
        archiveCompletedButton.style.setProperty("display","block");
   }else{
        archiveCompletedButton.style.setProperty("display","none");
       return;
   }

}
function showArchiveButton(){
    taskArchiveButton.style.setProperty("display","block");
}

function viewArchive(){

    viewTaskArchiveButton.style.setProperty("display","none");
    myTasksHeader.style.setProperty("display", "none");
    taskArchiveHeader.style.setProperty("display","block");
    listHeading.style.setProperty("display","none");
    taskItems.style.setProperty("display","none");
    myTasksButton.style.setProperty("display","block");
    saveChangesButton.style.setProperty("display","none");
    archiveCompletedButton.style.setProperty("display","none");
    archiveWrapper.style.setProperty("display","block");
    archiveBox.style.setProperty("display","block");
    archiveListHeading.style.setProperty("display","flex");


    firebase.auth().onAuthStateChanged(function(user){

        var path = `usernames/${user.displayName}/archive/`;
        var dbArchive = firebase.database().ref(path);

        dbArchive.once('value').then(function(snapshot){
            
            snapshot.forEach(function(task){

            var taskName = task.val().TaskName;
            var taskDate = task.val().TaskDate;
            var taskTime = convertFromMilitaryToStd(task.val().TaskTimeDue);
            var listOfArchivedTasks = "";

            listOfArchivedTasks += `<div class="row rendered-archive">
                <p>${taskName}</p>
                <p>${taskDate}</p>
                <p>${taskTime}</p>

            </div>`

            archiveBox.innerHTML += listOfArchivedTasks;

            });
        });
        });

}

function viewTasks(){

window.location.href = "dashboard.html";

}

function archiveCompleted(){

var checkBoxes = document.getElementsByClassName("check-box");
var checkBoxesArray = Array.from(checkBoxes);
checkBoxesArray.forEach(function(checkbox){
    if(checkbox.checked == true){
        firebase.auth().onAuthStateChanged(function(user){
            var taskName = checkbox.parentElement.children[0].value;
            var taskDueDate = checkbox.parentElement.children[1].value;
            var taskDueTime = checkbox.parentElement.children[2].value;
            var path = `usernames/${user.displayName}/archive/${taskName}`;
            var archivesDb = firebase.database().ref(path);
            var pathToTaskInTasksDir = firebase.database().ref(`usernames/${user.displayName}/tasks/${taskName}`);
            archivesDb.set({
                TaskName: taskName,
                TaskDate: taskDueDate,
                TaskTimeDue: taskDueTime
            });
            pathToTaskInTasksDir.remove();
            checkbox.parentElement.parentElement.removeChild(checkbox.parentElement);
        });
    }});
    window.location.href="dashboard.html";
};

function updateTasks(){

    firebase.auth().onAuthStateChanged(function(user){

        var renderedTasks = document.getElementsByClassName("rendered-list");
        var renderedTasksArray = Array.from(renderedTasks);
        var index = 0;
        var currentRenderedTaskName = renderedTasksArray[index].children[0].value;
        var currentRenderedTaskDueDate = renderedTasksArray[index].children[1].value;
        var currentRenderedTaskDueTime = renderedTasksArray[index].children[2].value;
        var currentRenderedTaskAlertFrequency = renderedTasksArray[index].children[3].value;
        var tasksDb = firebase.database().ref(`usernames/${user.displayName}/tasks/`);

            tasksDb.once('value',function(snapshot){

            snapshot.forEach(function(currentDbTask){
            
            function formatAlert(){

                var year = parseInt(currentRenderedTaskDueDate.substring(0,4));
                var month = parseInt(currentRenderedTaskDueDate.substring(5,7))
                var day = parseInt(currentRenderedTaskDueDate.slice(8));
                var minutes = parseInt(currentRenderedTaskDueTime.slice(3));
                var hour = parseInt(currentRenderedTaskDueTime.substring(0,3));  
            
                if(currentRenderedTaskAlertFrequency == "1 Day prior"){
            
                    day -= 1;
            
                    if(day < 10 && day != 0){
                        day =`0${day.toString()}`;
                    }
                    
                    function handle0edgecase(){
            
                        if(month < 10){
                        month = `0${month.toString()}`;
                        }
                        if(month >= 10){
                        month = month.toString();
                        }
            
                        month = parseInt(month) - 1;
            
                        if(month < 10){
                            month = `0${month.toString()}`;
                        }
                        if(month <= 10){
                            month = month.toString();
                        }
                        if(month == 0){
                            month = "12";
                            year -= 1;
                        }
                        
            
            
                        var isMoWith30days = monthsWith30Days.find(function(mo){
                            return month == mo;
                        });
                
                        var isMoWith31Days = monthsWith31Days.find(function(mo){
                            return month == mo;
                        });
            
            
                        if((isMoWith30days == undefined) && (isMoWith31Days == undefined)){
                            day = "28";
                            return;
                        }
                        if(isMoWith31Days !== undefined){
                            day = "31";
                            return;
                        }
                        if(isMoWith30days !== undefined){
                            day = "30";
                            return;
                        }
            
                    }
            
                    if(day == 0){
                        handle0edgecase();
                    }
            
                    if(day >= 10){
                        day = day.toString();
                    }
            
                    
                    return `${year.toString()}-${month}-${day} @${convertFromMilitaryToStd(currentRenderedTaskDueTime)}`;
            
                }else if(currentRenderedTaskAlertFrequency  == "1 Hour prior"){
            
                    hour -= 1;
                    
                    if(hour == 0){
                        hour = hour.toString();
                        hour = "12";
                    }
                    if((hour > 0) && (hour < 10)){
                        hour = `0${hour.toString()}`;
                    }
                    if(hour > 10){
                        hour = hour.toString();
                    }
                   
                    return `${currentRenderedTaskDueDate} @${convertFromMilitaryToStd(`${hour}:${minutes}`)}`;
            
                }else if(currentRenderedTaskAlertFrequency == "30 min prior"){
            
                    minutes -= 30;
                    if(minutes < 0){
                        minutes += 60;
                        hour -= 1;
                        minutes = minutes.toString();
                    }else if(minutes == 0 ){
                        minutes = `0${minutes.toString()}`;
                    }else if((minutes > 0) && (minutes <10)){
                        minutes = `0${minutes.toString()}`;
                    }
                    return `${currentRenderedTaskDueDate} at ${convertFromMilitaryToStd(`${hour.toString()}:${minutes}`)}`;
                }else if(currentRenderedTaskAlertFrequency == "1 min prior"){
            
                    minutes -= 1;
            
                    if(minutes < 0){
                        minutes += 60;
                        hour -= 1;
                        minutes = minutes.toString();
                    }else if(minutes == 0){
                        minutes = `0${minutes.toString()}`;
                    }else if((minutes > 0) && (minutes < 10)){
                        minutes = `0${minutes.toString()}`;
                    }else if((minutes > 0) && (minutes > 10)){
                        minutes = `${minutes.toString()}`;
                    }
            
                    if(hour == 0){
                        hour = hour.toString();
                        hour = "12";   
                    }
                    if((hour > 0) && (hour < 10)){
                        hour = `0${hour.toString()}`;
                    }
                    if(hour > 10){
                        hour = hour.toString();
                    }
            
                    return `${currentRenderedTaskDueDate} @${convertFromMilitaryToStd(`${hour}:${minutes}`)}`;
                }
                if(currentRenderedTaskAlertFrequency != "1 day prior" && currentRenderedTaskAlertFrequency != "1 min prior" &&
                currentRenderedTaskAlertFrequency  != "1 Hour prior" && currentRenderedTaskAlertFrequency != "30 min prior"){
                    return `${currentRenderedTaskAlertFrequency}`
            }
        }
                
            
                var dateAndTimeToAlert = formatAlert();
                var currentDbTask = currentDbTask.val().Task;
                var pathToCurrentDbTask = firebase.database().ref(`usernames/${user.displayName}/tasks/${currentDbTask}`);
                pathToCurrentDbTask.remove();
                var pathToUpdatedDbTask = firebase.database().ref(`usernames/${user.displayName}/tasks/${currentRenderedTaskName}`);
                pathToUpdatedDbTask.set({
                        Task: currentRenderedTaskName,
                        DueDate: currentRenderedTaskDueDate,
                        Time: currentRenderedTaskDueTime,
                        AlertFrequency: dateAndTimeToAlert
                    });
                index++;
        });
        });
    });
    window.location.href = "dashboard.html";
};


function checkTime(i) {

            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }
    
function getCurrentTimeAndDate(){

            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1;
            var yyyy = today.getFullYear();
            var h = today.getHours();
            var m = today.getMinutes();
            var userPhoneNumber = "";

            if(dd<10) {
                dd = `0${dd.toString()}`
            } 

            if(mm<10) {
                mm = `0${mm.toString()}`
            }
            if(h<10){
                h = `0${h.toString()}`
            }

            currentDate = `${yyyy}-${mm}-${dd}`;
            m = checkTime(m);
            currentTime = `${h}:${m}`;
            currentDateAndTime = `${currentDate} @${convertFromMilitaryToStd(currentTime)}`;
            
            
            setTimeout(function() {

            getCurrentTimeAndDate();

                firebase.auth().onAuthStateChanged(function(user){

                    var pathToNum = `usernames/${user.displayName}/number`;
                    var dbRef = firebase.database().ref(pathToNum);
                    
                    dbRef.once('value',function(snapshot){
                        userPhoneNumber = snapshot.val();
                    }).then(function(){
                    var path = `usernames/${user.displayName}/tasks/`;

                    var dbTasks = firebase.database().ref(path);

            dbTasks.on('value',function(snapshot){

                        snapshot.forEach(function(task){

                            var alertFrequency = task.val().AlertFrequency

                            if(alertFrequency == currentDateAndTime){
        
                            var task = snapshot.val().Task;

                            snapshot.forEach(function(currentTask){
                                    
                                    memeData.map(function(meme){
                                        var theTask = currentTask.val().Task;
                                        var memeTitle = meme.title;
                                        var memeImg = meme.image;

                                        if(theTask.toLowerCase().includes(memeTitle.toLowerCase())){
                                            var endpoint = `/sendAlert/${userPhoneNumber}/${encodeURIComponent(memeImg)}`;
                                            axios.get(endpoint).then(function(res){
                                                console.log(res)
                                            }).catch(function(err){
                                                console.log(err);
                                            });
                                        };
                                    }); 
                                });
                            };
                        });
                    });
                });
            });
            }, 50000);
        };

getCurrentTimeAndDate();







