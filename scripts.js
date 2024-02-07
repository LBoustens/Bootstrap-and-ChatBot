const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatBox = document.querySelector(".chatbox");
const chatBotToggler = document.querySelector(".chatbot-toggler");
const chatBotCloseBtn = document.querySelector(".close-btn");

let userMessage;
const OPENAI_API_KEY = "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";
const inputInitHeight = chatInput.scrollHeight

const createChatLi = (message, className) => {
    // création d'un chat <li> avec le className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span> <p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

const generateResponse = (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p")

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4-1106-preview",
            messages: [{
                role: "system",
                content: "You are a helpful assistant."
            },
            { role: "user", content: userMessage }
            ]
        })
    }

    //recupere la reponse par api
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content;
        console.log(data.choices[0].message.content);
    }).catch((error) => {
        messageElement.textContent = "Une erreur est survenue. Veuillez recommencer.";
    }).finally(() => chatBox.scrollTo(0, chatBox.scrollHeight));
}


const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`

    chatBox.appendChild(createChatLi(userMessage, "outgoing"));
    chatBox.scrollTo(0, chatBox.scrollHeight);
    setTimeout(() => {
        const incomingChatLi = createChatLi("Je réfléchis...", "incoming");
        chatBox.appendChild(incomingChatLi);
        chatBox.scrollTo(0, chatBox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600)
}

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`
    chatInput.style.height = `${chatInput.scrollHeight}px`
});

chatInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
chatBotCloseBtn.addEventListener("click", () => { document.body.classList.remove("show-chatbot") });
chatBotToggler.addEventListener("click", () => { document.body.classList.toggle("show-chatbot") });