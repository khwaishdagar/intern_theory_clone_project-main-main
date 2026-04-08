/**
 * InternTheory Chatbot Widget
 * Drop-in script for all pages — just include this file
 */

(function () {
    // Prevent duplicate init
    if (window.__itChatbotLoaded) return;
    window.__itChatbotLoaded = true;

    // ── Inject CSS ──────────────────────────────────────────────
    const style = document.createElement('style');
    style.textContent = `
    #it-chat-fab {
        position: fixed; bottom: 28px; right: 28px;
        width: 58px; height: 58px; border-radius: 50%;
        background: linear-gradient(135deg, #df5e28, #f07840);
        color: #fff; font-size: 24px;
        border: none; cursor: pointer;
        box-shadow: 0 4px 20px rgba(223,94,40,0.45);
        z-index: 99999; transition: transform 0.25s, box-shadow 0.25s;
        display: flex; align-items: center; justify-content: center;
        animation: it-fab-pulse 2s infinite;
    }
    #it-chat-fab:hover { transform: scale(1.1); box-shadow: 0 6px 28px rgba(223,94,40,0.55); }

    @keyframes it-fab-pulse {
        0%,100% { box-shadow: 0 4px 20px rgba(223,94,40,0.45); }
        50%      { box-shadow: 0 4px 28px rgba(223,94,40,0.7); }
    }

    /* Notification dot */
    #it-chat-fab .it-notif-dot {
        position: absolute; top: 4px; right: 4px;
        width: 12px; height: 12px; border-radius: 50%;
        background: #22c55e; border: 2px solid #fff;
    }

    #it-chat-widget {
        display: none; position: fixed;
        bottom: 100px; right: 28px;
        width: 360px; height: 560px;
        background: #fff; border-radius: 20px;
        box-shadow: 0 12px 48px rgba(0,0,0,0.18);
        flex-direction: column; z-index: 99998;
        overflow: hidden; font-family: 'Inter','Segoe UI',sans-serif;
        transform: translateY(20px); opacity: 0;
        transition: transform 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease;
    }
    #it-chat-widget.open {
        display: flex; transform: translateY(0); opacity: 1;
    }

    /* Header */
    #it-chat-header {
        background: linear-gradient(135deg, #df5e28 0%, #f07840 100%);
        color: #fff; padding: 16px 18px;
        display: flex; justify-content: space-between; align-items: center;
        flex-shrink: 0;
    }
    .it-header-left { display: flex; align-items: center; gap: 10px; }
    .it-bot-avatar {
        width: 40px; height: 40px; border-radius: 50%;
        background: rgba(255,255,255,0.2);
        display: flex; align-items: center; justify-content: center;
        font-size: 20px; border: 2px solid rgba(255,255,255,0.3);
    }
    .it-header-info .it-name  { font-weight: 700; font-size: 15px; letter-spacing: 0.2px; }
    .it-header-info .it-status {
        font-size: 11px; color: rgba(255,255,255,0.85);
        display: flex; align-items: center; gap: 4px; margin-top: 2px;
    }
    .it-status-dot {
        width: 7px; height: 7px; border-radius: 50%; background: #86efac;
        display: inline-block; animation: it-blink 1.5s infinite;
    }
    @keyframes it-blink { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
    #it-close-btn {
        background: rgba(255,255,255,0.15); border: none; color: #fff;
        cursor: pointer; font-size: 16px; width: 30px; height: 30px;
        border-radius: 50%; display: flex; align-items: center; justify-content: center;
        transition: background 0.2s;
    }
    #it-close-btn:hover { background: rgba(255,255,255,0.3); }

    /* Messages */
    #it-chat-messages {
        flex: 1; overflow-y: auto; padding: 16px 12px;
        display: flex; flex-direction: column; gap: 12px;
        background: #f8f9fc;
        scrollbar-width: thin; scrollbar-color: #dde1e7 transparent;
    }
    #it-chat-messages::-webkit-scrollbar { width: 4px; }
    #it-chat-messages::-webkit-scrollbar-thumb { background: #dde1e7; border-radius: 4px; }

    .it-msg-wrap { display: flex; align-items: flex-end; gap: 7px; }
    .it-msg-wrap.it-user { flex-direction: row-reverse; }

    .it-msg-avatar {
        width: 30px; height: 30px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-size: 14px; flex-shrink: 0;
    }
    .it-msg-wrap.it-bot  .it-msg-avatar { background: linear-gradient(135deg,#df5e28,#f07840); }
    .it-msg-wrap.it-user .it-msg-avatar { background: #1e293b; }

    .it-msg-inner { display: flex; flex-direction: column; }
    .it-msg-wrap.it-user .it-msg-inner { align-items: flex-end; }

    .it-msg {
        max-width: 82%; padding: 10px 14px;
        border-radius: 16px; font-size: 13.5px; line-height: 1.65;
    }
    .it-msg.it-bot  {
        background: #fff; color: #1e293b;
        border-bottom-left-radius: 5px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.07);
    }
    .it-msg.it-user {
        background: linear-gradient(135deg,#df5e28,#f07840);
        color: #fff; border-bottom-right-radius: 5px;
    }
    .it-msg a { color: #df5e28; font-weight: 600; text-decoration: none; }
    .it-msg.it-user a { color: #ffe5d4; }
    .it-msg a:hover { text-decoration: underline; }
    .it-tag {
        display: inline-block; background: #fff3e0; color: #c2440a;
        font-size: 11px; padding: 2px 9px; border-radius: 20px;
        margin: 2px 2px 0 0; font-weight: 600; border: 1px solid #ffd8bb;
    }

    .it-msg-time { font-size: 10px; color: #adb5bd; margin-top: 3px; padding: 0 2px; }

    /* Typing */
    .it-typing-dots { display: flex; gap: 4px; padding: 2px 0; }
    .it-typing-dots span {
        width: 7px; height: 7px; border-radius: 50%; background: #cbd5e1;
        animation: it-bounce 1.3s infinite;
    }
    .it-typing-dots span:nth-child(2) { animation-delay: 0.2s; }
    .it-typing-dots span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes it-bounce { 0%,80%,100%{ transform:translateY(0) } 40%{ transform:translateY(-7px) } }

    /* Quick replies */
    #it-quick-replies {
        display: flex; flex-wrap: wrap; gap: 6px;
        padding: 10px 12px 8px;
        background: #f8f9fc; border-top: 1px solid #edf0f5;
        flex-shrink: 0;
    }
    .it-quick-btn {
        background: #fff; border: 1.5px solid #df5e28;
        color: #df5e28; border-radius: 20px;
        padding: 5px 12px; font-size: 12px; cursor: pointer;
        transition: all 0.18s; font-weight: 600; font-family: inherit;
    }
    .it-quick-btn:hover { background: #df5e28; color: #fff; }

    /* Input */
    #it-chat-input-row {
        display: flex; padding: 10px 12px;
        border-top: 1px solid #edf0f5; gap: 8px; background: #fff;
        flex-shrink: 0;
    }
    #it-chat-input {
        flex: 1; padding: 10px 14px;
        border: 1.5px solid #e8edf3; border-radius: 24px;
        font-size: 13.5px; outline: none; font-family: inherit;
        transition: border-color 0.2s; color: #1e293b;
    }
    #it-chat-input:focus { border-color: #df5e28; }
    #it-send-btn {
        width: 40px; height: 40px; border-radius: 50%;
        background: linear-gradient(135deg,#df5e28,#f07840);
        color: #fff; border: none; cursor: pointer; font-size: 16px;
        display: flex; align-items: center; justify-content: center;
        transition: opacity 0.2s, transform 0.2s; flex-shrink: 0;
    }
    #it-send-btn:hover { opacity: 0.9; transform: scale(1.06); }

    @media (max-width: 480px) {
        #it-chat-widget {
            bottom: 0; right: 0; left: 0;
            width: 100%; height: 85vh;
            border-radius: 20px 20px 0 0;
        }
        #it-chat-fab { bottom: 20px; right: 20px; }
    }
    `;
    document.head.appendChild(style);

    // ── Inject HTML ─────────────────────────────────────────────
    const html = `
    <button id="it-chat-fab" onclick="window.__itToggleChat()" aria-label="Open InternTheory Chat">
        💬<span class="it-notif-dot"></span>
    </button>

    <div id="it-chat-widget" role="dialog" aria-label="InternTheory Assistant">
        <div id="it-chat-header">
            <div class="it-header-left">
                <div class="it-bot-avatar">🎓</div>
                <div class="it-header-info">
                    <div class="it-name">InternTheory Assistant</div>
                    <div class="it-status"><span class="it-status-dot"></span> Online — Internships & Courses</div>
                </div>
            </div>
            <button id="it-close-btn" onclick="window.__itToggleChat()" aria-label="Close chat">✕</button>
        </div>

        <div id="it-chat-messages"></div>

        <div id="it-quick-replies">
            <button class="it-quick-btn" onclick="window.__itQuickSend('internships')">💼 Internships</button>
            <button class="it-quick-btn" onclick="window.__itQuickSend('online courses')">💻 Courses</button>
            <button class="it-quick-btn" onclick="window.__itQuickSend('jobs')">🔍 Jobs</button>
            <button class="it-quick-btn" onclick="window.__itQuickSend('PM internship')">🇮🇳 PM Scheme</button>
            <button class="it-quick-btn" onclick="window.__itQuickSend('register')">📝 Register</button>
            <button class="it-quick-btn" onclick="window.__itQuickSend('eligibility')">✅ Eligibility</button>
        </div>

        <div id="it-chat-input-row">
            <input type="text" id="it-chat-input" placeholder="Internships, courses, schemes ke baare mein poochho..."
                onkeydown="if(event.key==='Enter') window.__itSendMessage()" autocomplete="off">
            <button id="it-send-btn" onclick="window.__itSendMessage()" aria-label="Send">➤</button>
        </div>
    </div>`;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    document.body.appendChild(wrapper);

    // ── Data ────────────────────────────────────────────────────
    const pages = {
        internships:  'internship.html',
        courses:      'courses.html',
        onlinecourses:'onlinecourses.html',
        classroom:    'classTraining.html',
        jobs:         'jobs.html',
        dashboard:    'dashboard.html',
        profile:      'profile.html',
        register:     'register.html',
        login:        'login.html',
        cart:         'cartPage1.html',
        pmkvy:        'pmkvy.html',
        naps:         'naps.html',
        janShikshan:  'jan-shikshan.html',
        pmInternship: 'boot.html',
        cyberSec:     'cyber-security.html',
        sankalp:      'sankalp.html',
    };

    const benefits = [
        '12 months real-life experience in India\'s top companies',
        'Monthly ₹4500 Govt. + ₹500 Industry = ₹5000 stipend',
        'One-time ₹6000 grant for incidentals',
        'Government certificate after completion',
        'Select from various sectors & top companies',
    ];

    const eligibility = {
        age: '21 to 24 years',
        jobStatus: 'Not employed full-time',
        education: 'Not enrolled full-time in any course',
        income: 'Family income < ₹8 Lakhs per annum',
        govt: 'No family member in Govt. job',
    };

    // ── Rules ───────────────────────────────────────────────────
    const rules = [
        {
            kw: ['hello','hi','hey','namaste','hii','start','help','kya kar','what can','kya'],
            reply: () => `👋 <b>Hello! Main InternTheory Assistant hun.</b><br><br>
Main aapki help kar sakta hun:<br>
• 💼 <a href="${pages.internships}">Internships</a> dhundhne mein<br>
• 💻 <a href="${pages.onlinecourses}">Online Courses</a> ke baare mein<br>
• 🏫 <a href="${pages.classroom}">Classroom Training</a> ke baare mein<br>
• 🇮🇳 Government Schemes (PM Internship, PMKVY, NAPS)<br>
• 📝 <a href="${pages.register}">Registration</a> & <a href="${pages.login}">Login</a><br><br>
Kya jaanna chahte hain?`
        },
        {
            kw: ['internship','intern','internships','intership','training'],
            reply: () => `💼 <b>Internships on InternTheory</b><br><br>
<a href="${pages.internships}">Internship Page →</a> pe jao aur filter karo:<br><br>
<span class="it-tag">By City</span>
<span class="it-tag">By Industry</span>
<span class="it-tag">By Type</span>
<span class="it-tag">By Duration</span><br><br>
Har card mein:<br>
• Company name & logo<br>
• Location & Industry type<br>
• Monthly Stipend (₹)<br>
• Duration (weeks mein)<br><br>
<a href="${pages.internships}">Abhi Internships Dekho →</a>`
        },
        {
            kw: ['online course','course','courses','online','sikho','learn','sikhna','skill'],
            reply: () => `💻 <b>Courses & Skill Development</b><br><br>
• <a href="${pages.onlinecourses}">Online Courses →</a> (Self-paced, EMI available)<br>
• <a href="${pages.classroom}">Classroom Training →</a> (In-person batches)<br>
• <a href="${pages.courses}">Skill Courses →</a> (Industry-specific)<br><br>
Features:<br>
• Certificate on completion<br>
• Multiple sectors available<br>
• Government recognized programs`
        },
        {
            kw: ['classroom','class','batch','offline','centre','training centre'],
            reply: () => `🏫 <b>Classroom Training</b><br><br>
<a href="${pages.classroom}">Classroom Training →</a><br><br>
• Fixed-schedule in-person batches<br>
• Experienced instructors<br>
• Hands-on practical training<br>
• Certificate on completion<br><br>
Online prefer karte ho? <a href="${pages.onlinecourses}">Online Courses →</a>`
        },
        {
            kw: ['pm internship','pm scheme','pradhan mantri','government internship','sarkari','boot','800 companies'],
            reply: () => `🇮🇳 <b>PM Internship Scheme</b><br><br>
<a href="${pages.pmInternship}">PM Internship Page →</a><br><br>
<b>Benefits:</b><br>
${benefits.map(b => `• ${b}`).join('<br>')}<br><br>
<b>Eligibility:</b><br>
• Age: ${eligibility.age}<br>
• ${eligibility.jobStatus}<br>
• Family income: ${eligibility.income}`
        },
        {
            kw: ['pmkvy','kaushal','vikas','yojana','skill india','free course','free training','free skill'],
            reply: () => `🎯 <b>PMKVY — Pradhan Mantri Kaushal Vikas Yojana</b><br><br>
<a href="${pages.pmkvy}">PMKVY Page →</a><br><br>
• Free skill training with Govt. certification<br>
• Multiple sectors: IT, Construction, Healthcare, etc.<br>
• Job placement assistance after completion<br>
• Recognition of Prior Learning (RPL)`
        },
        {
            kw: ['naps','apprenticeship','apprentice'],
            reply: () => `🔧 <b>NAPS — National Apprenticeship Promotion Scheme</b><br><br>
<a href="${pages.naps}">NAPS Page →</a><br><br>
• 25% of stipend shared by Govt. of India<br>
• On-the-job training with companies<br>
• Industry-recognized certification<br>
• Learn while you earn`
        },
        {
            kw: ['scheme','schemes','government','yojana','sarkari','all scheme'],
            reply: () => `🏛️ <b>Government Schemes on InternTheory</b><br><br>
• <a href="${pages.pmInternship}"><b>PM Internship Scheme</b></a> — ₹5000/month. Age 21-24. Top companies.<br><br>
• <a href="${pages.pmkvy}"><b>PMKVY</b></a> — Free skill training with Govt. certificate.<br><br>
• <a href="${pages.naps}"><b>NAPS</b></a> — 25% stipend support from Govt. On-the-job training.<br><br>
• <a href="${pages.janShikshan}"><b>Jan Shikshan Sansthan</b></a> — Vocational training for non-literate & dropouts.<br><br>
• <a href="${pages.sankalp}"><b>SANKALP</b></a> — Skills Acquisition for Livelihood Promotion.`
        },
        {
            kw: ['job','jobs','naukri','placement','hiring','vacancy','fresher','full time'],
            reply: () => `🔍 <b>Fresher Jobs</b><br><br>
<a href="${pages.jobs}">Jobs Page →</a><br><br>
• Full-time job listings<br>
• Filter by city, type, category<br>
• Direct company listings — no middleman<br><br>
Internship se start karna chahte ho? <a href="${pages.internships}">Internships →</a>`
        },
        {
            kw: ['eligib','eligible','qualify','kaun apply','who can','age limit','age','criteria','umar'],
            reply: () => `✅ <b>PM Internship Eligibility</b><br><br>
• <b>Age:</b> ${eligibility.age}<br>
• <b>Job Status:</b> ${eligibility.jobStatus}<br>
• <b>Education:</b> ${eligibility.education}<br>
• <b>Family Income:</b> ${eligibility.income}<br>
• <b>Govt Job:</b> ${eligibility.govt}<br><br>
<a href="${pages.pmInternship}">Apply for PM Internship →</a>`
        },
        {
            kw: ['stipend','salary','kitna milega','paise','money','benefit','kitne','income'],
            reply: () => `💰 <b>Stipend & Benefits</b><br><br>
${benefits.map(b => `✅ ${b}`).join('<br>')}<br><br>
<a href="${pages.pmInternship}">PM Internship Details →</a>`
        },
        {
            kw: ['register','signup','sign up','account banao','new account','join','registration','apply'],
            reply: () => `📝 <b>Register karo!</b><br><br>
<a href="${pages.register}">Student Registration →</a><br><br>
Steps:<br>
1️⃣ Name, Email, Mobile daalo<br>
2️⃣ City & Qualification fill karo<br>
3️⃣ OTP verify karo<br>
4️⃣ Profile complete karo<br><br>
Company ho? <a href="companyreg.html">Company Registration →</a>`
        },
        {
            kw: ['login','sign in','signin','log in','password','forgot'],
            reply: () => `🔑 <b>Login</b><br><br>
<a href="${pages.login}">Login Page →</a><br><br>
• Email + Password se login karo<br>
• Forgot password? Login page pe click karo<br>
• Naya account? <a href="${pages.register}">Register karo →</a>`
        },
        {
            kw: ['dashboard','mera account','my account','applied','application','enrolled','status'],
            reply: () => `👤 <b>Dashboard & Profile</b><br><br>
<a href="${pages.dashboard}">Dashboard →</a> | <a href="${pages.profile}">My Profile →</a><br><br>
Dashboard mein dekho:<br>
• Applied internships & status<br>
• Enrolled courses<br>
• Certificates earned<br>
• Application history`
        },
        {
            kw: ['cart','payment','pay','buy','purchase','order','checkout','emi'],
            reply: () => `🛒 <b>Cart & Payment</b><br><br>
<a href="${pages.cart}">View Cart →</a> | <a href="pay.html">Payment →</a><br><br>
• Courses cart mein add karo<br>
• EMI options available<br>
• Secure payment gateway`
        },
        {
            kw: ['cyber','security','hacking','cybersecurity','ethical'],
            reply: () => `🔒 <b>Cyber Security Course</b><br><br>
<a href="${pages.cyberSec}">Cyber Security →</a><br><br>
• Ethical hacking basics<br>
• Network security fundamentals<br>
• Certificate on completion`
        },
        {
            kw: ['feature','platform','kya hai','about','intern theory','interntheory','website','portal'],
            reply: () => `🎓 <b>InternTheory Platform</b><br><br>
India ka ek complete internship + skill portal:<br><br>
✅ Citizen Centric — India ki diverse population ke liye<br>
✅ Career Focused — relevant skill courses, jobs & apprenticeships<br>
✅ Resume builder & interview prep tools<br>
✅ Connect directly with top companies<br>
✅ Government schemes — all in one place<br><br>
<b>Explore:</b><br>
<a href="${pages.internships}">Internships</a> | <a href="${pages.onlinecourses}">Courses</a> | <a href="${pages.jobs}">Jobs</a> | <a href="${pages.classroom}">Classroom</a>`
        },
        {
            kw: ['contact','support','help me','problem','issue','complain','mail','email'],
            reply: () => `📞 <b>Support</b><br><br>
• <a href="accessibility.html">Accessibility →</a><br>
• <a href="privacy-policy.html">Privacy Policy →</a><br>
• <a href="terms-and-conditions.html">Terms & Conditions →</a><br>
• <a href="refund-policy.html">Refund Policy →</a><br><br>
Technical issue? Dashboard se report karo.`
        },
        {
            kw: ['thanks','thank','shukriya','dhanyawad','ty','great','perfect','accha','badhiya'],
            reply: () => `😊 <b>Bahut shukriya!</b><br><br>
All the best for your internship journey! 🎓<br>
Koi aur help chahiye toh main hamesha yahan hun. 💪`
        },
        {
            kw: ['bye','goodbye','alvida','exit','close','band','band karo'],
            reply: () => `👋 <b>Alvida!</b><br><br>
InternTheory pe aane ka shukriya. Apna future bright banao! 🌟`
        },
    ];

    const defaultReplies = [
        `Mujhe exactly samajh nahi aaya. Kya aap in mein se kuch poochh rahe hain?<br><br>💼 <a href="${pages.internships}">Internships</a> | 💻 <a href="${pages.onlinecourses}">Courses</a> | 🔍 <a href="${pages.jobs}">Jobs</a> | 🇮🇳 <a href="${pages.pmInternship}">PM Scheme</a>`,
        `Main is baare mein sure nahi hun. Try karo: "internship", "course", "PM scheme", ya "register" likhna.`,
        `Yeh meri understanding se bahar hai! Seedha yahan jaao: <a href="${pages.internships}">Internships</a> ya <a href="${pages.onlinecourses}">Courses</a>.`,
    ];
    let defIdx = 0;

    // ── Logic ───────────────────────────────────────────────────
    function getRuleReply(msg) {
        const m = msg.toLowerCase().trim();
        for (const rule of rules) {
            if (rule.kw.some(kw => m.includes(kw))) return rule.reply();
        }
        return null;
    }

    function appendMsg(role, html) {
        const wrap    = document.createElement('div');
        wrap.className = `it-msg-wrap it-${role}`;

        const avatar  = document.createElement('div');
        avatar.className = 'it-msg-avatar';
        avatar.textContent = role === 'bot' ? '🎓' : '👤';

        const bubble  = document.createElement('div');
        bubble.className = `it-msg it-${role}`;
        bubble.innerHTML  = html;

        const time    = document.createElement('div');
        time.className = 'it-msg-time';
        time.textContent = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

        const inner   = document.createElement('div');
        inner.className = 'it-msg-inner';
        inner.append(bubble, time);

        role === 'bot' ? wrap.append(avatar, inner) : wrap.append(inner, avatar);

        document.getElementById('it-chat-messages').appendChild(wrap);
        wrap.scrollIntoView({ behavior: 'smooth' });
    }

    function showTyping() {
        const wrap = document.createElement('div');
        wrap.className = 'it-msg-wrap it-bot';
        wrap.id = 'it-typing';
        wrap.innerHTML = `
            <div class="it-msg-avatar">🎓</div>
            <div class="it-msg it-bot" style="padding:12px 16px;">
                <div class="it-typing-dots"><span></span><span></span><span></span></div>
            </div>`;
        document.getElementById('it-chat-messages').appendChild(wrap);
        wrap.scrollIntoView({ behavior: 'smooth' });
        return wrap;
    }

    window.__itSendMessage = function () {
        const input = document.getElementById('it-chat-input');
        const text  = input.value.trim();
        if (!text) return;
        input.value = '';

        appendMsg('user', text);
        const typing = showTyping();

        setTimeout(() => {
            typing.remove();
            const reply = getRuleReply(text);
            appendMsg('bot', reply || defaultReplies[defIdx++ % defaultReplies.length]);
        }, 500 + Math.random() * 400);
    };

    window.__itQuickSend = function (text) {
        document.getElementById('it-chat-input').value = text;
        window.__itSendMessage();
    };

    window.__itToggleChat = function () {
        const widget = document.getElementById('it-chat-widget');
        const fab    = document.getElementById('it-chat-fab');
        const notif  = fab.querySelector('.it-notif-dot');

        widget.classList.toggle('open');

        // Remove notification dot on first open
        if (widget.classList.contains('open')) {
            if (notif) notif.style.display = 'none';
            if (document.getElementById('it-chat-messages').children.length === 0) {
                setTimeout(() => appendMsg('bot',
                    `👋 <b>Hello! Main InternTheory Assistant hun.</b><br><br>
                    Internships, Courses, Government Schemes ke baare mein poochh sakte ho!<br><br>
                    Neeche quick buttons se start karo ya kuch type karo. 😊`
                ), 350);
            }
        }
    };

})();
