/**
 * @file openRouter.js
 * @description
 * A Research & Development (R&D) test script demonstrating how to send messages
 * to the **OpenRouter API** using the OpenAI-compatible `gpt-4o-mini` model.
 *
 * This standalone JavaScript file validates successful communication with OpenRouter’s
 * cloud endpoint before full MVC integration. It provides a minimal working example
 * for testing network connectivity, authorization headers, and JSON response handling.
 *
 * The script:
 *  - Prompts the user for their **OpenRouter API key** once and stores it in `localStorage`.
 *  - Sends the user's text message to the OpenRouter `/chat/completions` endpoint.
 *  - Parses and displays the model’s response dynamically in the DOM.
 */

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