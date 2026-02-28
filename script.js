// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      // Close mobile menu if open
      const navLinks = document.getElementById('nav-links');
      const hamburger = document.getElementById('hamburger');
      if (navLinks && hamburger) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
      }
    }
  });
});

// Mobile Hamburger Menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    }
  });
}

// Header background on scroll + Scroll to Top Button
const header = document.querySelector('header');
const scrollToTopBtn = document.getElementById('scroll-to-top');

window.addEventListener('scroll', () => {
  // Header effect
  if (window.scrollY > 100) {
    header.style.background = 'rgba(10, 10, 10, 0.98)';
    header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
  } else {
    header.style.background = 'rgba(10, 10, 10, 0.95)';
    header.style.boxShadow = 'none';
  }

  // Scroll to top button visibility
  if (scrollToTopBtn) {
    if (window.scrollY > 500) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  }
});

// Scroll to top click handler
if (scrollToTopBtn) {
  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in-up');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('section, .skill-card, .project-card, .service-card, .timeline-item, .testimonial-card').forEach(el => {
  observer.observe(el);
});

// Contact Form Handler v2 (Backend Integration)
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // UI Elements
    const submitButton = document.getElementById('form-submit-btn') || this.querySelector('.form-submit');
    const originalContent = submitButton.innerHTML; // Save icon+text structure

    // 1. Loading State
    submitButton.innerHTML = '<span>⏳ Sending...</span>';
    submitButton.disabled = true;
    submitButton.style.opacity = '0.7';

    // Gather Data
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      subject: document.getElementById('subject').value,
      message: document.getElementById('message').value
    };

    try {
      // 2. Submit to Flask Backend
      const response = await fetch('http://localhost:5000/api/contact/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.status !== 'success' && !response.ok) throw new Error(result.message || "Server Error");

      // 3. Success State
      submitButton.innerHTML = '<span>✅ Message Sent!</span>';
      submitButton.style.background = '#27c93f'; // Brand Success Green
      submitButton.style.color = '#000';

      // Show Simulation Alert if applicable
      if (result.mode === 'simulation' || (result.data && result.data.mode === 'simulation')) {
        alert('Test Mode: Message received by backend simulation! (No real email sent)');
      }

      this.reset();

      // Reset Button after delay
      setTimeout(() => {
        submitButton.innerHTML = originalContent;
        submitButton.disabled = false;
        submitButton.style.background = '';
        submitButton.style.color = '';
        submitButton.style.opacity = '1';
      }, 3000);

    } catch (error) {
      console.error("Contact Error:", error);
      submitButton.innerHTML = '<span>❌ Failed.</span>';
      submitButton.style.background = '#ff3232'; // Error Red

      // Alert the specific error to guide the user
      alert(error.message);

      setTimeout(() => {
        submitButton.innerHTML = originalContent;
        submitButton.disabled = false;
        submitButton.style.background = '';
        submitButton.style.opacity = '1';
      }, 3000);
    }
  });
}

// Projects hover effect
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mouseenter', function () {
    this.style.transform = 'translateY(-10px) scale(1.02)';
  });
  card.addEventListener('mouseleave', function () {
    this.style.transform = 'translateY(0) scale(1)';
  });
});

// Skill cards animation on hover
document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('mouseenter', function () {
    this.style.transform = 'translateY(-10px) rotate(2deg)';
  });
  card.addEventListener('mouseleave', function () {
    this.style.transform = 'translateY(0) rotate(0deg)';
  });
});

// Active navigation link highlighting
const sections = document.querySelectorAll('section[id]');
const navLinksForActive = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (window.scrollY >= (sectionTop - 200)) {
      current = section.getAttribute('id');
    }
  });
  navLinksForActive.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').slice(1) === current) {
      link.classList.add('active');
    }
  });
});

// Add parallax effect to hero sphere
window.addEventListener('scroll', () => {
  const sphere = document.querySelector('.sphere');
  if (sphere) {
    const scrolled = window.scrollY;
    sphere.style.transform = `translateY(${scrolled * 0.3}px)`;
  }
});

console.log('Portfolio website loaded successfully!');

/* ============================================
   TYPING ANIMATION FOR HERO SECTION
   ============================================ */

const roles = ['Data Analyst', 'Python Developer', 'AI & ML Enthusiast', 'Machine Learning Engineer', 'Data Scientist'];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingSpeed = 100;
const deletingSpeed = 50;
const pauseDuration = 2000;

function typeRole() {
  const typingText = document.getElementById('typing-text');
  if (!typingText) return;

  const currentRole = roles[roleIndex];

  if (isDeleting) {
    typingText.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typingText.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? deletingSpeed : typingSpeed;

  if (!isDeleting && charIndex === currentRole.length) {
    delay = pauseDuration;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 500;
  }

  setTimeout(typeRole, delay);
}

// Start typing animation when page loads
document.addEventListener('DOMContentLoaded', function () {
  setTimeout(typeRole, 1000);
});

/* ============================================
   AI CHATBOT V2 - Enhanced Intelligence
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
  const chatToggle = document.getElementById('chat-toggle');
  const chatWindow = document.getElementById('chat-window');
  const chatClose = document.getElementById('chat-close');
  const chatMessages = document.getElementById('chat-messages');
  const chatOptions = document.getElementById('chat-options');
  const userInput = document.getElementById('user-input');
  const sendBtn = document.getElementById('send-btn');
  const themeToggle = document.getElementById('chat-theme-toggle');
  const voiceBtn = document.getElementById('voice-btn');
  const voiceIndicator = document.getElementById('voice-indicator');
  const chatNotification = document.getElementById('chat-notification');

  // Conversation context for smarter responses
  let conversationHistory = [];
  let userInterests = [];
  let isLightTheme = false;
  let recognition = null;

  // Load saved chat history from localStorage
  const savedHistory = localStorage.getItem('teegaChatHistory');
  const savedTheme = localStorage.getItem('teegaChatTheme');

  if (savedTheme === 'light') {
    isLightTheme = true;
    chatWindow?.classList.add('light-theme');
    if (themeToggle) themeToggle.textContent = '☀️';
  }

  // Save chat history function
  function saveChatHistory() {
    const messages = Array.from(chatMessages.querySelectorAll('.message')).map(msg => ({
      text: msg.innerHTML,
      isUser: msg.classList.contains('user-msg')
    }));
    localStorage.setItem('teegaChatHistory', JSON.stringify(messages.slice(-20))); // Keep last 20 messages
  }

  // Load chat history on open
  function loadChatHistory() {
    if (savedHistory) {
      try {
        const messages = JSON.parse(savedHistory);
        if (messages.length > 0) {
          messages.forEach(msg => {
            const msgDiv = document.createElement('div');
            msgDiv.classList.add('message', msg.isUser ? 'user-msg' : 'bot-msg');
            msgDiv.innerHTML = msg.text;
            chatMessages.appendChild(msgDiv);
          });
          chatMessages.scrollTop = chatMessages.scrollHeight;
          return true;
        }
      } catch (e) {
        console.log('Could not load chat history');
      }
    }
    return false;
  }

  // Clear chat history function
  function clearChatHistory() {
    localStorage.removeItem('teegaChatHistory');
    chatMessages.innerHTML = '';
    sendWelcomeMessage();
  }

  // Toggle Chat Window
  function toggleChat() {
    // V3: Add Voice Toggle Button dynamically
    const headerActions = document.querySelector('.chat-header-actions');
    if (headerActions && !document.getElementById('voice-toggle')) {
      const voiceBtn = document.createElement('button');
      voiceBtn.id = 'voice-toggle';
      voiceBtn.className = 'theme-toggle-btn';
      voiceBtn.innerHTML = '🔇'; // Default mute
      voiceBtn.title = "Toggle Voice Responses";
      voiceBtn.onclick = () => {
        isVoiceEnabled = !isVoiceEnabled;
        voiceBtn.innerHTML = isVoiceEnabled ? '🔊' : '🔇';
        if (isVoiceEnabled) speakText("Voice mode activated. I am listening.");
      };
      headerActions.insertBefore(voiceBtn, headerActions.firstChild);
    }

    chatWindow.classList.toggle('active');
    if (chatWindow.classList.contains('active')) {
      chatNotification.style.display = 'none';
      if (chatMessages.children.length === 0) {
        // Try to load saved history, otherwise show welcome
        const hasHistory = loadChatHistory();
        if (!hasHistory) {
          setTimeout(sendWelcomeMessage, 500);
        }
        showOptions();
      }
      userInput.focus();
    }
  }

  if (chatToggle) chatToggle.addEventListener('click', toggleChat);
  if (chatClose) chatClose.addEventListener('click', toggleChat);

  // Theme Toggle with persistence
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      isLightTheme = !isLightTheme;
      chatWindow.classList.toggle('light-theme', isLightTheme);
      this.textContent = isLightTheme ? '☀️' : '🌙';
      localStorage.setItem('teegaChatTheme', isLightTheme ? 'light' : 'dark');
    });
  }

  // Voice Input Setup
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = function () {
      voiceBtn.classList.add('recording');
      voiceIndicator.style.display = 'flex';
    };

    recognition.onend = function () {
      voiceBtn.classList.remove('recording');
      voiceIndicator.style.display = 'none';
    };

    recognition.onresult = function (event) {
      const transcript = event.results[0][0].transcript;
      userInput.value = transcript;
      handleUserInput();
    };

    recognition.onerror = function (event) {
      console.error('Speech recognition error:', event.error);
      voiceBtn.classList.remove('recording');
      voiceIndicator.style.display = 'none';
      addMessage("Sorry, I couldn't hear you. Please try again or type your message. 🎤", false);
    };

    if (voiceBtn) {
      voiceBtn.addEventListener('click', function () {
        if (voiceBtn.classList.contains('recording')) {
          recognition.stop();
        } else {
          recognition.start();
        }
      });
    }
  } else {
    if (voiceBtn) {
      voiceBtn.style.display = 'none';
    }
  }

  // Send Message Function with enhanced styling
  function addMessage(text, isUser, showSuggestions = false) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', isUser ? 'user-msg' : 'bot-msg');
    msgDiv.innerHTML = text;
    chatMessages.appendChild(msgDiv);

    // Add suggestions if needed
    if (showSuggestions && !isUser) {
      const suggestionsDiv = document.createElement('div');
      suggestionsDiv.classList.add('smart-suggestions');
      const suggestions = getContextualSuggestions();
      suggestions.forEach(suggestion => {
        const chip = document.createElement('span');
        chip.classList.add('suggestion-chip');
        chip.textContent = suggestion;
        chip.addEventListener('click', () => {
          userInput.value = suggestion;
          handleUserInput();
        });
        suggestionsDiv.appendChild(chip);
      });
      chatMessages.appendChild(suggestionsDiv);
    }

    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Track conversation
    conversationHistory.push({ text, isUser, timestamp: Date.now() });

    // Save to localStorage
    saveChatHistory();
  }

  // Get contextual suggestions based on conversation
  function getContextualSuggestions() {
    const lastBotMessage = conversationHistory.filter(m => !m.isUser).slice(-1)[0]?.text.toLowerCase() || '';

    if (lastBotMessage.includes('project')) {
      return ['Tell me more', 'View Skills', 'Contact Teega'];
    } else if (lastBotMessage.includes('skill') || lastBotMessage.includes('python')) {
      return ['See Projects', 'Get Resume', 'Hire Teega'];
    } else if (lastBotMessage.includes('contact') || lastBotMessage.includes('hire')) {
      return ['View Projects', 'About Teega', 'Get Resume'];
    }
    return ['Projects', 'Skills', 'Contact'];
  }

  // Handle Manual Input
  function handleUserInput() {
    const text = userInput.value.trim();
    if (text) {
      addMessage(text, true);
      userInput.value = '';
      showTyping();

      // Variable delay for more natural feel
      const delay = 800 + Math.random() * 700;
      setTimeout(() => {
        removeTyping();
        const response = getSmartResponse(text);
        addMessage(response.text, false, response.showSuggestions);
      }, delay);
    }
  }

  if (sendBtn) sendBtn.addEventListener('click', handleUserInput);
  if (userInput) userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleUserInput();
  });

  // Typing Indicator
  function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('message', 'bot-msg', 'typing-indicator');
    typingDiv.innerHTML = `<span></span><span></span><span></span>`;
    typingDiv.id = 'typing-indicator';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function removeTyping() {
    const typing = document.getElementById('typing-indicator');
    if (typing) typing.remove();
  }

  // ============================================
  // ENHANCED AI BRAIN V2 🧠
  // ============================================

  /* ============================================
     KNOWLEDGE BASE & INTELLIGENCE V4.0 (EXPERT MODE)
     ============================================ */
  const knowledgeBase = {
    name: "Teega Narasimharao",
    title: "Data Analyst & Python Developer",
    email: "teeganarasimharao@gmail.com",
    phone: "+91 7997181685",
    location: "India",
    skills: {
      programming: ["Python", "SQL", "JavaScript", "HTML/CSS"],
      dataScience: ["Machine Learning", "Deep Learning", "Data Analysis", "Statistical Modeling"],
      aiSkills: ["Vibe Coder", "Prompt Engineer", "AI Web Development", "AI Software Creation"],
      tools: ["Power BI", "Tableau", "TensorFlow", "PyTorch", "Pandas", "Scikit-learn"]
    },
    // V4: Expanded Project Details
    projects: [
      {
        name: "Speech Emotion Recognition",
        tags: ["ml", "python", "audio", "tensorflow", "speech"],
        desc: "ML system that detects human emotions from audio signals.",
        details: "Built using **TensorFlow and Keras**. It analyzes MFCC features from audio files to classify emotions like 'Happy', 'Sad', or 'Angry' with high accuracy. <strong>Published Research Paper Available!</strong> 📄"
      },
      {
        name: "Sales Analytics Dashboard",
        tags: ["power bi", "sql", "dashboard", "visualization", "sales"],
        desc: "Interactive dashboard providing real-time sales insights.",
        details: "Created with **Power BI and SQL**. It connects to a live database to visualize KPIs like secure revenue, regional performance, and product trends, helping stakeholders make data-driven decisions."
      },
      {
        name: "Fraud Detection System",
        tags: ["ml", "fraud", "security", "smote", "imbalanced"],
        desc: "High-precision model (98% acc) to detect fraudulent transactions.",
        details: "Addressed **imbalanced data** using SMOTE and used **Ensemble Methods** (Random Forest + XGBoost) to achieve 98% precision in identifying fraudulent financial activities."
      }
    ],
    // V4: Technical Knowledge Base (Expertise Demo)
    technicalKnowledge: {
      "smote": "SMOTE (Synthetic Minority Over-sampling Technique) creates synthetic data points to balance datasets. I used it in my Fraud Detection project! ⚖️",
      "random forest": "Random Forest is an ensemble learning method that constructs multiple decision trees. It's great for handling overfitting! 🌲",
      "tensorflow": "TensorFlow is an open-source library for machine learning. I used it to build the neural networks for my Speech Emotion Recognition system. 🧠",
      "python": "Python is my go-to language for Data Science because of its rich ecosystem like Pandas, NumPy, and Scikit-learn. 🐍",
      "sql": "I use SQL for querying databases, managing ETL pipelines, and performing complex data aggregations. 🗄️",
      "deep learning": "Deep Learning mimics the human brain using neural networks. I've applied it in audio processing and image recognition tasks. 🤖"
    },
    // V4: Personality & Chit-Chat
    personality: {
      "who made you": "I was vibed-coded by **Teega** using vanilla JavaScript and CSS! No external AI frameworks were harmed in my making. 😉",
      "are you real": "I'm a virtual assistant, but my logic is 100% real code! 🤖",
      "joke": "Why do Java developers wear glasses? Because they don't C#! 😆 (Sorry, I stick to Python mostly!)",
      "favorite color": "Electric Purple and Neon Green, obviously! 💜💚"
    },
    education: {
      degree: "B.Tech in Computer Data Science and Engineering",
      college: "Chalapathi Institute of Engineering and Technology",
      cgpa: "8.0",
      year: "2021-2025"
    },
    experience: {
      company: "CS CODENZ",
      role: "Data Analyst Internship",
      duration: "Jan 2024 - Apr 2024",
      highlights: "Reduced data processing time by 40% and built automated reporting pipelines."
    }
  };

  // Context memory
  let chatContext = {
    lastIntent: null,
    consecutiveFallbacks: 0
  };

  /**
   * CORE INTELLIGENCE FUNCTION
   * Uses weighted keyword matching for higher accuracy.
   */
  function getSmartResponse(input) {
    // 1. Normalize Input: remove punctuation, extra spaces, lowercase
    const cleanInput = input.toLowerCase().replace(/[?!.,]/g, '').trim();
    let response = { text: '', showSuggestions: true };

    // ============================================
    // V4: DYNAMIC INTELLIGENCE LAYERS
    // ============================================

    // Layer 1: Technical Knowledge Check
    if (knowledgeBase.technicalKnowledge) {
      for (const [term, answer] of Object.entries(knowledgeBase.technicalKnowledge)) {
        if (cleanInput.includes(term.toLowerCase())) {
          return { text: `💡 <strong>${term.toUpperCase()}:</strong> ${answer}`, showSuggestions: true };
        }
      }
    }

    // Layer 2: Personality & Chit-Chat
    if (knowledgeBase.personality) {
      for (const [question, answer] of Object.entries(knowledgeBase.personality)) {
        if (cleanInput.includes(question.toLowerCase())) {
          return { text: answer, showSuggestions: false };
        }
      }
    }

    // Layer 3: Project Deep Dive
    const specificProject = knowledgeBase.projects.find(p => cleanInput.includes(p.name.toLowerCase()));
    if (specificProject) {
      return {
        text: `🚀 <strong>${specificProject.name}:</strong><br><br>${specificProject.details || specificProject.desc}`,
        showSuggestions: true
      };
    }

    // Helper: Calculate Weighted Score (Legacy)
    const getScore = (text, keywords) => {
      let score = 0;
      keywords.forEach(word => {
        if (text === word) score += 3; // Perfect whole-word match
        else if (text.includes(word)) score += 1; // Partial match
      });
      return score;
    };

    // 2. Define Intents with Keywords
    const intents = [
      // --- HR / INTERVIEW INTENTS (HIGHEST PRIORITY) ---
      {
        id: 'hr_why_hire',
        keywords: ['why hire', 'hire you', 'why should', 'good fit', 'select you', 'value', 'bring to table'],
        response: [
          "🌟 <strong>Why Hire Teega?</strong><br><br>1. **Results-Driven:** He reduced processing time by 40% in his internship.<br>2. **Tech-Versatile:** Fluent in Python, SQL, and Modern AI tools.<br>3. **Quick Learner:** Consistently masters new tech (like Vibe Coding) rapidly.<br>4. **Problem Solver:** Proven success in complex projects like Fraud Detection."
        ]
      },
      {
        id: 'hr_strengths',
        keywords: ['strength', 'strong point', 'best at', 'skill', 'quality', 'superpower', 'greatest strength'],
        response: [
          "💪 <strong>Teega's Top Strengths:</strong><br><br>✅ **Analytical Thinking:** Turns messy data into clear insights.<br>✅ **Adaptability:** quickly learns and applies new AI technologies.<br>✅ **Communication:** Explains complex technical concepts simply.<br>✅ **Attention to Detail:** Precision in code and data analysis."
        ]
      },
      {
        id: 'hr_weaknesses',
        keywords: ['weakness', 'weak point', 'bad at', 'area of improvement', 'challenge'],
        response: [
          "⚖️ <strong>Professional Growth:</strong><br><br>Teega sometimes focuses heavily on perfecting small details. He is learning to balance this 'perfectionism' with agility to deliver solutions even faster, using tools like AI to accelerate his workflow."
        ]
      },
      {
        id: 'hr_five_years',
        keywords: ['5 years', 'five years', 'future goal', 'long term', 'where do you see'],
        response: [
          "🎯 <strong>In 5 Years...</strong><br><br>Teega aims to be a **Senior Data Specialist** or **AI Architect**, leading innovative projects that solve significant business problems. He plans to continuously upskill in Generative AI and Cloud Computing to stay at the cutting edge."
        ]
      },
      {
        id: 'hr_challenge',
        keywords: ['challenge', 'difficult', 'problem faced', 'obstacle', 'hardest'],
        response: [
          "🧩 <strong>Handling Challenges:</strong><br><br>During his Fraud Detection project, handling imbalanced data was tough. He used **SMOTE technique** and **Ensemble Methods** to solve it, achieving 98% precision. He views challenges as opportunities to learn!"
        ]
      },
      {
        id: 'salary',
        keywords: ['salary', 'ctc', 'expect', 'pay', 'compensation', 'package'],
        response: [
          "💰 <strong>Compensation:</strong><br><br>As a fresher, Teega prioritizes **learning and growth** opportunities. He is open to discussing salary based on industry standards for the role and the value he brings to your team."
        ]
      },

      // --- GENERAL INTENTS ---
      {
        id: 'greeting',
        keywords: ['hi', 'hello', 'hey', 'morning', 'evening', 'start'],
        response: [
          "Hello! 👋 I'm **T-Bot**, Teega's AI Assistant. I can answer complex questions like <em>'Why should we hire him?'</em> or <em>'What are his strengths?'</em>. Try me!",
          "Hi there! 🌟 **T-Bot** here! I'm fully upgraded to help you evaluate Teega's profile. Ask me about his **Skills**, **Projects**, or even **Interview Questions**!"
        ]
      },
      {
        id: 'identity',
        keywords: ['who are you', 'what are you', 'your name', 'bot'],
        response: ["I am **T-Bot**, a custom-coded AI Portfolio Agent built by Teega. 🤖 I demonstrate his ability to create intelligent, interactive software solutions."]
      },
      {
        id: 'about',
        keywords: ['about', 'who is', 'introduction', 'bio', 'profile', 'tell me about yourself'],
        response: [`<strong>${knowledgeBase.name}</strong> is a dedicated ${knowledgeBase.title}. 🚀<br><br>He combines strong foundational skills in Python/SQL with modern expertise in AI/ML. He's a problem-solver who loves digging into data to find answers.`]
      },
      {
        id: 'skills',
        keywords: ['skill', 'stack', 'technology', 'tech', 'python', 'sql', 'power bi', 'tools', 'language'],
        response: [`💻 <strong>Tech Stack:</strong><br><br>🔹 **Core:** Python, SQL, JavaScript<br>🔹 **Data/AI:** Machine Learning, Deep Learning, Power BI<br>🔹 **Modern AI:** Vibe Coding, Prompt Engineering<br><br>He is a full-stack data professional!`]
      },
      {
        id: 'projects',
        keywords: ['project', 'portfolio', 'work', 'built', 'creation', 'app'],
        response: [`🚀 <strong>Featured Projects:</strong><br><br>1. **Speech Emotion Recognition** (Audio AI)<br>2. **Fraud Detection System** (FinTech Security)<br>3. **Sales Dashboard** (Business Intelligence)<br><br>Ask for details on any of these!`],
        action: () => setTimeout(() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }), 1500)
      },
      {
        id: 'contact',
        keywords: ['contact', 'email', 'phone', 'call', 'reach', 'address'],
        response: [`📞 <strong>Contact Details:</strong><br><br>📧 ${knowledgeBase.email}<br>📱 ${knowledgeBase.phone}<br><br>Feel free to reach out anytime!`],
        action: () => setTimeout(() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }), 1500)
      },
      {
        id: 'farewell',
        keywords: ['bye', 'goodbye', 'exit', 'see you'],
        response: ["Goodbye! 👋 Thank you for your time. Please consider downloading Teega's resume before you go!"],
        action: () => { response.showSuggestions = false; }
      }
    ];

    // 3. Scoring Engine (V3: FUZZY LOGIC EMBEDDED) 🧠
    let bestMatch = null;
    let maxScore = 0;

    // V3: Levenshtein Distance for Typo Tolerance
    const levenshtein = (a, b) => {
      const matrix = [];
      for (let i = 0; i <= b.length; i++) matrix[i] = [i];
      for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
      for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
          if (b.charAt(i - 1) === a.charAt(j - 1)) matrix[i][j] = matrix[i - 1][j - 1];
          else matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
        }
      }
      return matrix[b.length][a.length];
    };

    // V3: Enhanced Scoring with Fuzzy Logic
    const getEnhancedScore = (input, keywords) => {
      let score = 0;
      const inputWords = input.split(' ');

      keywords.forEach(keyword => {
        // 1. Exact & Partial Match
        if (input.includes(keyword)) score += 3;

        // 2. Fuzzy Match (Typo Correction)
        inputWords.forEach(word => {
          if (Math.abs(word.length - keyword.length) <= 2 && word.length > 3) {
            const dist = levenshtein(word, keyword);
            if (dist <= 1) score += 2; // Strong typo match (1 char wrong)
            else if (dist <= 2) score += 1; // Weak typo match
          }
        });
      });
      return score;
    };

    // V3: Command Handling (Direct Actions)
    if (input.includes('dark mode') || input.includes('light mode')) {
      document.body.classList.toggle('light-theme');
      return { text: "Theme toggled! 🌗 how does it look?", showSuggestions: false };
    }
    if (input.includes('download resume')) {
      window.open('Narasimharao_Resume.pdf', '_blank');
      return { text: "Downloading Resume now... 📄", showSuggestions: false };
    }

    // Evaluate Intents
    intents.forEach(intent => {
      const score = getEnhancedScore(cleanInput, intent.keywords);
      if (score > maxScore) {
        maxScore = score;
        bestMatch = intent;
      }
    });

    // 4. Fallback & Context Handling
    // If score is low but we have context, try to recover
    if (maxScore === 0 && chatContext.lastIntent) {
      // Simple context follow-up checks
      if (cleanInput.includes('more') || cleanInput.includes('example') || cleanInput.includes('detail')) {
        if (chatContext.lastIntent === 'skills') {
          response.text = "For example, in **Python**, he uses libraries like Pandas for analysis and TensorFlow for AI models. 🐍";
          return response;
        }
      }
    }

    // 5. Final Response Generation
    if (bestMatch && maxScore > 0) {
      chatContext.lastIntent = bestMatch.id;
      chatContext.consecutiveFallbacks = 0;
      response.text = bestMatch.response[Math.floor(Math.random() * bestMatch.response.length)];
      if (bestMatch.action) bestMatch.action();

      // Auto-interest tracking
      if (['skills', 'projects'].includes(bestMatch.id)) userInterests.push('tech');

    } else {
      // Intelligent Fallback
      chatContext.consecutiveFallbacks++;
      const fallbacks = [
        "That's a great question! 🧠 To ensure I give the best answer, could you ask about his **Skills**, **Projects**, or **Experience** specifically?",
        "I'm tuned to answer questions about Teega's professional profile. Try asking: *'Why should we hire him?'* or *'What represents his best work?'*",
        "I missed that connection. 🤔 I can tell you about his **Python expertise**, **Data Science projects**, or **contact info**. What do you prefer?"
      ];
      response.text = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }

    return response;
  }

  // Initial Welcome with enhanced message
  function sendWelcomeMessage() {
    addMessage("Hello! 👋 I'm **T-Bot**, Teega's AI Assistant - upgraded with smarter responses!", false);
    setTimeout(() => {
      addMessage("I can help you explore his projects, skills, and experience. Try voice input 🎤 or type your questions!", false, true);
      showOptions();
    }, 1000);
  }

  // Enhanced Options - Scrolling Marquee
  function showOptions() {
    const buttons = `
      <button class="chat-opt-btn" onclick="handleOption('about')">👤 About</button>
      <button class="chat-opt-btn" onclick="handleOption('projects')">🚀 Projects</button>
      <button class="chat-opt-btn" onclick="handleOption('skills')">💻 Skills</button>
      <button class="chat-opt-btn" onclick="handleOption('experience')">💼 Experience</button>
      <button class="chat-opt-btn" onclick="handleOption('education')">🎓 Education</button>
      <button class="chat-opt-btn" onclick="handleOption('contact')">📞 Contact</button>
      <button class="chat-opt-btn" onclick="handleOption('resume')">📄 Resume</button>
      <button class="chat-opt-btn" onclick="handleOption('hire')">🤝 Hire</button>
    `;
    // Duplicate buttons for seamless scrolling loop
    chatOptions.innerHTML = `
      <div class="chat-options-inner">
        ${buttons}
        ${buttons}
      </div>
    `;
  }

  // Handle Button Clicks
  window.handleOption = function (option) {
    let userText = '';
    let botResponse = '';

    switch (option) {
      case 'projects':
        userText = 'Show me the projects 🚀';
        botResponse = 'Teega has built amazing projects like Speech Emotion Recognition and Fraud Detection! Scrolling to projects section...';
        setTimeout(() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }), 800);
        break;
      case 'skills':
        userText = 'What are Teega\'s skills? 💻';
        botResponse = 'Teega is an expert in Python, SQL, Machine Learning, and Data Visualization. He also knows TensorFlow, Power BI, and more!';
        setTimeout(() => document.querySelector('#skills')?.scrollIntoView({ behavior: 'smooth' }), 800);
        break;
      case 'experience':
        userText = 'Tell me about experience 💼';
        botResponse = 'Teega completed a Data Analyst Internship at CS CODENZ where he worked on real-world data projects!';
        setTimeout(() => document.querySelector('#experience')?.scrollIntoView({ behavior: 'smooth' }), 800);
        break;
      case 'contact':
        userText = 'How can I contact Teega? 📞';
        botResponse = `You can reach Teega at:<br>📧 ${knowledgeBase.email}<br>📱 ${knowledgeBase.phone}<br><br>Taking you to the contact form!`;
        setTimeout(() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }), 800);
        break;
      case 'resume':
        userText = 'Get Resume 📄';
        botResponse = 'Opening Teega\'s resume in a new tab. It shows all his qualifications and achievements!';
        setTimeout(() => window.open('Narasimharao_Resume.pdf', '_blank'), 500);
        break;
      case 'hire':
        userText = 'I want to hire Teega 🤝';
        botResponse = 'Excellent choice! 🎉 Teega is available for full-time, freelance, and remote opportunities. He can start immediately! Let me take you to the contact form.';
        setTimeout(() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }), 800);
        break;
      case 'about':
        userText = 'Tell me about Teega 👤';
        botResponse = `<strong>${knowledgeBase.name}</strong> is a passionate ${knowledgeBase.title}! 🚀<br><br>He transforms complex data into actionable insights and builds intelligent AI solutions. Currently completing his B.Tech with 8 CGPA.`;
        setTimeout(() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' }), 800);
        break;
      case 'education':
        userText = 'What about education? 🎓';
        botResponse = `🎓 <strong>Education:</strong><br><br>• ${knowledgeBase.education.degree}<br>• ${knowledgeBase.education.college}<br>• ${knowledgeBase.education.cgpa} with Distinction`;
        setTimeout(() => document.querySelector('#education')?.scrollIntoView({ behavior: 'smooth' }), 800);
        break;
      case 'clear':
        clearChatHistory();
        return; // Don't add messages, just clear
    }

    addMessage(userText, true);
    setTimeout(() => addMessage(botResponse, false), 600);
  };

  // Show notification when closed
  setTimeout(() => {
    if (!chatWindow.classList.contains('active')) {
      chatNotification.style.display = 'flex';
    }
  }, 3000);
});

/* --- 3D Bot Logo with Three.js --- */
document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('chat-toggle');

  setTimeout(() => {
    if (container && typeof THREE !== 'undefined') {
      try {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        const size = container.clientWidth || 60;
        renderer.setSize(size, size);

        while (container.firstChild) {
          if (!container.firstChild.classList?.contains('chat-pulsing-ring') &&
            !container.firstChild.classList?.contains('chat-notification')) {
            container.removeChild(container.firstChild);
          } else {
            break;
          }
        }

        container.insertBefore(renderer.domElement, container.firstChild);

        const geometry = new THREE.OctahedronGeometry(1.2, 0);
        const material = new THREE.MeshBasicMaterial({
          color: 0xb8ff3c, // Lime green to match theme
          wireframe: true,
          transparent: true,
          opacity: 0.8
        });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        camera.position.z = 3.5;

        function animate() {
          requestAnimationFrame(animate);
          if (sphere) {
            sphere.rotation.x += 0.008;
            sphere.rotation.y += 0.01;
            sphere.position.y = Math.sin(Date.now() * 0.002) * 0.15;
          }
          renderer.render(scene, camera);
        }

        animate();

        container.addEventListener('mouseenter', () => {
          material.color.setHex(0x7b61ff); // Purple on hover
          material.opacity = 1;
        });
        container.addEventListener('mouseleave', () => {
          material.color.setHex(0xb8ff3c);
          material.opacity = 0.8;
        });

        console.log("3D Bot V2 Initialized Successfully");
      } catch (e) {
        console.error("Three.js initialization failed:", e);
        container.innerHTML = '<span class="chat-icon">🤖</span><span class="chat-pulsing-ring"></span>';
      }
    } else {
      console.log("Container or THREE not found, using fallback");
      if (container) {
        container.innerHTML = '<span class="chat-icon" style="font-size: 2rem;">🤖</span><span class="chat-pulsing-ring"></span>';
      }
    }
  }, 100);
});

/* ============================================
     3D DATA GLOBE VISUALIZATION (Three.js) 🌍
     ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  function init3DGlobe() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    // Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Create Particles (Data Points)
    const geometry = new THREE.BufferGeometry();
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const color1 = new THREE.Color(0xb8ff3c); // Neon Green
    const color2 = new THREE.Color(0x7b61ff); // Electric Purple

    for (let i = 0; i < count; i++) {
      // Spherical coordinates
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const radius = 2.5;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Mix colors
      const mixedColor = Math.random() > 0.8 ? color1 : color2;
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Material
    const material = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    const sphere = new THREE.Points(geometry, material);
    scene.add(sphere);

    camera.position.z = 5.5;

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    const windowHalfX = container.clientWidth / 2;
    const windowHalfY = container.clientHeight / 2;

    container.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX - windowHalfX) * 0.001;
      mouseY = (e.clientY - windowHalfY) * 0.001;
    });

    const animate = () => {
      requestAnimationFrame(animate);

      // Constant smooth rotation (Base)
      sphere.rotation.y += 0.004;

      // Mouse Interaction
      const targetRotX = mouseY * 0.5; // Sensitivity
      const targetRotY = mouseX * 0.5;

      // Smoothly interpolate towards mouse target
      sphere.rotation.x += 0.05 * (targetRotX - sphere.rotation.x);
      // Add mouse component to Y rotation without stopping base spin
      sphere.rotation.y += 0.05 * (targetRotY);

      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });
  }

  // Initialize Globe on Load
  setTimeout(init3DGlobe, 500); // Small delay to ensure layout
});

// ================================================
// PREMIUM PROJECT DEMO MODAL — INLINE DEMO ENGINE
// ================================================

// Shared state for cleanup
let _pmCharts = [];
let _pmIntervals = [];
let _pmAnimation = null;
let _pmAudioCtx = null;
let _pmAudioSource = null;

function _pmCleanup() {
  // Destroy Chart.js instances
  _pmCharts.forEach(c => { try { c.destroy(); } catch (e) { } });
  _pmCharts = [];
  // Clear intervals/timeouts
  _pmIntervals.forEach(id => clearInterval(id));
  _pmIntervals = [];
  if (_pmAnimation) { cancelAnimationFrame(_pmAnimation); _pmAnimation = null; }
  // Release audio
  if (_pmAudioCtx) { try { _pmAudioCtx.close(); } catch (e) { } _pmAudioCtx = null; }
}

// ESC to close
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeProjectModal();
});

// Project data registry
const PROJECT_REGISTRY = {
  ser: {
    icon: '🤖', title: 'Speech Emotion Recognition',
    badges: ['Python', 'TensorFlow', 'Librosa'],
    pageUrl: 'project-ser.html',
    info: {
      title: 'About this Project',
      desc: 'Deep learning CNN+LSTM model that detects human emotions from raw audio signals. Trained on RAVDESS & TESS datasets with MFCC feature extraction, achieving 92% accuracy.',
      metrics: [
        { val: '92%', lbl: 'Accuracy' },
        { val: '6', lbl: 'Emotions' },
        { val: '40ms', lbl: 'Latency' },
        { val: '500+', lbl: 'Streams' }
      ],
      tech: ['Python', 'TensorFlow', 'Keras', 'Librosa', 'NumPy', 'Matplotlib']
    },
    buildDemo(area) {
      area.innerHTML = `
        <div class="pm-visualizer" id="pm-viz"></div>
        <div style="display:flex;gap:.8rem;justify-content:center;margin-bottom:1rem;">
          <button class="pm-ctrl-btn" id="pm-rec-btn">🎙️ Record Audio</button>
          <button class="pm-ctrl-btn" id="pm-upload-btn">📁 Use Sample Clip</button>
        </div>
        <div class="pm-emotion-result" id="pm-emotion-result">
          <span id="pm-emotion-text">— Waiting for audio —</span>
        </div>`;

      // Build waveform bars
      const viz = document.getElementById('pm-viz');
      const bars = [];
      for (let i = 0; i < 36; i++) {
        const b = document.createElement('div');
        b.className = 'pm-wave-bar';
        viz.appendChild(b);
        bars.push(b);
      }

      let isRecording = false;
      let analyser, sourceNode, stream;

      const recBtn = document.getElementById('pm-rec-btn');
      const uploadBtn = document.getElementById('pm-upload-btn');
      const resultBox = document.getElementById('pm-emotion-result');
      const emotionText = document.getElementById('pm-emotion-text');

      const EMOTIONS = [
        { text: 'Happy', icon: '😊', conf: 96 },
        { text: 'Neutral', icon: '😐', conf: 88 },
        { text: 'Energetic', icon: '⚡', conf: 92 },
        { text: 'Calm', icon: '😌', conf: 94 },
        { text: 'Angry', icon: '😠', conf: 85 },
        { text: 'Sad', icon: '😢', conf: 79 }
      ];

      function stopRecording() {
        isRecording = false;
        if (_pmAudioCtx) { _pmAudioCtx.close(); _pmAudioCtx = null; }
        if (stream) { stream.getTracks().forEach(t => t.stop()); }
        cancelAnimationFrame(_pmAnimation); _pmAnimation = null;
        bars.forEach(b => { b.classList.remove('recording'); b.style.height = '10px'; });
        recBtn.textContent = '🎙️ Record Again';
        const e = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
        emotionText.innerHTML = `${e.icon} ${e.text} &nbsp;<span style="color:#888;font-size:.9rem">(${e.conf}% confidence)</span>`;
        resultBox.classList.add('visible');
      }

      function animateBars() {
        if (!isRecording || !analyser) return;
        _pmAnimation = requestAnimationFrame(animateBars);
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        const step = Math.floor(data.length / bars.length);
        bars.forEach((b, i) => {
          const h = Math.max(6, (data[i * step] / 255) * 100);
          b.style.height = h + 'px';
          b.style.background = data[i * step] > 180 ? '#ff0055' : '#b8ff3c';
        });
      }

      recBtn.addEventListener('click', async () => {
        if (isRecording) { stopRecording(); return; }
        resultBox.classList.remove('visible');
        try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          _pmAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
          analyser = _pmAudioCtx.createAnalyser();
          analyser.fftSize = 256;
          sourceNode = _pmAudioCtx.createMediaStreamSource(stream);
          sourceNode.connect(analyser);
          isRecording = true;
          bars.forEach(b => b.classList.add('recording'));
          recBtn.textContent = '⏹️ Stop Recording';
          animateBars();
          // Auto-stop after 4s
          setTimeout(() => { if (isRecording) stopRecording(); }, 4000);
        } catch (err) {
          // mic denied — use simulation
          bars.forEach(b => b.classList.add('recording'));
          recBtn.textContent = '⏹️ Stop Recording';
          isRecording = true;
          setTimeout(() => { if (isRecording) stopRecording(); }, 3000);
        }
      });

      uploadBtn.addEventListener('click', () => {
        if (isRecording) { stopRecording(); return; }
        resultBox.classList.remove('visible');
        bars.forEach(b => { b.classList.add('recording'); b.style.height = '10px'; });
        setTimeout(() => {
          bars.forEach(b => b.classList.remove('recording'));
          const e = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
          emotionText.innerHTML = `${e.icon} ${e.text} &nbsp;<span style="color:#888;font-size:.9rem">(${e.conf}% confidence)</span>`;
          resultBox.classList.add('visible');
        }, 2500);
      });
    }
  },

  sales: {
    icon: '📊', title: 'Sales Analytics Dashboard',
    badges: ['Power BI', 'SQL', 'DAX'],
    pageUrl: 'project-sales.html',
    info: {
      title: 'About this Project',
      desc: 'Interactive BI dashboard transforming raw sales data into real-time KPIs. Helped identify 15% revenue growth opportunities and saved 20+ hours/week of manual reporting.',
      metrics: [
        { val: '$1.8M', lbl: 'Revenue (2024)' },
        { val: '+22%', lbl: 'YoY Growth' },
        { val: '6.1k', lbl: 'Orders' },
        { val: '20+', lbl: 'Hrs Saved/Wk' }
      ],
      tech: ['Power BI', 'SQL', 'DAX', 'Data Warehousing', 'Excel', 'Python']
    },
    buildDemo(area) {
      area.innerHTML = `
        <div class="pm-stats-row">
          <div class="pm-stat"><div class="pm-stat-val" id="ps-rev">$1.2M</div><div class="pm-stat-lbl">Revenue</div></div>
          <div class="pm-stat"><div class="pm-stat-val" id="ps-ord">5,432</div><div class="pm-stat-lbl">Orders</div></div>
          <div class="pm-stat"><div class="pm-stat-val" id="ps-avg">$220</div><div class="pm-stat-lbl">Avg Value</div></div>
          <div class="pm-stat"><div class="pm-stat-val" id="ps-grw">+15%</div><div class="pm-stat-lbl">Growth</div></div>
        </div>
        <div style="display:grid;grid-template-columns:2fr 1fr;gap:1rem;">
          <div class="pm-chart-wrap" style="height:220px;margin:0;"><canvas id="pm-line-chart"></canvas></div>
          <div class="pm-chart-wrap" style="height:220px;margin:0;"><canvas id="pm-pie-chart"></canvas></div>
        </div>
        <div class="pm-controls" style="margin-top:.8rem;">
          <button class="pm-ctrl-btn active" data-year="2023" onclick="pmSalesYear(this,'2023')">2023</button>
          <button class="pm-ctrl-btn" data-year="2024" onclick="pmSalesYear(this,'2024')">2024</button>
          <button class="pm-ctrl-btn active" data-metric="revenue" onclick="pmSalesMetric(this,'revenue')">Revenue</button>
          <button class="pm-ctrl-btn" data-metric="orders" onclick="pmSalesMetric(this,'orders')">Orders</button>
        </div>`;

      const salesData = {
        '2023': { revenue: [12, 19, 3, 5, 2, 3, 15, 21, 18, 25, 29, 32], orders: [120, 190, 30, 50, 20, 30, 150, 210, 180, 250, 290, 320], cats: [30, 20, 15, 35], stats: { rev: '$1.2M', ord: '5,432', avg: '$220', grw: '+15%' } },
        '2024': { revenue: [15, 22, 6, 8, 5, 6, 18, 25, 22, 28, 34, 38], orders: [150, 220, 60, 80, 50, 60, 180, 250, 220, 280, 340, 380], cats: [40, 25, 10, 25], stats: { rev: '$1.8M', ord: '6,100', avg: '$295', grw: '+22%' } }
      };
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      let curYear = '2023', curMetric = 'revenue';

      const lineCtx = document.getElementById('pm-line-chart').getContext('2d');
      const pieCtx = document.getElementById('pm-pie-chart').getContext('2d');

      const commonOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#ccc', boxWidth: 10 } } } };

      const lineChart = new Chart(lineCtx, {
        type: 'line',
        data: {
          labels: months,
          datasets: [{ label: 'Revenue (k$)', data: salesData['2023'].revenue, borderColor: '#b8ff3c', backgroundColor: 'rgba(184,255,60,.08)', tension: .4, fill: true }]
        },
        options: { ...commonOpts, scales: { x: { grid: { color: 'rgba(255,255,255,.07)' }, ticks: { color: '#888', font: { size: 9 } } }, y: { grid: { color: 'rgba(255,255,255,.07)' }, ticks: { color: '#888', font: { size: 9 } } } } }
      });
      const pieChart = new Chart(pieCtx, {
        type: 'doughnut',
        data: {
          labels: ['Electronics', 'Fashion', 'Home', 'Sports'],
          datasets: [{ data: salesData['2023'].cats, backgroundColor: ['#b8ff3c', '#7b61ff', '#ff0055', '#00ccff'], borderWidth: 0 }]
        },
        options: { ...commonOpts, plugins: { legend: { position: 'bottom', labels: { color: '#ccc', boxWidth: 10, font: { size: 9 } } } } }
      });
      _pmCharts.push(lineChart, pieChart);

      function updateSales() {
        const d = salesData[curYear];
        lineChart.data.datasets[0].data = d[curMetric];
        lineChart.data.datasets[0].label = curMetric === 'revenue' ? 'Revenue (k$)' : 'Orders';
        lineChart.data.datasets[0].borderColor = curMetric === 'revenue' ? '#b8ff3c' : '#7b61ff';
        lineChart.data.datasets[0].backgroundColor = curMetric === 'revenue' ? 'rgba(184,255,60,.08)' : 'rgba(123,97,255,.08)';
        lineChart.update();
        pieChart.data.datasets[0].data = d.cats;
        pieChart.update();
        document.getElementById('ps-rev').textContent = d.stats.rev;
        document.getElementById('ps-ord').textContent = d.stats.ord;
        document.getElementById('ps-avg').textContent = d.stats.avg;
        document.getElementById('ps-grw').textContent = d.stats.grw;
      }

      window.pmSalesYear = (btn, year) => {
        curYear = year;
        document.querySelectorAll('[data-year]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateSales();
      };
      window.pmSalesMetric = (btn, metric) => {
        curMetric = metric;
        document.querySelectorAll('[data-metric]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateSales();
      };
    }
  },

  fraud: {
    icon: '🔍', title: 'Fraud Detection System',
    badges: ['Scikit-learn', 'XGBoost', 'SMOTE'],
    pageUrl: 'project-fraud.html',
    info: {
      title: 'About this Project',
      desc: 'Random Forest + XGBoost ensemble trained on 280,000+ transactions. Uses SMOTE to handle class imbalance, achieving 98.5% precision with <50ms API latency.',
      metrics: [
        { val: '98.5%', lbl: 'Precision' },
        { val: '0.2%', lbl: 'False Positives' },
        { val: '<50ms', lbl: 'API Latency' },
        { val: '280k+', lbl: 'Training Records' }
      ],
      tech: ['Python', 'Scikit-learn', 'XGBoost', 'Pandas', 'SMOTE', 'FastAPI', 'Docker']
    },
    buildDemo(area) {
      area.innerHTML = `
        <div class="pm-fraud-grid">
          <div class="pm-form-group">
            <label>Transaction Amount ($)</label>
            <input type="number" class="pm-input" id="pf-amount" placeholder="e.g. 5000" min="0">
          </div>
          <div class="pm-form-group">
            <label>Location</label>
            <select class="pm-select" id="pf-location">
              <option value="us">United States (Home)</option>
              <option value="uk">United Kingdom</option>
              <option value="ng">Nigeria</option>
              <option value="ru">Russia</option>
              <option value="cn">China</option>
            </select>
          </div>
        </div>
        <div class="pm-form-group" style="margin-bottom:.8rem;">
          <label>Merchant Category</label>
          <select class="pm-select" id="pf-category">
            <option value="retail">Retail / Groceries</option>
            <option value="tech">Electronics</option>
            <option value="jewelry">Luxury / Jewelry</option>
            <option value="gaming">Online Gaming</option>
          </select>
        </div>
        <div style="display:flex;gap:.6rem;">
          <button class="pm-submit-btn" style="flex:2" onclick="pmFraudAnalyze()">🔍 Analyze Transaction</button>
          <button class="pm-ctrl-btn" style="flex:1" onclick="pmFraudSample()">⚠️ Sample Fraud</button>
        </div>
        <div class="pm-result-panel" id="pf-result"></div>`;

      window.pmFraudSample = () => {
        document.getElementById('pf-amount').value = 12500;
        document.getElementById('pf-location').value = 'ru';
        document.getElementById('pf-category').value = 'jewelry';
      };

      window.pmFraudAnalyze = () => {
        const amount = parseFloat(document.getElementById('pf-amount').value) || 0;
        const loc = document.getElementById('pf-location').value;
        const cat = document.getElementById('pf-category').value;
        const result = document.getElementById('pf-result');
        result.classList.remove('visible', 'pm-risk-safe', 'pm-risk-danger');

        let risk = 0, factors = [];
        if (amount > 10000) { risk += 40; factors.push('High Transaction Value'); }
        else if (amount > 5000) { risk += 20; }
        if (loc !== 'us' && loc !== 'uk') { risk += 35; factors.push('High-Risk Geo-Location'); }
        if (cat === 'jewelry' || cat === 'gaming') { risk += 25; factors.push('High-Risk Merchant Category'); }
        risk = Math.min(100, risk);
        const isFraud = risk >= 50;

        setTimeout(() => {
          result.className = 'pm-result-panel visible ' + (isFraud ? 'pm-risk-danger' : 'pm-risk-safe');
          result.innerHTML = isFraud
            ? `<div style="font-size:1.3rem;font-weight:800">⚠️ HIGH RISK DETECTED</div>
               <div style="font-size:1.8rem;font-weight:900;margin:.4rem 0">Risk Score: ${risk}/100</div>
               <div style="font-size:.85rem;opacity:.8">Flags: ${factors.join(' · ')}</div>
               <div style="margin-top:.5rem;font-weight:700">🚫 BLOCK TRANSACTION</div>`
            : `<div style="font-size:1.3rem;font-weight:800">✅ TRANSACTION SAFE</div>
               <div style="font-size:1.8rem;font-weight:900;margin:.4rem 0">Risk Score: ${risk}/100</div>
               <div style="font-size:.85rem;opacity:.8">All parameters within normal range</div>
               <div style="margin-top:.5rem;font-weight:700">✔️ APPROVE</div>`;
        }, 900);
      };
    }
  },

  customer: {
    icon: '🎯', title: 'Customer Segmentation',
    badges: ['K-Means', 'Pandas', 'Seaborn'],
    pageUrl: 'project-customer.html',
    info: {
      title: 'About this Project',
      desc: 'K-Means clustering with RFM (Recency, Frequency, Monetary) feature engineering to segment customers into 4 behavioral groups, boosting campaign conversions by 25%.',
      metrics: [
        { val: '+25%', lbl: 'Conversions' },
        { val: '4', lbl: 'Segments' },
        { val: '0.83', lbl: 'Silhouette' },
        { val: '15k+', lbl: 'Customers' }
      ],
      tech: ['Python', 'Scikit-learn', 'Pandas', 'Matplotlib', 'Seaborn', 'Elbow Method']
    },
    buildDemo(area) {
      area.innerHTML = `
        <div class="pm-cluster-legend">
          <div class="pm-legend-item"><span class="pm-legend-dot" style="background:#ff6384"></span>VIP (High Spenders)</div>
          <div class="pm-legend-item"><span class="pm-legend-dot" style="background:#36a2eb"></span>Loyal Savers</div>
          <div class="pm-legend-item"><span class="pm-legend-dot" style="background:#ffce56"></span>New Customers</div>
          <div class="pm-legend-item"><span class="pm-legend-dot" style="background:#4bc0c0"></span>At Risk</div>
        </div>
        <div class="pm-chart-wrap" style="height:230px;"><canvas id="pm-scatter-chart"></canvas></div>
        <div style="display:flex;gap:.6rem;align-items:flex-end;flex-wrap:wrap;margin-top:.8rem;">
          <div style="flex:1;min-width:100px;">
            <label style="font-size:.8rem;color:#999;display:block;margin-bottom:.3rem">Annual Income (k$)</label>
            <input type="number" class="pm-input" id="pc-income" placeholder="10–100" min="10" max="100">
          </div>
          <div style="flex:1;min-width:100px;">
            <label style="font-size:.8rem;color:#999;display:block;margin-bottom:.3rem">Spending Score (1–100)</label>
            <input type="number" class="pm-input" id="pc-score" placeholder="1–100" min="1" max="100">
          </div>
          <button class="pm-submit-btn" style="flex:1;min-width:100px;" onclick="pmCustomerPredict()">Predict Segment</button>
        </div>
        <div class="pm-result-panel pm-risk-safe" id="pc-result"></div>`;

      function genCluster(n, xR, yR) {
        return Array.from({ length: n }, () => ({
          x: Math.random() * (xR[1] - xR[0]) + xR[0],
          y: Math.random() * (yR[1] - yR[0]) + yR[0]
        }));
      }

      const ctx = document.getElementById('pm-scatter-chart').getContext('2d');
      const chart = new Chart(ctx, {
        type: 'scatter',
        data: {
          datasets: [
            { label: 'VIP', data: genCluster(25, [70, 100], [70, 100]), backgroundColor: '#ff6384', pointRadius: 5 },
            { label: 'Loyal', data: genCluster(35, [40, 70], [40, 70]), backgroundColor: '#36a2eb', pointRadius: 5 },
            { label: 'New', data: genCluster(40, [10, 40], [10, 50]), backgroundColor: '#ffce56', pointRadius: 5 },
            { label: 'At Risk', data: genCluster(20, [60, 90], [10, 40]), backgroundColor: '#4bc0c0', pointRadius: 5 }
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => `${c.dataset.label}: (${c.parsed.x.toFixed(0)}, ${c.parsed.y.toFixed(0)}k)` } } },
          scales: {
            x: { title: { display: true, text: 'Spending Score', color: '#888', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,.07)' }, ticks: { color: '#888', font: { size: 9 } }, min: 0, max: 100 },
            y: { title: { display: true, text: 'Annual Income (k$)', color: '#888', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,.07)' }, ticks: { color: '#888', font: { size: 9 } }, min: 0, max: 120 }
          }
        }
      });
      _pmCharts.push(chart);

      window.pmCustomerPredict = () => {
        const income = parseInt(document.getElementById('pc-income').value);
        const score = parseInt(document.getElementById('pc-score').value);
        if (!income || !score) return;
        let label = 'New Customer';
        if (income > 60 && score > 60) label = 'VIP 👑';
        else if (income > 35 && score > 35 && score < 75) label = 'Loyal Saver 💙';
        else if (income > 50 && score < 40) label = 'At Risk ⚠️';

        chart.data.datasets = chart.data.datasets.filter(d => d.label !== 'Your Customer');
        chart.data.datasets.push({
          label: 'Your Customer', data: [{ x: score, y: income }],
          backgroundColor: '#fff', pointRadius: 10, pointStyle: 'star'
        });
        chart.update();
        const res = document.getElementById('pc-result');
        res.innerHTML = `<strong>Predicted Segment:</strong> ${label}`;
        res.classList.add('visible');
      };
    }
  },

  webscrape: {
    icon: '🌐', title: 'Automated Web Scraper',
    badges: ['Selenium', 'BeautifulSoup', 'Python'],
    pageUrl: 'project-webscrape.html',
    info: {
      title: 'About this Project',
      desc: 'High-performance data extraction engine using Selenium + Beautiful Soup. Features rotating proxies, CAPTCHA evasion, async processing, and exports clean JSON/CSV.',
      metrics: [
        { val: '90%', lbl: 'Manual Work Cut' },
        { val: '100k+', lbl: 'Products/Day' },
        { val: '0', lbl: 'IP Bans' },
        { val: '192', lbl: 'Items/Run' }
      ],
      tech: ['Python', 'Selenium', 'Beautiful Soup', 'Requests', 'JSON', 'CSV', 'Proxies']
    },
    buildDemo(area) {
      area.innerHTML = `
        <div class="pm-terminal">
          <div class="pm-term-header">
            <span class="pm-term-dot" style="background:#ff5f56"></span>
            <span class="pm-term-dot" style="background:#ffbd2e"></span>
            <span class="pm-term-dot" style="background:#27c93f"></span>
            <span style="margin-left:8px;font-size:.75rem;color:#666">scraper_bot.py</span>
          </div>
          <div class="pm-term-body" id="pw-terminal">
            <div><span class="pm-term-prompt">teega@portfolio:~/scraper$</span> <span id="pw-cursor">_</span></div>
          </div>
        </div>
        <div style="display:flex;gap:.6rem;margin-top:.8rem;">
          <button class="pm-ctrl-btn" id="pw-run" onclick="pmScrapeRun()" style="flex:2">▶ Run Scraper</button>
          <button class="pm-ctrl-btn" onclick="pmScrapeClear()" style="flex:1">Clear</button>
        </div>`;

      const LOGS = [
        { t: 'info', m: '[INFO] Initializing Chrome WebDriver (Headless v114)...' },
        { t: 'info', m: '[INFO] Spoofing User-Agent & rotating proxy...' },
        { t: 'info', m: '[INFO] Target → https://example-store.com/new-arrivals' },
        { t: 'success', m: '[SUCCESS] Connected (200 OK)' },
        { t: 'info', m: '[INFO] Parsing DOM tree...' },
        { t: 'warn', m: '[DATA] Found 142 product nodes.' },
        { t: 'data', m: '   > [1] Wireless Noise-Cancelling Headphones — $299' },
        { t: 'data', m: '   > [2] Mechanical Gaming Keyboard RGB — $129' },
        { t: 'data', m: '   > [3] 4K Ultra HD Monitor 27" — $450' },
        { t: 'data', m: '   > [4] Smart Home Hub v2 — $89' },
        { t: 'data', m: '   > [5] Ergonomic Office Chair Pro — $350' },
        { t: 'info', m: '   ... (scrolling 137 more items)' },
        { t: 'warn', m: '[INFO] Handling pagination — Page 2 loaded' },
        { t: 'info', m: '[INFO] Rate-limit safeguard: sleep 0.5s' },
        { t: 'success', m: '[SUCCESS] Extracted 50 items from Page 2.' },
        { t: 'info', m: '[INFO] Aggregating results...' },
        { t: 'success', m: '[SUCCESS] Pipeline complete — 192 items scraped.' },
        { t: 'info', m: '[INFO] Saving to output.csv...' },
        { t: 'success', m: '✅ DONE — output.csv saved (14 KB)' }
      ];

      let isRunning = false;

      window.pmScrapeRun = () => {
        if (isRunning) return;
        isRunning = true;
        const term = document.getElementById('pw-terminal');
        const cursor = document.getElementById('pw-cursor');
        if (cursor) cursor.remove();

        const cmdLine = document.createElement('div');
        cmdLine.innerHTML = `<span class="pm-term-prompt">teega@portfolio:~/scraper$</span> python scraper.py --target=store --format=csv`;
        term.appendChild(cmdLine);

        LOGS.forEach((log, i) => {
          const id = setTimeout(() => {
            const el = document.createElement('div');
            el.className = 'pm-term-' + log.t;
            el.textContent = log.m;
            term.appendChild(el);
            term.scrollTop = term.scrollHeight;
            if (i === LOGS.length - 1) {
              const dlBtn = document.createElement('div');
              dlBtn.style.marginTop = '8px';
              dlBtn.innerHTML = `<button onclick="pmScrapeDownload()" style="background:#27c93f;color:#000;border:none;padding:4px 10px;font-family:'JetBrains Mono';cursor:pointer;font-weight:bold;border-radius:4px">⬇ Download output.csv (14KB)</button>`;
              term.appendChild(dlBtn);
              term.scrollTop = term.scrollHeight;
              isRunning = false;
            }
          }, i * 200 + 100);
          _pmIntervals.push(id);
        });
      };

      window.pmScrapeClear = () => {
        isRunning = false;
        const term = document.getElementById('pw-terminal');
        if (term) term.innerHTML = `<div><span class="pm-term-prompt">teega@portfolio:~/scraper$</span> <span id="pw-cursor">_</span></div>`;
      };

      window.pmScrapeDownload = () => {
        const csv = 'ID,Product,Price\n1,Wireless Headphones,299\n2,Gaming Keyboard,129\n3,4K Monitor,450\n4,Smart Home Hub,89\n5,Office Chair,350';
        const a = document.createElement('a');
        a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
        a.download = 'scraped_data_sample.csv';
        a.click();
      };
    }
  },

  stock: {
    icon: '📈', title: 'Stock Price Predictor',
    badges: ['LSTM', 'Keras', 'yfinance'],
    pageUrl: 'project-stock.html',
    info: {
      title: 'About this Project',
      desc: 'LSTM deep learning model with a 60-day lookback window for stock trend forecasting. Achieves RMSE of 2.34 — outperforming ARIMA by 12%. Includes portfolio optimization module.',
      metrics: [
        { val: '2.34', lbl: 'RMSE' },
        { val: '60', lbl: 'Day Lookback' },
        { val: '+12%', lbl: 'vs ARIMA' },
        { val: '4', lbl: 'Tickers' }
      ],
      tech: ['Python', 'TensorFlow / Keras', 'NumPy', 'yfinance API', 'Plotly', 'Streamlit']
    },
    buildDemo(area) {
      area.innerHTML = `
        <div class="pm-chart-wrap" style="height:240px;"><canvas id="pm-stock-chart"></canvas></div>
        <div class="pm-ticker-row">
          <select class="pm-ticker-select" id="ps-ticker">
            <option value="AAPL">AAPL (Apple)</option>
            <option value="TSLA">TSLA (Tesla)</option>
            <option value="GOOGL">GOOGL (Google)</option>
            <option value="BTC">BTC-USD (Bitcoin)</option>
          </select>
          <button class="pm-predict-btn" id="ps-predict-btn" onclick="pmStockPredict()">Predict Trend 📈</button>
        </div>
        <div class="pm-train-log" id="ps-train-log">
          <span id="ps-train-text">&gt; Initializing...</span>
          <div class="pm-train-bar-wrap"><div class="pm-train-bar" id="ps-train-bar"></div></div>
        </div>`;

      const STOCK = {
        AAPL: { history: [145, 147, 146, 148, 150, 149, 151, 153, 152, 154, 155, 157, 156, 158, 160], forecast: [162, 161, 163, 165, 164, 166, 168] },
        TSLA: { history: [220, 215, 230, 225, 240, 235, 250, 245, 260, 255, 240, 245, 250, 255, 260], forecast: [265, 275, 255, 270, 280, 260, 290] },
        GOOGL: { history: [120, 121, 122, 122, 123, 123, 124, 125, 125, 126, 127, 128, 129, 130, 131], forecast: [131, 132, 132, 133, 133, 134, 135] },
        BTC: { history: [30000, 31000, 29000, 32000, 31500, 33000, 34000, 32500, 35000, 36000, 34000, 37000, 38000, 37500, 40000], forecast: [41000, 39000, 42000, 44000, 43000, 45000, 48000] }
      };
      const histLabels = Array.from({ length: 15 }, (_, i) => `Day ${i - 14}`);

      const ctx = document.getElementById('pm-stock-chart').getContext('2d');
      let chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: histLabels,
          datasets: [{ label: 'Historical Price', data: STOCK.AAPL.history, borderColor: '#fff', borderWidth: 2, tension: .2, pointRadius: 2 }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { labels: { color: '#ccc', boxWidth: 12, font: { size: 10 } } } },
          scales: {
            x: { grid: { color: 'rgba(255,255,255,.07)' }, ticks: { color: '#888', font: { size: 9 } } },
            y: { grid: { color: 'rgba(255,255,255,.07)' }, ticks: { color: '#888', font: { size: 9 } } }
          }
        }
      });
      _pmCharts.push(chart);

      document.getElementById('ps-ticker').addEventListener('change', () => {
        const ticker = document.getElementById('ps-ticker').value;
        chart.data.labels = histLabels;
        chart.data.datasets = [{ label: `Historical (${ticker})`, data: STOCK[ticker].history, borderColor: '#fff', borderWidth: 2, tension: .2, pointRadius: 2 }];
        chart.update();
        const btn = document.getElementById('ps-predict-btn');
        if (btn) { btn.disabled = false; btn.textContent = 'Predict Trend 📈'; }
        const log = document.getElementById('ps-train-log');
        if (log) log.style.display = 'none';
      });

      window.pmStockPredict = async () => {
        const btn = document.getElementById('ps-predict-btn');
        const log = document.getElementById('ps-train-log');
        const trainText = document.getElementById('ps-train-text');
        const trainBar = document.getElementById('ps-train-bar');
        const ticker = document.getElementById('ps-ticker').value;

        btn.disabled = true;
        log.style.display = 'block';
        trainBar.style.width = '0%';

        const STEPS = [
          'Initializing TensorFlow Core...',
          'Loading pre-trained weights (v4.2)...',
          'Normalizing input tensors...',
          'Epoch 1/5: loss=0.4322  acc=0.65',
          'Epoch 3/5: loss=0.2110  acc=0.82',
          'Epoch 5/5: loss=0.0544  acc=0.96',
          'Finalizing predictions...'
        ];
        for (let i = 0; i < STEPS.length; i++) {
          await new Promise(r => setTimeout(r, 280));
          trainText.textContent = '> ' + STEPS[i];
          trainBar.style.width = ((i + 1) / STEPS.length * 100) + '%';
        }

        log.style.display = 'none';
        btn.textContent = 'Prediction Complete!';

        const d = STOCK[ticker];
        const last = d.history[d.history.length - 1];
        const forecastLabels = Array.from({ length: 7 }, (_, i) => `Day +${i + 1}`);
        const allLabels = [...histLabels, ...forecastLabels];
        const histPadded = [...d.history, ...Array(7).fill(null)];
        const forecastPadded = [...Array(14).fill(null), last, ...d.forecast];

        chart.data.labels = allLabels;
        chart.data.datasets = [
          { label: `Historical (${ticker})`, data: histPadded, borderColor: '#fff', borderWidth: 2, tension: .2, pointRadius: 2 },
          { label: 'LSTM Forecast', data: forecastPadded, borderColor: '#b8ff3c', borderWidth: 2, borderDash: [5, 5], tension: .3, pointRadius: 4, pointBackgroundColor: '#b8ff3c' }
        ];
        chart.update();

        setTimeout(() => { btn.disabled = false; btn.textContent = 'Predict Trend 📈'; }, 3000);
      };
    }
  }
};

// Populate the right info panel
function _pmPopulateInfo(key) {
  const p = PROJECT_REGISTRY[key];
  if (!p) return;
  const d = p.info;

  // Header
  document.getElementById('pm-icon').textContent = p.icon;
  document.getElementById('pm-title').textContent = p.title;
  const badgesEl = document.getElementById('pm-badges');
  badgesEl.innerHTML = p.badges.map(b => `<span class="pm-badge">${b}</span>`).join('');

  // Full page link
  document.getElementById('pm-fullpage').href = p.pageUrl;
  document.getElementById('pm-view-full').href = p.pageUrl;

  // Info panel
  document.getElementById('pm-info-title').textContent = d.title;
  document.getElementById('pm-info-desc').textContent = d.desc;

  // Metrics
  document.getElementById('pm-metrics').innerHTML = d.metrics.map(m =>
    `<div class="pm-metric-box"><span class="pm-metric-val">${m.val}</span><div class="pm-metric-lbl">${m.lbl}</div></div>`
  ).join('');

  // Tech stack
  document.getElementById('pm-tech-stack').innerHTML = d.tech.map(t => `<span class="pm-tech">${t}</span>`).join('');
}

// PUBLIC API
window.openProjectModal = function (projectId) {
  const p = PROJECT_REGISTRY[projectId];
  if (!p) {
    window.location.href = { ser: 'project-ser.html', sales: 'project-sales.html', fraud: 'project-fraud.html', customer: 'project-customer.html', webscrape: 'project-webscrape.html', stock: 'project-stock.html' }[projectId] || '#';
    return;
  }

  _pmCleanup();
  _pmPopulateInfo(projectId);

  const area = document.getElementById('pm-demo-area');
  area.innerHTML = '';
  p.buildDemo(area);

  document.getElementById('project-modal').classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeProjectModal = function () {
  document.getElementById('project-modal').classList.remove('active');
  document.body.style.overflow = '';
  _pmCleanup();
  // Clear demo area to stop any lingering audio/chart
  const area = document.getElementById('pm-demo-area');
  if (area) area.innerHTML = '';
};

