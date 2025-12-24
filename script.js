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

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Server Error");

      // 3. Success State
      submitButton.innerHTML = '<span>✅ Message Sent!</span>';
      submitButton.style.background = '#27c93f'; // Brand Success Green
      submitButton.style.color = '#000';

      // Show Simulation Alert if applicable
      if (data.mode === 'simulation') {
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

    chatWindow.classList.add('active');
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

// Project Modal / Page Navigation Handler
window.openProjectModal = function (projectId) {
  // Redirect specific projects to their new dedicated pages
  const projectMap = {
    'ser': 'project-ser.html',
    'sales': 'project-sales.html',
    'fraud': 'project-fraud.html',
    'customer': 'project-customer.html',
    'webscrape': 'project-webscrape.html',
    'stock': 'project-stock.html'
  };

  if (projectMap[projectId]) {
    window.location.href = projectMap[projectId];
    return;
  }

  // Legacy Modal Handling for projects not yet upgraded
  const modal = document.getElementById('project-modal');
  if (modal) {
    const title = document.getElementById('modal-title');
    const desc = document.getElementById('modal-description');

    // Simple data mapping for legacy modal
    const projectData = {
      'sales': { title: 'Sales Analytics', desc: 'Interactive Power BI dashboard for real-time sales tracking.' },
      'fraud': { title: 'Fraud Detection', desc: 'ML model to detect fraudulent transactions.' },
      'customer': { title: 'Customer Segmentation', desc: 'Clustering analysis for marketing.' },
      'webscrape': { title: 'Web Scraping Tool', desc: 'Automated data collection system.' },
      'stock': { title: 'Stock Predictor', desc: 'LSTM model for price prediction.' }
    };

    if (projectData[projectId]) {
      if (title) title.textContent = projectData[projectId].title;
      if (desc) desc.textContent = projectData[projectId].desc;
      modal.classList.add('active');
    }
  }
};

window.closeProjectModal = function () {
  const modal = document.getElementById('project-modal');
  if (modal) {
    modal.classList.remove('active');
  }
};
