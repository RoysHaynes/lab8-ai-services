document.getElementById("send").addEventListener("click", function() {
    let msg = document.getElementById("msg").value;
    let endpoint="https://openrouter.ai/api/v1/chat/completions";

    let api_key = localStorage.getItem("open_Key");

    if(!api_key){
        api_key = prompt("Enter open key: ");
        if(api_key){
            localStorage.setItem("open_Key", api_key);
        }else{
            alert("Please enter open key");
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
            model:"openai/gpt-4o-mini",
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