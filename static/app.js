const wrapper = document.querySelector(".sliderWrapper");
const menuItems = document.querySelectorAll(".menuItem");

const products = [
    {
        id: 1,
        title: "Arizona",
        price: 4990.00,
        colors: [
            {
                code: "black",
                img: "/static/img/Arizona-removebg-preview (1).png",
            },
            {
                code: "#6e3e28",
                img: "/static/img/arizona2-removebg-preview.png",
            },
        ],
    },
    {
        id: 2,
        title: "Boston",
        price: 12990.00,
        colors: [
            {
                code: "#72645b",
                img: "/static/img/Boston-removebg-preview.png",
            },
            {
                code: "black",
                img: "/static/img/boston2-removebg-preview.png",
            },
        ],
    },
    {
        id: 3,
        title: "Ramses",
        price: 6990.00,
        colors: [
            {
                code: "black",
                img: "/static/img/Ramses-removebg-preview.png",
            },
            {
                code: "#433b38",
                img: "/static/img/ramses2-removebg-preview.png",
            },
        ],
    },
    {
        id: 4,
        title: "Gizeh",
        price: 7490.00,
        colors: [
            {
                code: "black",
                img: "/static/img/Gizeh-removebg-preview.png",
            },
            {
                code: "#422d28",
                img: "/static/img/gizeh2-removebg-preview.png",
            },
        ],
    },
    {
        id: 5,
        title: "Milano",
        price: 13990.00,
        colors: [
            {
                code: "black",
                img: "/static/img/Milano-removebg-preview (1).png",
            },
            {
                code: "#39312e",
                img: "/static/img/milano2-removebg-preview.png",
            },
        ],
    },
    {
        id: 6,
        title: "Mayari",
        price: 6990.00,
        colors: [
            {
                code: "black",
                img: "/static/img/Mayari-removebg-preview.png",
            },
            {
                code: "#494037",
                img: "/static/img/mayari2-removebg-preview.png",
            },
        ],
    },
    {
        id: 7,
        title: "Bend",
        price: 14490.00,
        colors: [
            {
                code: "black",
                img: "/static/img/Bend-removebg-preview.png",
            },
            {
                code: "#98613a",
                img: "/static/img/bend2-removebg-preview.png",
            },
        ],
    },
];

let choosenProduct = products[0];

const currentProductImg = document.querySelector(".productImg");
const currentProductTitle = document.querySelector(".productTitle");
const currentProductPrice = document.querySelector(".productPrice");
const currentProductColors = document.querySelectorAll(".color");
const currentProductSizes = document.querySelectorAll(".size");

menuItems.forEach((item, index) => {
    item.addEventListener("click", () => {
        //change the current slide
        wrapper.style.transform = `translateX(${-100 * index}vw)`;

        //change the choosen product
        choosenProduct = products[index];

        //change texts of currentProduct
        currentProductTitle.textContent = choosenProduct.title;
        currentProductPrice.textContent = "Rs." + choosenProduct.price;
        currentProductImg.src = choosenProduct.colors[0].img;

        //assing new colors
        currentProductColors.forEach((color, index) => {
            color.style.backgroundColor = choosenProduct.colors[index].code;
        });
    });
});

currentProductColors.forEach((color, index) => {
    color.addEventListener("click", () => {
        currentProductImg.src = choosenProduct.colors[index].img;
    });
});

currentProductSizes.forEach((size, index) => {
    size.addEventListener("click", () => {
        currentProductSizes.forEach((size) => {
            size.style.backgroundColor = "white";
            size.style.color = "black";
        });
        size.style.backgroundColor = "black";
        size.style.color = "white";
    });
});

// Get all BUY NOW buttons
const buyButtons = document.querySelectorAll('.buyButton');
const productButton = document.querySelector('.productButton');
const payment = document.querySelector('.payment');
const close = document.querySelector('.close');
const payButton = document.querySelector('.payButton'); // Add this line

// Add event listener to each BUY NOW button in the slider
buyButtons.forEach(button => {
  button.addEventListener('click', function(e) {
    // Prevent the default behavior of jumping to the #product anchor
    e.preventDefault();
    
    // Scroll to the product section
    document.getElementById('product').scrollIntoView({ behavior: 'smooth' });
    
    // Wait a moment before showing the payment form
    setTimeout(() => {
      payment.style.display = 'flex';
    }, 800);
  });
});

// Also keep the existing event listener for the product detail button
productButton.addEventListener('click', () => {
  payment.style.display = 'flex';
});

// Keep the close button functionality
close.addEventListener('click', () => {
  payment.style.display = 'none';
});

if (payButton) {
  payButton.addEventListener("click", async (e) => {
  e.preventDefault(); // Prevent default form submission
  
  // Get form data
  const paymentForm = document.querySelector(".payment");
  const nameInput = paymentForm.querySelector('input[placeholder="John Doe"]');
  const phoneInput = paymentForm.querySelector('input[placeholder="+91 81093 22746"]');
  const addressInput = paymentForm.querySelector('input[placeholder="Whitefield, Bengaluru"]');
  const cardNumberInput = paymentForm.querySelector('input[placeholder="Card Number"]');
  const cardMonthInput = paymentForm.querySelector('input[placeholder="mm"]');
  const cardYearInput = paymentForm.querySelector('input[placeholder="yyyy"]');
  const cardCVVInput = paymentForm.querySelector('input[placeholder="cvv"]');
  
  // Create payment data object
  const paymentData = {
      name: nameInput ? nameInput.value : '',
      phone: phoneInput ? phoneInput.value : '',
      address: addressInput ? addressInput.value : '',
      cardNumber: cardNumberInput ? cardNumberInput.value : '',
      cardExpiry: {
          month: cardMonthInput ? cardMonthInput.value : '',
          year: cardYearInput ? cardYearInput.value : ''
      },
      cardCVV: cardCVVInput ? cardCVVInput.value : '',
      product: choosenProduct.title,
      price: choosenProduct.price,
      timestamp: new Date().toISOString()
  };
  
  try {
      // Send data to the server
      const response = await fetch('/api/submit-payment', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(paymentData),
      });
      
      if (response.ok) {
          // Payment successfully saved
          alert("Payment submitted successfully!");
          payment.style.display = "none";
          
          // Reset form fields
          if (nameInput) nameInput.value = '';
          if (phoneInput) phoneInput.value = '';
          if (addressInput) addressInput.value = '';
          if (cardNumberInput) cardNumberInput.value = '';
          if (cardMonthInput) cardMonthInput.value = '';
          if (cardYearInput) cardYearInput.value = '';
          if (cardCVVInput) cardCVVInput.value = '';
      } else {
          // Handle error
          const data = await response.json();
          alert(`Error: ${data.message || 'Failed to submit payment'}`);
      }
  } catch (error) {
      console.error("Error submitting payment:", error);
      alert("Failed to submit payment. Please try again.");
  }
});
}



document.addEventListener("DOMContentLoaded", function () {
  // Chat elements (updated to match new structure)
  const chatBubble = document.querySelector('.chat-bubble');
  const chatToggle = document.querySelector('.chat-bubble-toggle');
  const chatMinimize = document.querySelector('.chat-minimize');
  const chatMessages = document.getElementById('chat-messages');
  const userInput = document.getElementById('user-input');
  const sendButton = document.getElementById('send-button');
  const typingIndicator = document.getElementById('typing-indicator');

  // Chat history array to store the conversation
  const chatHistory = [];

  // Function to show/hide the typing indicator
  function showTypingIndicator(show) {
    if (typingIndicator) {
      typingIndicator.style.display = show ? 'flex' : 'none';
    }
  }

  // Function to add a message to the chat window
  function addMessage(role, message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', role === 'user' ? 'user-message' : 'bot-message');
    messageDiv.innerHTML = `<div class="message-content">${message}</div>`;
    chatMessages.appendChild(messageDiv);

    // Add message to chat history
    chatHistory.push({ role: role, content: message });

    // Scroll to the bottom of the chat window
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Function to handle sending the user's message to the Flask backend
  async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage('user', message);
    userInput.value = ''; // Clear the input
    showTypingIndicator(true);

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message,
          history: chatHistory.slice(0, -1) // Exclude the message just sent
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response from server');
      }

      const data = await response.json();
      showTypingIndicator(false);
      addMessage('bot', data.message);
    } catch (error) {
      console.error('Error sending message:', error);
      showTypingIndicator(false);
      addMessage('bot', 'Sorry, I encountered an error. Please try again later.');
    }
  }

  // Add event listeners for sending messages
  if (sendButton) {
    sendButton.addEventListener('click', sendMessage);
  }
  
  if (userInput) {
    userInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        sendMessage();
      }
    });
  }

  // Ensure welcome message is shown only once in UI (not added to chatHistory)
  if (chatMessages && !chatMessages.querySelector('.bot-message')) {
    addMessage('bot', "Hello! I'm your Birkenstock assistant. How can I help you today?");
  }

  // Toggle chat between expanded and minimized states
  if (chatToggle) {
    chatToggle.addEventListener('click', () => {
      chatBubble.classList.add('expanded');
    });
  }

  if (chatMinimize) {
    chatMinimize.addEventListener('click', () => {
      chatBubble.classList.remove('expanded');
    });
  }
});






document.addEventListener('DOMContentLoaded', function() {
  // Get search elements
  const searchInput = document.querySelector('.searchInput');
  const searchIcon = document.querySelector('.searchIcon');
  
  searchInput.style.color = 'white';


  // Array of searchable items (add all your products here)
  const searchableItems = [
    { name: 'Arizona', price: 'Rs.4,990.00', url: '/static/img/Arizona-removebg-preview (1).png' },
    { name: 'Boston', price: 'Rs.12,990.00', url: '/static/img/Boston-removebg-preview.png' },
    { name: 'Ramses', price: 'Rs.6,990.00', url: '/static/img/Ramses-removebg-preview.png' },
    { name: 'Gizeh', price: 'Rs.7,490.00', url: '/static/img/Gizeh-removebg-preview.png' },
    { name: 'Milano', price: 'Rs.13,990.00', url: '/static/img/Milano-removebg-preview (1).png' },
    { name: 'Mayari', price: 'Rs.6,990.00', url: '/static/img/Mayari-removebg-preview.png' },
    { name: 'Bend', price: 'Rs.14,490.00', url: '/static/img/Bend-removebg-preview.png' }
  ];
  
  // Create search results container
  const searchResults = document.createElement('div');
  searchResults.className = 'search-results';
  searchResults.style.display = 'none';
  searchResults.style.position = 'absolute';
  searchResults.style.backgroundColor = 'white';
  searchResults.style.width = '300px'; // Increased width for images
  searchResults.style.maxHeight = '400px';
  searchResults.style.overflowY = 'auto';
  searchResults.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
  searchResults.style.zIndex = '1000';
  searchResults.style.borderRadius = '5px';
  searchResults.style.top = '100%'; // Position below the search bar
  searchResults.style.left = '0';
  searchResults.style.marginTop = '10px'; // Add space between search bar and results
  
  // Add search results container after search div
  const searchDiv = document.querySelector('.search');
  searchDiv.style.position = 'relative';
  searchDiv.appendChild(searchResults);
  
  // Search function
  function performSearch() {
    const query = searchInput.value.toLowerCase().trim();
    
    // Clear previous results
    searchResults.innerHTML = '';
    
    if (query.length === 0) {
      searchResults.style.display = 'none';
      return;
    }
    
    // Filter items based on query
    const filteredItems = searchableItems.filter(item => 
      item.name.toLowerCase().includes(query)
    );
    
    if (filteredItems.length === 0) {
      searchResults.innerHTML = '<div class="search-item">No results found</div>';
      searchResults.style.display = 'block';
      return;
    }
    
    // Display results
    filteredItems.forEach(item => {
      const resultItem = document.createElement('div');
      resultItem.className = 'search-item';
      resultItem.style.padding = '10px 15px';
      resultItem.style.borderBottom = '1px solid #eee';
      resultItem.style.cursor = 'pointer';
      resultItem.style.transition = 'background-color 0.2s';
      resultItem.style.display = 'flex';
      resultItem.style.alignItems = 'center';
      
      resultItem.innerHTML = `
        <div style="width: 50px; height: 50px; margin-right: 15px; display: flex; justify-content: center; align-items: center;">
          <img src="${item.url}" alt="${item.name}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
        </div>
        <div>
          <div style="font-weight: bold;">${item.name}</div>
          <div style="color: #2e5097;">${item.price}</div>
        </div>
      `;
      
      // Hover effect
      resultItem.addEventListener('mouseover', () => {
        resultItem.style.backgroundColor = '#f5f5f5';
      });
      resultItem.addEventListener('mouseout', () => {
        resultItem.style.backgroundColor = 'white';
      });
      
      // Click to navigate
      resultItem.addEventListener('click', () => {
        // Get index of the item in menu
        const menuItems = document.querySelectorAll('.menuItem');
        for (let i = 0; i < menuItems.length; i++) {
          if (menuItems[i].textContent === item.name) {
            // Scroll to that product in the slider
            const wrapper = document.querySelector('.sliderWrapper');
            wrapper.style.transform = `translateX(${-100 * i}vw)`;
            
            // Update the chosen product
            const choosenProduct = products[i];
            
            // Handle product display
            const productImg = document.querySelector('.productImg');
            const productTitle = document.querySelector('.productTitle');
            const productPrice = document.querySelector('.productPrice');
            
            productImg.src = choosenProduct.colors[0].img;
            productTitle.textContent = choosenProduct.title;
            productPrice.textContent = "Rs." + choosenProduct.price;
            
            // Close search results
            searchResults.style.display = 'none';
            searchInput.value = '';
            break;
          }
        }
      });
      
      searchResults.appendChild(resultItem);
    });
    
    searchResults.style.display = 'block';
  }
  
  // Event listeners
  searchInput.addEventListener('input', performSearch);
  searchIcon.addEventListener('click', performSearch);
  
  // Close search results when clicking outside
  document.addEventListener('click', function(event) {
    if (!searchDiv.contains(event.target)) {
      searchResults.style.display = 'none';
    }
  });
  
  // Handle keyboard navigation in search results
  searchInput.addEventListener('keydown', function(e) {
    // If Enter is pressed and search results are shown
    if (e.key === 'Enter' && searchResults.style.display === 'block') {
      const firstResult = searchResults.querySelector('.search-item');
      if (firstResult) {
        firstResult.click();
      }
    }
  });
});