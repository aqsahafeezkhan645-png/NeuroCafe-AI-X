// =============================================
// PAGE LOAD ANIMATION
// =============================================

window.addEventListener('load', () => {

    document.body.classList.add('loaded');

    updateClock();
});

// =============================================
// LIVE CLOCK
// =============================================

function updateClock(){

    const now = new Date();

    const hours =
        String(now.getHours()).padStart(2,'0');

    const minutes =
        String(now.getMinutes()).padStart(2,'0');

    const seconds =
        String(now.getSeconds()).padStart(2,'0');

    const time =
        `${hours}:${minutes}:${seconds}`;

    const clock =
        document.getElementById('liveClock');

    if(clock){

        clock.innerHTML = `🕒 ${time}`;
    }
}

setInterval(updateClock,1000);

// =============================================
// COUNTER ANIMATION
// =============================================

const counters =
    document.querySelectorAll('.counter');

counters.forEach(counter => {

    counter.innerText = '0';

    const updateCounter = () => {

        const target =
            +counter.getAttribute('data-target');

        const current =
            +counter.innerText.replace('%','');

        const increment = target / 60;

        if(current < target){

            counter.innerText =
                `${Math.ceil(current + increment)}%`;

            setTimeout(updateCounter,30);

        }else{

            counter.innerText =
                `${target}%`;
        }
    };

    updateCounter();
});

// =============================================
// CURSOR GLOW EFFECT
// =============================================

document.addEventListener('mousemove',(e)=>{

    const glow =
        document.querySelector('.cursor-glow');

    if(glow){

        glow.style.left = e.pageX + 'px';

        glow.style.top = e.pageY + 'px';
    }
});

// =============================================
// SIDEBAR ACTIVE MENU
// =============================================

function activateMenu(element, sectionId){

    // REMOVE ACTIVE

    document.querySelectorAll('.nav-item')
    .forEach(item => {

        item.classList.remove('active');
    });

    // ADD ACTIVE

    element.classList.add('active');

    // SCROLL TO SECTION

    const section =
        document.getElementById(sectionId);

    if(section){

        section.scrollIntoView({

            behavior:'smooth',

            block:'start'
        });
    }
}

// =============================================
// FLOATING CARD ANIMATION
// =============================================

const cards =
    document.querySelectorAll('.glass-card');

cards.forEach((card,index)=>{

    card.style.animation =
        `floatAnimation 4s ease-in-out infinite`;

    card.style.animationDelay =
        `${index * 0.15}s`;
});

// =============================================
// QUICK PROMPTS
// =============================================

function quickPrompt(text){

    const userInput =
        document.getElementById('userInput');

    userInput.value = text;

    askAI();
}

// =============================================
// AI CHAT FUNCTION
// =============================================

async function askAI(){

    const userInput =
        document.getElementById('userInput');

    const chatBox =
        document.getElementById('chatBox');

    const message =
        userInput.value.trim();

    if(message === '') return;

    // =========================================
    // USER MESSAGE
    // =========================================

    const userDiv =
        document.createElement('div');

    userDiv.classList.add('user-message');

    userDiv.innerHTML = `

        <strong>👩‍🎓 You:</strong>
        <br><br>

        ${message}

    `;

    chatBox.appendChild(userDiv);

    // CLEAR INPUT

    userInput.value = '';

    // =========================================
    // AI THINKING MESSAGE
    // =========================================

    const aiDiv =
        document.createElement('div');

    aiDiv.classList.add('ai-message');

    aiDiv.innerHTML = `

        🤖 NeuroCafe AI is thinking...

    `;

    chatBox.appendChild(aiDiv);

    chatBox.scrollTop =
        chatBox.scrollHeight;

    try{

        // =====================================
        // FETCH AI RESPONSE
        // =====================================

        const response =
            await fetch('/ask_ai', {

                method:'POST',

                headers:{
                    'Content-Type':
                    'application/json'
                },

                body:JSON.stringify({

                    message:message
                })
            });

        const data =
            await response.json();

        // =====================================
        // TYPEWRITER EFFECT
        // =====================================

        typeWriterEffect(

            aiDiv,

            `
            🤖 <strong>AI Tutor:</strong>
            <br><br>

            ${data.reply}
            `
        );

    }catch(error){

        aiDiv.innerHTML = `

            ❌ Connection Error.

            <br><br>

            Please check Flask server.

        `;
    }

    chatBox.scrollTop =
        chatBox.scrollHeight;
}

// =============================================
// TYPEWRITER EFFECT
// =============================================

function typeWriterEffect(element,text){

    element.innerHTML = '';

    let i = 0;

    const speed = 10;

    function typing(){

        if(i < text.length){

            element.innerHTML +=
                text.charAt(i);

            i++;

            setTimeout(typing,speed);
        }
    }

    typing();
}

// =============================================
// ENTER KEY SUPPORT
// =============================================

document.getElementById('userInput')
.addEventListener('keypress', function(e){

    if(e.key === 'Enter' && !e.shiftKey){

        e.preventDefault();

        askAI();
    }
});

// =============================================
// DOWNLOAD CHAT
// =============================================

const downloadButton =
    document.querySelectorAll('.icon-btn')[1];

if(downloadButton){

    downloadButton.addEventListener('click',()=>{

        const chatText =
            document.getElementById('chatBox')
            .innerText;

        const blob =
            new Blob([chatText],{

                type:'text/plain'
            });

        const a =
            document.createElement('a');

        a.href =
            URL.createObjectURL(blob);

        a.download =
            'NeuroCafe_Chat.txt';

        a.click();
    });
}

// =============================================
// CLEAR CHAT
// =============================================

const trashButton =
    document.querySelectorAll('.icon-btn')[2];

if(trashButton){

    trashButton.addEventListener('click',()=>{

        const chatBox =
            document.getElementById('chatBox');

        chatBox.innerHTML = `

        <div class="ai-message">

            👋 Chat Cleared Successfully.

            <br><br>

            Ask me anything again 🚀

        </div>

        `;
    });
}

// =============================================
// MICROPHONE BUTTON
// =============================================

const micButton =
    document.querySelectorAll('.icon-btn')[0];

if(micButton){

    micButton.addEventListener('click',()=>{

        // CHECK SUPPORT

        if(!('webkitSpeechRecognition'
            in window)){

            alert(
                '❌ Speech Recognition not supported.'
            );

            return;
        }

        const recognition =
            new webkitSpeechRecognition();

        recognition.lang = 'en-US';

        recognition.start();

        recognition.onstart = ()=>{

            alert(
                '🎤 Speak Now...'
            );
        };

        recognition.onresult = (event)=>{

            const transcript =
                event.results[0][0].transcript;

            document.getElementById('userInput')
            .value = transcript;
        };
    });
}

// =============================================
// RANDOM AI STATUS UPDATE
// =============================================

const statuses = [

    '🟢 Cognitive Agent Online',

    '🧠 Memory System Learning',

    '⚡ Quiz Agent Active',

    '📚 Planner Agent Running',

    '🤖 AI Tutor Connected',

    '✅ Evaluation Agent Ready'
];

function randomStatus(){

    const statusBoxes =
        document.querySelectorAll('.agent-status');

    statusBoxes.forEach(box => {

        const random =
            statuses[
                Math.floor(
                    Math.random() * statuses.length
                )
            ];

        box.innerHTML = random;
    });
}

setInterval(randomStatus,7000);

// =============================================
// AUTO ACTIVE SIDEBAR ON SCROLL
// =============================================

window.addEventListener('scroll',()=>{

    const sections = [

        {
            id:'dashboardSection',
            nav:0
        },

        {
            id:'plannerSection',
            nav:3
        },

        {
            id:'aiTutorSection',
            nav:1
        },

        {
            id:'quizSection',
            nav:2
        },

        {
            id:'weakSection',
            nav:4
        },

        {
            id:'analyticsSection',
            nav:5
        }
    ];

    let currentSection = '';

    sections.forEach(section => {

        const sec =
            document.getElementById(section.id);

        if(sec){

            const top =
                sec.offsetTop - 200;

            if(scrollY >= top){

                currentSection =
                    section.nav;
            }
        }
    });

    document.querySelectorAll('.nav-item')
    .forEach(item => {

        item.classList.remove('active');
    });

    if(currentSection !== ''){

        document.querySelectorAll('.nav-item')
        [currentSection]
        .classList.add('active');
    }
});

// =============================================
// AI CARD HOVER SOUND EFFECT
// =============================================

const allCards =
    document.querySelectorAll(
        '.glass-card,.stat-card,.analytic-box'
    );

allCards.forEach(card => {

    card.addEventListener('mouseenter',()=>{

        card.style.transform =
            'translateY(-5px) scale(1.01)';
    });

    card.addEventListener('mouseleave',()=>{

        card.style.transform =
            'translateY(0px) scale(1)';
    });
});

// =============================================
// FAKE LOADING EFFECT
// =============================================

function fakeLoading(){

    const aiStatus =
        document.querySelector('.ai-status');

    if(aiStatus){

        aiStatus.innerHTML =
            '⚡ Processing...';

        setTimeout(()=>{

            aiStatus.innerHTML =
                '● AI LIVE';

        },2000);
    }
}

setInterval(fakeLoading,15000);

// =============================================
// WELCOME MESSAGE
// =============================================

setTimeout(()=>{

    const chatBox =
        document.getElementById('chatBox');

    const welcome =
        document.createElement('div');

    welcome.classList.add('ai-message');

    welcome.innerHTML = `

    🚀 Welcome to NeuroCafe AI X

    <br><br>

    Your Multi-Agent AI Tutor is Ready.

    <br><br>

    ✔ AI Teaching
    <br>
    ✔ Quiz Generation
    <br>
    ✔ Study Planning
    <br>
    ✔ Coding Help
    <br>
    ✔ Weak Area Detection

    `;

    chatBox.appendChild(welcome);

},3000);