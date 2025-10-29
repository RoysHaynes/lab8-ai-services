document.getElementById("send").addEventListener("click", function(){
    let msg = document.getElementById("msg").value;
    let endpoint="https://api.groq.com/openai/v1/chat/completions";

    let api_key = localStorage.getItem("groq_Key");

    if(!api_key){
        api_key = prompt("Enter groq key: ");
        if(api_key){
            localStorage.setItem("groq_Key", api_key);
        }else{
            alert("Please enter groq key");
            return;
        }
    }

    fetch(endpoint, {
        method: "POST",
        headers:{
            "Authorization": `Bearer ${api_key}`,
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            model:"llama-3.3-70b-versatile",
            messages:[
                {role:'user',content:msg}
            ]
        })
    })
        .then(function(response){return response.json();})
        .then(function(data){
            let p = document.createElement("p");
            p.textContent = data.choices[0].message.content;
            document.body.appendChild(p);
        });
});