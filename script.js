document.addEventListener("DOMContentLoaded",function(){
    const searchButton=document.getElementById("srch-btn");
    const userNameInput=document.getElementById("user-input");
    const statsContainer=document.querySelector(".stats-container");
    const easyProgressCircle=document.querySelector(".easy-progress");
    const mediumProgressCircle=document.querySelector(".medium-progress");
    const hardProgressCircle=document.querySelector(".hard-progress");
    const easyLevel=document.getElementById("easy-level");
    const mediumLevel=document.getElementById("medium-level");
    const hardLevel=document.getElementById("hard-level");
    const cardStatsContainer=document.querySelector(".stats-card");

    function validateUserName(userName){
        if(userName.trim()===""){
            alert("Username should not be empty");
            return false;
        }
        const regex=/^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching=regex.test(userName);
        if(!isMatching){
            alert("Invalid username");
        }
        return isMatching;
    }

    async function fetchUserDetails(userName){
        const url=`https://leetcode-stats-api.herokuapp.com/${userName}`;
        try{
            searchButton.textContent="Searching..";
            searchButton.disabled=true;
            const response=await fetch(url);
            if(!response.ok){
                throw new Error("Unable to fetch the user Details");
            }
            const parsedData=await response.json();
            console.log("logging:",parsedData);
            displayUserData(parsedData);
        }
        catch(error){
            statsContainer.innerHTML="<p>No data found</p>";
        }
        finally{
            searchButton.textContent="search";
            searchButton.disabled=false;
        }
        
    }
    function updateProgress(easy, totalEasy, medium, totalMedium, hard, totalHard) {
        // Calculate percentage of progress for each difficulty level
        const easyPercentage = (easy / totalEasy) * 100;
        const mediumPercentage = (medium / totalMedium) * 100;
        const hardPercentage = (hard / totalHard) * 100;
    
        // Convert percentage to degrees for conic-gradient (360 degrees max)
        const easyDegrees = (easyPercentage / 100) * 360;
        const mediumDegrees = (mediumPercentage / 100) * 360;
        const hardDegrees = (hardPercentage / 100) * 360;
    
        // Update the --progress-degree CSS variable for each circle
        easyProgressCircle.style.setProperty('--progress-degree', `${easyDegrees}deg`);
        mediumProgressCircle.style.setProperty('--progress-degree', `${mediumDegrees}deg`);
        hardProgressCircle.style.setProperty('--progress-degree', `${hardDegrees}deg`);
    }
    

    function displayUserData(parsedData) {
        // Display the number of solved problems in each category
        easyLevel.textContent = `${parsedData.easySolved} / ${parsedData.totalEasy}`;
        mediumLevel.textContent = `${parsedData.mediumSolved} / ${parsedData.totalMedium}`;
        hardLevel.textContent = `${parsedData.hardSolved} / ${parsedData.totalHard}`;
    
        // Update the progress bars with the solved data
        updateProgress(
            parsedData.easySolved,
            parsedData.totalEasy,
            parsedData.mediumSolved,
            parsedData.totalMedium,
            parsedData.hardSolved,
            parsedData.totalHard
        );
    
        // Update other stats in the stats-card section (in card form)
        document.getElementById('total-solved').textContent = `${parsedData.totalSolved} / ${parsedData.totalQuestions}`;
        document.getElementById('acceptance-rate').textContent = `${parsedData.acceptanceRate}%`;
        document.getElementById('ranking').textContent = `#${parsedData.ranking}`;
        document.getElementById('contribution-points').textContent = parsedData.contributionPoints;
    }
    
    
    searchButton.addEventListener("click",function(){
        const userName=userNameInput.value;
        console.log("name: ",userName);
        if(validateUserName(userName)){
            fetchUserDetails(userName);
        }
    })

})