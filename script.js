// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
  
  // ===== MOBILE NAVIGATION =====
  const mobileNavButton = document.querySelector('.mobile-nav-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileNavButton) {
    mobileNavButton.addEventListener('click', function() {
      this.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
  }
  
  // ===== SMOOTH SCROLLING =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Close mobile menu if open
        if (navLinks.classList.contains('active')) {
          mobileNavButton.classList.remove('active');
          navLinks.classList.remove('active');
        }
        
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // ===== ACTIVE NAV LINK HIGHLIGHTING =====
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-links a');
  
  function highlightNavItem() {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });
    
    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });
  }
  
  window.addEventListener('scroll', highlightNavItem);
  highlightNavItem(); // Run on initial load
  
  // ===== PRODUCT FILTERING =====
  const filterButtons = document.querySelectorAll('.category-filters button');
  if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Get filter value
        const filterValue = this.dataset.filter;
        
        // Filter products
        document.querySelectorAll('.product-card').forEach(card => {
          if (filterValue === 'all' || card.dataset.category === filterValue) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
  
  // ===== SHOPPING CART FUNCTIONALITY =====
  let cart = JSON.parse(localStorage.getItem('greenline_cart')) || [];
  
  function updateCart() {
    // Update cart count in header
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) cartCount.textContent = cart.length;
    
    // Save to localStorage
    localStorage.setItem('greenline_cart', JSON.stringify(cart));
  }
  
  // Add to cart buttons
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
      const productCard = this.closest('.product-card');
      const product = {
        id: productCard.dataset.id,
        name: productCard.querySelector('.product-name').textContent,
        price: parseFloat(productCard.dataset.price),
        image: productCard.querySelector('img').src,
        category: productCard.dataset.category
      };
      
      // Check if product already in cart
      const existingItem = cart.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
      } else {
        product.quantity = 1;
        cart.push(product);
      }
      
      updateCart();
      showNotification(`${product.name} added to cart!`);
    });
  });
  
  // Show notification
  function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
          notification.remove();
        }, 300);
      }, 3000);
    }, 10);
  }
  
  // Initialize cart
  updateCart();
  
  // ===== CONTACT FORM VALIDATION =====
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      let isValid = true;
      
      // Validate each field
      this.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
          field.classList.add('error');
          isValid = false;
        } else {
          field.classList.remove('error');
        }
      });
      
      // Validate email format
      const emailField = this.querySelector('[type="email"]');
      if (emailField && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
        emailField.classList.add('error');
        isValid = false;
      }
      
      if (isValid) {
        // Form is valid - you would typically send data to server here
        this.innerHTML = `
          <div class="form-success">
            <i class="fas fa-check-circle"></i>
            <h3>Thank You!</h3>
            <p>Your message has been sent successfully.</p>
          </div>
        `;
      }
    });
  }
  
  // ===== IMAGE LAZY LOADING =====
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.onload = () => img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  }
  
  // ===== STICKY HEADER =====
  const header = document.querySelector('header');
  let lastScroll = 0;
  
  window.addEventListener('scroll', function() {
    const currentScroll = window.scrollY;
    
    if (currentScroll <= 0) {
      header.classList.remove('scrolled');
      return;
    }
    
    if (currentScroll > lastScroll && currentScroll > 100) {
      // Scrolling down
      header.classList.add('scrolled-down');
      header.classList.remove('scrolled-up');
    } else {
      // Scrolling up
      header.classList.add('scrolled-up');
      header.classList.remove('scrolled-down');
    }
    
    header.classList.toggle('scrolled', currentScroll > 50);
    lastScroll = currentScroll;
  });
});