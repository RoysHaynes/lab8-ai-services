document.getElementById("send").addEventListener("click", function() {
    let msg = document.getElementById("msg").value;
    let api_key = prompt("Enter key: ");
    let endpoint="https://openrouter.ai/api/v1/chat/completions";

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