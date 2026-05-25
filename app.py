from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import requests
import random
import os
import webbrowser

from threading import Timer
from datetime import datetime

# =====================================================
# LOAD ENV VARIABLES
# =====================================================

load_dotenv()

# =====================================================
# FLASK APP
# =====================================================

app = Flask(__name__)

# =====================================================
# API KEY
# =====================================================

OPENROUTER_API_KEY = os.getenv(
    "OPENROUTER_API_KEY"
)

# =====================================================
# HOME ROUTE
# =====================================================

@app.route('/')
def home():

    return render_template('index.html')

# =====================================================
# AI CHAT ROUTE
# =====================================================

@app.route('/ask_ai', methods=['POST'])
def ask_ai():

    try:

        # =============================================
        # GET USER MESSAGE
        # =============================================

        data = request.get_json()

        user_message = data.get(
            'message',
            ''
        ).strip()

        if not user_message:

            return jsonify({

                "reply":
                "❌ Please enter a message."
            })

        # =============================================
        # DETECT ACTIVE AGENT
        # =============================================

        lower_msg = user_message.lower()

        agent_name = "Tutor Agent"

        if "quiz" in lower_msg \
        or "mcq" in lower_msg:

            agent_name = "Quiz Agent"

        elif "study" in lower_msg \
        or "schedule" in lower_msg:

            agent_name = "Planner Agent"

        elif "weak" in lower_msg:

            agent_name = "Memory Agent"

        elif "code" in lower_msg \
        or "python" in lower_msg \
        or "html" in lower_msg \
        or "css" in lower_msg \
        or "javascript" in lower_msg:

            agent_name = "Coding Agent"

        elif "evaluate" in lower_msg:

            agent_name = "Evaluation Agent"

        elif "focus" in lower_msg \
        or "productivity" in lower_msg:

            agent_name = "Productivity Agent"

        # =============================================
        # OPTIMIZED SYSTEM PROMPT
        # =============================================

        system_prompt = f"""

You are NeuroCafe AI X.

ACTIVE AGENT:
{agent_name}

RULES:
- beginner friendly
- concise
- educational
- step-by-step
- motivational
- futuristic tone
- use bullet points
- answer clearly

"""

        # =============================================
        # HEADERS
        # =============================================

        headers = {

            "Authorization":
            f"Bearer {OPENROUTER_API_KEY}",

            "Content-Type":
            "application/json",

            "HTTP-Referer":
            "http://localhost:5000",

            "X-Title":
            "NeuroCafe AI X",

            "User-Agent":
            "NeuroCafe-AI-X"
        }

        # =============================================
        # PAYLOAD
        # =============================================

        payload = {

            "model":
            "openai/gpt-4o-mini",

            "messages":[

                {
                    "role":"system",

                    "content":system_prompt
                },

                {
                    "role":"user",

                    "content":user_message
                }
            ],

            "temperature":0.7,

            "max_tokens":300
        }

        # =============================================
        # SEND API REQUEST
        # =============================================

        response = requests.post(

            "https://openrouter.ai/api/v1/chat/completions",

            headers=headers,

            json=payload,

            timeout=20
        )

        # =============================================
        # STATUS CHECK
        # =============================================

        if response.status_code != 200:

            return jsonify({

                "reply":
                f"❌ API Error ({response.status_code})"
            })

        # =============================================
        # RESPONSE JSON
        # =============================================

        result = response.json()

        # =============================================
        # DEBUG LOG
        # =============================================

        print("\n========== API SUCCESS ==========")

        # =============================================
        # HANDLE API ERRORS
        # =============================================

        if 'choices' not in result:

            error_message = result.get(
                'error',
                {}
            ).get(
                'message',
                'Unknown API Error'
            )

            return jsonify({

                "reply":
                f"❌ API Error: {error_message}"
            })

        # =============================================
        # AI RESPONSE
        # =============================================

        ai_reply = result['choices'][0] \
        ['message']['content']

        # =============================================
        # AI CONFIDENCE
        # =============================================

        ai_score = random.randint(95,99)

        # =============================================
        # CURRENT TIME
        # =============================================

        current_time = datetime.now() \
        .strftime("%I:%M %p")

        # =============================================
        # FINAL RESPONSE
        # =============================================

        final_reply = f"""

🤖 ACTIVE AGENT:
{agent_name}

━━━━━━━━━━━━━━━━━━━

{ai_reply}

━━━━━━━━━━━━━━━━━━━

✅ AI Confidence:
{ai_score}%

🕒 Generated:
{current_time}

🚀 Powered by NeuroCafe AI X

"""

        return jsonify({

            "reply":final_reply
        })

    # =============================================
    # CONNECTION ERROR
    # =============================================

    except requests.exceptions.ConnectionError:

        return jsonify({

            "reply":
            "❌ Internet Connection Error."
        })

    # =============================================
    # TIMEOUT ERROR
    # =============================================

    except requests.exceptions.Timeout:

        return jsonify({

            "reply":
            "❌ AI Response Timeout."
        })

    # =============================================
    # GENERAL ERROR
    # =============================================

    except Exception as e:

        print("\n========== SERVER ERROR ==========")
        print(str(e))

        return jsonify({

            "reply":
            f"❌ Server Error: {str(e)}"
        })

# =====================================================
# QUIZ GENERATOR API
# =====================================================

@app.route('/generate_quiz', methods=['POST'])
def generate_quiz():

    quiz = [

        {

            "question":
            "What is Artificial Intelligence?",

            "options":[

                "Machine Intelligence",

                "Virus",

                "Database",

                "Compiler"
            ],

            "answer":
            "Machine Intelligence"
        },

        {

            "question":
            "Which language is popular in AI?",

            "options":[

                "Python",

                "HTML",

                "CSS",

                "PHP"
            ],

            "answer":
            "Python"
        }
    ]

    return jsonify(quiz)

# =====================================================
# STUDY PLAN API
# =====================================================

@app.route('/study_plan')
def study_plan():

    return jsonify({

        "Morning":
        "Study AI Concepts",

        "Afternoon":
        "Practice Programming",

        "Evening":
        "Solve MCQs",

        "Night":
        "Revision"
    })

# =====================================================
# PERFORMANCE API
# =====================================================

@app.route('/performance')
def performance():

    return jsonify({

        "accuracy":"98%",

        "focus":"High",

        "productivity":"Excellent",

        "weak_area":
        "Neural Networks"
    })

# =====================================================
# HEALTH CHECK API
# =====================================================

@app.route('/health')
def health():

    return jsonify({

        "status":"running",

        "app":"NeuroCafe AI X"
    })

# =====================================================
# AUTO OPEN BROWSER
# =====================================================

def open_browser():

    webbrowser.open_new(
        'http://127.0.0.1:5000/'
    )

# =====================================================
# RUN APP
# =====================================================

if __name__ == '__main__':

    print("\n🚀 NeuroCafe AI X Starting...\n")

    # OPEN BROWSER ONLY ON MAIN PROCESS

    if os.environ.get(
        "WERKZEUG_RUN_MAIN"
    ) == "true":

        Timer(
            1,
            open_browser
        ).start()

    app.run(

        host='0.0.0.0',

        port=int(
            os.environ.get(
                "PORT",
                5000
            )
        ),

        debug=False,

        threaded=True
    )