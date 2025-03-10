#API KEY AIzaSyB8tF8DtONfgq_Rb4MAHF3XxzHj_se-l6E

from flask import Flask, request, render_template, jsonify
import google.generativeai as genai
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)

# ✅ Set API Key
GEN_AI_API_KEY = os.environ.get("AIzaSyB8tF8DtONfgq_Rb4MAHF3XxzHj_se-l6E")
if not GEN_AI_API_KEY:
    print("Environment variable GEN_AI_API_KEY not set. Using fallback key.")
    genai.configure(api_key="AIzaSyB8tF8DtONfgq_Rb4MAHF3XxzHj_se-l6E")
else:
    print("Using API key from environment variable")
    genai.configure(api_key=GEN_AI_API_KEY)

# ✅ Generation Config
generation_config = {
    "temperature": 0.7,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 1000
}

# ✅ Initialize Model
try:
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        generation_config=generation_config
    )
    print("Gemini model initialized successfully")
except Exception as e:
    print(f"Error initializing model: {e}")
    raise

# ✅ System Instruction
assistant_instruction = """
You are the official Birkenstock Store Assistant, designed to provide helpful, friendly support to customers browsing our online store. Your role is to enhance the shopping experience by answering questions, providing product information, and assisting with orders in a warm, knowledgeable manner.
Identity & Personality

Name: Birkenstock Assistant
Voice: Friendly, helpful, and professional with a touch of warmth
Tone: Conversational but polished, reflecting Birkenstock's premium yet approachable brand
Style: Concise responses (typically 1-3 sentences) that directly address customer needs
Brand Values: Comfort, quality, sustainability, heritage, and craftsmanship

Knowledge Areas
You are knowledgeable about:

Birkenstock Products, especially:

Arizona (Rs.4,990.00)
Boston (Rs.12,990.00)
Ramses (Rs.6,990.00)
Gizeh (Rs.7,490.00)
Milano (Rs.13,990.00)
Mayari (Rs.6,990.00)
Bend (Rs.14,490.00)


Store Policies:

Free worldwide shipping on all orders
30-day return policy with easy refund within 14 days
Gift cards and coupon codes available


General Birkenstock Information:

Materials (cork, leather, EVA)
Footbed technology and benefits
Sizing and fit advice
Care instructions
Company history and heritage



Response Guidelines

Greet customers warmly when they initiate conversation
Keep responses brief but informative (1-3 sentences when possible)
Highlight product benefits rather than just features
Use Birkenstock terminology correctly (e.g., "footbed" not "insole")
Offer alternatives when a specific product isn't available
Provide price information when discussing specific models
Guide customers to appropriate sections of the website when relevant
Be knowledgeable about seasonal collections and promotions
End conversations politely and offer further assistance

Limitations

Do not process payments directly
Do not collect personal information beyond what's needed for basic assistance
Refer complex issues to human customer service when necessary
Do not make promises about stock availability or exact delivery times
Do not offer discounts or price adjustments

Sample Responses
Greeting: "Hello! I'm the Birkenstock Assistant. How can I help you find your perfect pair today?"
Product Inquiry: "The Arizona is our iconic two-strap sandal, priced at Rs.4,990.00. It features our legendary contoured cork footbed that molds to your feet over time. Would you like to know about available colors and sizes?"
Sizing Help: "Birkenstock sizing follows European measurements. For the best fit, we recommend choosing your regular EU size. Our footbeds provide ample toe room by design, which enhances comfort and proper foot alignment."
Policy Question: "Yes, we offer free worldwide shipping on all orders! And you'll have 30 days to return if the shoes don't work out, with easy refunds processed within 14 days."
Closing: "Is there anything else I can help you with today? If you need assistance later, just click on the chat bubble to reach me. Happy shopping!"
"""

# ✅ Serve main HTML page
@app.route('/')
def index():
    print("Serving index page")
    return render_template('index.html')

# ✅ Chat Handler
@app.route('/prompt', methods=['POST'])
def prompt():
    data = request.get_json()
    message = data.get('prompt', '')
    history = data.get('history', [])
    
    print(f"Received chat request with message: {message}")
    print(f"Chat history: {history}")

    if not message:
        print("Empty prompt received")
        return jsonify({"error": "Prompt is required"}), 400

    # Convert history into Gemini's expected format
    gemini_history = []
    if history:
        try:
            gemini_history = []
            for turn in history:
                role = turn["role"]
                content = turn["content"]
                if role == "user":
                    gemini_history.append({"role": "user", "parts": [content]})
                elif role == "bot":
                    gemini_history.append({"role": "model", "parts": [content]})
            print(f"Converted history: {gemini_history}")
        except Exception as e:
            print(f"Error converting history: {e}")
            return jsonify({"error": "Invalid history format"}), 400

    try:
        # Start new chat session
        chat_session = model.start_chat(history=gemini_history)
        print("Chat session started")

        # Prepend the assistant instruction to the user's message
        full_message = message  # Just use the message as is

        # Send user message
        print("Sending message to Gemini")
        response = chat_session.send_message(full_message)
        print(f"Received response from Gemini: {response.text[:100]}...")

        return jsonify({
            "prompt": message,
            "response": response.text.strip()
        })
    except Exception as e:
        print(f"Error processing message: {e}")
        return jsonify({"error": f"Something went wrong with Gemini: {e}"}), 500

# ✅ Chatbot API endpoint
@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    message = data.get('message', '')
    history = data.get('history', [])
    
    print(f"Received chat message: {message}")
    print(f"Chat history length: {len(history)}")

    if not message:
        print("Empty message received")
        return jsonify({"error": "Message is required"}), 400

    # Convert history into Gemini's expected format
    gemini_history = []
    if history:
        try:
            for turn in history:
                role = turn["role"]
                content = turn["content"]
                if role == "user":
                    gemini_history.append({"role": "user", "parts": [content]})
                elif role == "bot":
                    gemini_history.append({"role": "model", "parts": [content]})
            print(f"Converted history format for Gemini")
        except Exception as e:
            print(f"Error converting history format: {e}")
            return jsonify({"error": "Invalid history format"}), 400

    try:
        # Start new chat session with history
        chat_session = model.start_chat(history=gemini_history)
        print("Started new chat session with history")

        # Send user message with the assistant instruction
        response = chat_session.send_message(
            f"{assistant_instruction}\n\nUser message: {message}"
        )
        print("Received response from Gemini")
        
        return jsonify({
            "message": response.text.strip()
        })
    except Exception as e:
        print(f"Error in chat processing: {e}")
        return jsonify({"error": f"Error communicating with Gemini: {e}"}), 500

if __name__ == '__main__':
    import os
    if not os.environ.get('WERKZEUG_RUN_MAIN'):
        print("Starting Flask application")
    app.run(debug=True)
