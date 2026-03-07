console.log("connected");

const loadIssueCounterAPI = ()=>{
    fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
    .then(res=>res.json())
    .then(Element=>{
        const issues = Element.data;
        const issuesCounter = issues.length;
        
        const counterContainer = document.getElementById("issues-counter")
        counterContainer.innerText = issuesCounter;
    })
}
loadIssueCounterAPI();