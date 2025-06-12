/*
    create a worker and add a SECRET VARIABLE named PHONE_NUMBER
    
    wrangler secret put PHONE_NUMBER
    then add phone nuumber: +44xxxxxxxxxx
    
    Test chatbubble is working from:
    https://chat-bubble-worker....
    
    Then add HTML and js to client side.

*/



addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-cache'
  }

  // Serve phone number via API endpoint
  if (url.pathname === '/phone') {
    headers['Content-Type'] = 'application/json'
    try {
      const phoneNumber = typeof PHONE_NUMBER !== 'undefined' ? PHONE_NUMBER : null
      if (!phoneNumber) {
        return new Response(JSON.stringify({ error: 'Phone number not configured' }), { 
          status: 500, 
          headers 
        })
      }
      return new Response(JSON.stringify({ phoneNumber: PHONE_NUMBER }), { 
        status: 200, 
        headers 
      })
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Internal server error' }), { 
        status: 500, 
        headers 
      })
    }
  }
  // Serve CSS
  else if (url.pathname === '/style.css') {
    headers['Content-Type'] = 'text/css'
    return new Response(cssContent, { headers })
  }
  // Serve JavaScript
  else if (url.pathname === '/script.js') {
    headers['Content-Type'] = 'application/javascript'
    return new Response(jsContent, { headers })
  }
  // Serve HTML for testing
  else {
    headers['Content-Type'] = 'text/html'
    return new Response(htmlContent, { headers })
  }
}

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WhatsApp Chat Bubble</title>
    <link rel="stylesheet" href="/style.css">
</head>
<body>
    <div class="chat-bubble-container">
        <div class="chat-bubble" onclick="toggleChatMenu()">
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp">
        </div>
        <div class="chat-menu" id="chatMenu">
            <a id="whatsappLink" href="#" target="_blank">Send Message</a>
            <a id="callLink" href="#" target="_blank">Call Us</a>
        </div>
    </div>
    <script src="/script.js"></script>
</body>
</html>
`

const cssContent = `
.chat-bubble-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
}

.chat-bubble {
    background-color: #F29C01;
    border: 2px solid #1F1D42;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s;
}

.chat-bubble:hover {
    transform: scale(1.1);
}

.chat-menu {
    display: none;
    position: absolute;
    bottom: 70px;
    right: 0;
    background-color: white;
    border: 2px solid #1F1D42;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    padding: 10px;
}

.chat-menu a {
    display: block;
    padding: 8px 16px;
    color: #1F1D42;
    text-decoration: none;
    font-family: Arial, sans-serif;
    font-size: 14px;
    transition: background-color 0.2s;
}

.chat-menu a:hover {
    background-color: #F29C01;
    color: white;
}

.chat-bubble img {
    width: 30px;
    height: 30px;
}
`

const jsContent = `
async function fetchPhoneNumber() {
    try {
        const response = await fetch('https://chat-bubble-worker.XXXXX.dev/phone');
        const data = await response.json();
        return data.phoneNumber;
    } catch (error) {
        console.error('Error fetching phone number:', error);
        return null;
    }
}

async function initChatLinks() {
    const phoneNumber = await fetchPhoneNumber();
    if (phoneNumber) {
        document.getElementById('whatsappLink').href = \`https://wa.me/\${phoneNumber}?text=Hello!%20I%20have%20a%20question\`;
        document.getElementById('callLink').href = \`tel:\${phoneNumber}\`;
    } else {
        document.getElementById('chatMenu').style.display = 'none'; // Hide menu if fetch fails
    }
}

function toggleChatMenu() {
    const menu = document.getElementById('chatMenu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

document.addEventListener('click', function(event) {
    const container = document.querySelector('.chat-bubble-container');
    if (!container.contains(event.target)) {
        document.getElementById('chatMenu').style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', initChatLinks);
`
