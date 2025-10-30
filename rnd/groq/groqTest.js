/**
 * @file groqTest.js
 * @description
 * A simple Research & Development (R&D) test script demonstrating how to send a message
 * to the Groq Cloud API and display a real-time AI-generated response.
 *
 * This file is intentionally minimal to verify API connectivity and response handling
 * before integrating the logic into the main MVC application. It uses `fetch()` to call
 * the Groq endpoint with OpenAI-compatible parameters.
 *
 * The script:
 *  - Prompts the user for an API key once, storing it in `localStorage`.
 *  - Sends a message input (`msg`) from the browser to Groq’s `llama-3.3-70b-versatile` model.
 *  - Displays the model’s response directly on the page.
 */

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