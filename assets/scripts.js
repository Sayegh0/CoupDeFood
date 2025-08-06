// Variables globales
let currentTheme = 'light';
let cart = [];
let favorites = [];
let menuData = {};

let longPressTimer;
let longPressDuration = 3000; // 3 secondes

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const logo = document.getElementById('logo');
const navCategories = document.getElementById('navCategories');
const menuContainer = document.getElementById('menuContainer');
const homeSection = document.getElementById('homeSection');
const menuSection = document.getElementById('menuSection');
const menuCategoryTitle = document.getElementById('menuCategoryTitle');
const cartIcon = document.getElementById('cartIcon');
const cartModal = document.getElementById('cartModal');
const cartItems = document.getElementById('cartItems');
const cartCount = document.querySelector('.cart-count');
const subtotal = document.getElementById('subtotal');
const clearCart = document.getElementById('clearCart');
const checkout = document.getElementById('checkout');
const closeCart = document.querySelector('.close-cart');
//const paymentOptions = document.getElementById('paymentOptions');
//const payOnDelivery = document.getElementById('payOnDelivery');
//const payOnline = document.getElementById('payOnline');
//const orangeMoney = document.getElementById('orangeMoney');
//const wave = document.getElementById('wave');
const specialRequest = document.getElementById('specialRequest');
//const cartNotification = document.getElementById('cartNotification');
//const floatingCart = document.getElementById('floatingCart');
//const cartCountBadge = document.getElementById('cartCountBadge');
// const exportExcel = document.getElementById('exportExcel');
// const statsPeriod = document.getElementById('statsPeriod');
// const refreshStats = document.getElementById('refreshStats');
// const topDishes = document.getElementById('topDishes');
// const topCategories = document.getElementById('topCategories');
const carouselSlide = document.getElementById('carouselSlide');
const carouselPrev = document.getElementById('carouselPrev');
const carouselNext = document.getElementById('carouselNext');

// Chargement initial
document.addEventListener('DOMContentLoaded', () => {
    // Charger les données du menu
    loadMenuData();
    
    // Initialiser le thème
    initTheme();
    
    // Initialiser les écouteurs d'événements
    initEventListeners();
    
    // Charger le panier depuis le localStorage
    loadCart();
    
    // Charger les favoris depuis le localStorage
    loadFavorites();
    

});

// Charger les données du menu
function loadMenuData() {
    const menuDataElement = document.getElementById('menuData');
    menuData = JSON.parse(menuDataElement.textContent);
    
    renderCategories();
    renderAllDishes();
    initCarousel();
}

// Initialiser le thème
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
}

// Définir le thème
function setTheme(theme) {
    currentTheme = theme;
    document.body.className = theme === 'dark' ? 'dark-theme' : '';
    localStorage.setItem('theme', theme);
    
    // Mettre à jour l'icône du bouton de thème
    const moonIcon = themeToggle.querySelector('.fa-moon');
    const sunIcon = themeToggle.querySelector('.fa-sun');
    
    if (theme === 'dark') {
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'inline-block';
    } else {
        moonIcon.style.display = 'inline-block';
        sunIcon.style.display = 'none';
    }
}

// Initialiser les écouteurs d'événements
function initEventListeners() {
    // Bouton de bascule du thème
    themeToggle.addEventListener('click', toggleTheme);
    
    // Logo - clic pour accueil
    logo.addEventListener('mousedown', startLongPress);
    logo.addEventListener('mouseup', endLongPress);
    logo.addEventListener('mouseleave', endLongPress);
    logo.addEventListener('touchstart', startLongPress);
    logo.addEventListener('touchend', endLongPress);
    logo.addEventListener('click', goToHome);
    
    // Bouton favoris
    const favoritesBtn = document.createElement('button');
    favoritesBtn.className = 'favorites-btn';
    favoritesBtn.innerHTML = '<i class="fas fa-heart"></i>';
    favoritesBtn.title = 'Voir mes favoris';
    favoritesBtn.addEventListener('click', () => {
        homeSection.style.display = 'none';
        menuSection.style.display = 'block';
        showFavorites();
    });
    
    // Ajouter le bouton favoris dans le header
    const headerActions = document.querySelector('.header-actions');
    headerActions.insertBefore(favoritesBtn, themeToggle);
    
    
    // Panier
    cartIcon.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);
    clearCart.addEventListener('click', clearCartItems);
    checkout.addEventListener('click', proceedToCheckout);
    payOnDelivery.addEventListener('click', proceedToCheckout);
    payOnline.addEventListener('click', () => {});
    orangeMoney.addEventListener('click', () => proceedToCheckout('orange'));
    wave.addEventListener('click', () => proceedToCheckout('wave'));
    
    // Carrousel
    carouselPrev.addEventListener('click', () => navigateCarousel(-1));
    carouselNext.addEventListener('click', () => navigateCarousel(1));
    
    // Gestion des clics en dehors des modals pour les fermer
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('overlay')) {
            toggleCart();
        }
    });
}

// Basculer entre les thèmes clair/sombre
function toggleTheme() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// Gestion du clic long pour l'admin
function startLongPress(e) {
    e.preventDefault();
    console.log('Début du clic long');
    longPressTimer = setTimeout(() => {
        console.log('Clic long détecté');
    }, longPressDuration);
}

function endLongPress() {
    console.log('Fin du clic long');
    clearTimeout(longPressTimer);
}

// Aller à l'accueil
function goToHome() {
    homeSection.style.display = 'block';
    menuSection.style.display = 'none';
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
}

// Afficher les catégories dans la navigation
function renderCategories() {
    navCategories.innerHTML = '';
    
    // Ajouter un bouton pour tous les plats
    const allButton = document.createElement('button');
    allButton.className = 'category-btn active';
    allButton.textContent = 'Tous';
    allButton.addEventListener('click', () => {
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        allButton.classList.add('active');
        renderAllDishes();
        goToMenu();
    });
    navCategories.appendChild(allButton);
    
    // Ajouter les catégories du menu
    menuData.categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'category-btn';
        button.textContent = category.name;
        button.addEventListener('click', () => {
            document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            renderDishesByCategory(category.name);
            goToMenu();
        });
        navCategories.appendChild(button);
    });
}

// Afficher tous les plats
function renderAllDishes() {
    menuCategoryTitle.textContent = 'Notre Menu';
    renderDishes(menuData.dishes);
}

// Afficher les plats par catégorie
function renderDishesByCategory(category) {
    menuCategoryTitle.textContent = category;
    const filteredDishes = menuData.dishes.filter(dish => dish.category === category);
    renderDishes(filteredDishes);
}

// Afficher les plats favoris
function showFavorites() {
    if (favorites.length === 0) {
        menuContainer.innerHTML = '<p class="no-results">Vous n\'avez aucun plat en favori.</p>';
        menuCategoryTitle.textContent = 'Mes Favoris';
        return;
    }
    
    const favoriteDishes = menuData.dishes.filter(dish => favorites.includes(dish.id));
    menuCategoryTitle.textContent = 'Mes Favoris';
    renderDishes(favoriteDishes);
}

// Afficher les plats filtrés
function renderDishes(dishes) {
    menuContainer.innerHTML = '';
    
    if (dishes.length === 0) {
        menuContainer.innerHTML = '<p class="no-results">Aucun plat trouvé.</p>';
        return;
    }
    
    dishes.forEach(dish => {
        const isFavorite = favorites.includes(dish.id);
        const card = document.createElement('div');
        card.className = 'dish-card';
        card.dataset.id = dish.id;
        
        card.innerHTML = `
            ${dish.popular ? '<span class="popular-badge">Populaire</span>' : ''}
            <img src="${dish.image}" alt="${dish.name}" class="dish-image">
            <div class="dish-info">
                <div class="dish-header">
                    <h3 class="dish-name">${dish.name}</h3>
                    <span class="dish-price">${dish.price.toLocaleString()} FCFA</span>
                </div>
                ${dish.ingredients ? `<p class="dish-ingredients">${dish.ingredients}</p>` : ''}
                ${(dish.category !== 'Boisson' && (dish.calories || dish.proteins)) ? `
                <div class="dish-nutrition">
                    ${dish.calories ? `
                    <div class="nutrition-item">
                        <span class="icon">🔥</span>
                        <span>${dish.calories} kcal</span>
                    </div>` : ''}
                    ${dish.proteins ? `
                    <div class="nutrition-item">
                        <span class="icon">💪</span>
                        <span>${dish.proteins}g protéines</span>
                    </div>` : ''}
                </div>` : ''}
                <div class="dish-actions">
                    <button class="favorite-btn ${isFavorite ? 'favorited' : ''}" data-id="${dish.id}">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="btn-add-to-cart" data-id="${dish.id}">
                        <i class="fas fa-plus"></i> Ajouter
                    </button>
                </div>
            </div>
        `;
        
        menuContainer.appendChild(card);
    });
    
    // Ajouter les écouteurs d'événements pour les nouveaux éléments
    addDishEventListeners();
}

// Aller à la section menu
function goToMenu() {
    homeSection.style.display = 'none';
    menuSection.style.display = 'block';
}

// Ajouter les écouteurs d'événements aux cartes de plats
function addDishEventListeners() {
    // Boutons favoris
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', toggleFavorite);
    });
    
    // Boutons ajouter au panier
    document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
        btn.addEventListener('click', addToCart);
    });
    
    // Effets hover sur les cartes
    document.querySelectorAll('.dish-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('hover');
        });
        
        card.addEventListener('mouseleave', () => {
            card.classList.remove('hover');
        });
        
        card.addEventListener('click', (e) => {
            // Ne pas sélectionner si on clique sur un bouton à l'intérieur
            if (!e.target.closest('button')) {
                document.querySelectorAll('.dish-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
            }
        });
    });
}

// Créer un cœur flottant
function createFloatingHeart(x, y) {
    const heart = document.createElement('div');
    heart.className = 'heart-float';
    heart.innerHTML = '❤️';
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    
    // Ajouter au corps du document
    document.body.appendChild(heart);
    
    // Supprimer après l'animation
    setTimeout(() => {
        heart.remove();
    }, 1500);
}

// Basculer un plat en favori
function toggleFavorite(e) {
    e.stopPropagation();
    const dishId = parseInt(e.currentTarget.dataset.id);
    const index = favorites.indexOf(dishId);
    
    if (index === -1) {
        favorites.push(dishId);
        e.currentTarget.classList.add('favorited');
        
        // Créer plusieurs cœurs flottants
        const rect = e.currentTarget.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        // Créer plusieurs cœurs avec un léger décalage
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                createFloatingHeart(
                    x + (Math.random() * 40 - 20),
                    y + (Math.random() * 20 - 10)
                );
            }, i * 100);
        }
    } else {
        favorites.splice(index, 1);
        e.currentTarget.classList.remove('favorited');
    }
    
    saveFavorites();
}

// Ajouter un plat au panier
function addToCart(e) {
    const dishId = parseInt(e.currentTarget.dataset.id);
    const dish = menuData.dishes.find(d => d.id === dishId);
    
    if (!dish) return;
    
    // Vérifier si le plat est déjà dans le panier
    const existingItem = cart.find(item => item.id === dishId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...dish,
            quantity: 1
        });
    }
    
    // Mettre à jour le panier
    updateCart();
    
    // Afficher la notification "Ajouté au Panier"
    showCartNotification();
    
    // Animation du panier flottant
    if (cartIcon) {
        cartIcon.classList.add('pulse');
        setTimeout(() => {
            cartIcon.classList.remove('pulse');
        }, 600);
    }
}

// Mettre à jour le panier
function updateCart() {
    saveCart();
    renderCartItems();
    updateCartCount();
}

// Afficher la notification "Ajouté au Panier"
function showCartNotification() {
    // Vérifier si l'élément existe, sinon le chercher à nouveau
    const notification = cartNotification || document.getElementById('cartNotification');
    
    if (!notification) {
        console.error('cartNotification element not found');
        return;
    }
    
    // Ajouter la classe show pour déclencher l'animation
    notification.classList.add('show');
    
    // Retirer la notification après 3 secondes
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Sauvegarder le panier dans le localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Charger le panier depuis le localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Sauvegarder les favoris dans le localStorage
function saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Charger les favoris depuis le localStorage
function loadFavorites() {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
        favorites = JSON.parse(savedFavorites);
    }
}

// Mettre à jour le compteur du panier
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Mettre à jour le compteur du panier flottant
    if (cartCount) {
        cartCount.textContent = count;
        
        // Afficher/masquer le compteur selon le contenu
        if (count > 0) {
            cartCount.style.display = 'flex';
        } else {
            cartCount.style.display = 'none';
        }
    }
    
    // Gérer la pulsation continue premium
    if (cartIcon) {
        if (count > 0) {
            cartIcon.classList.add('has-items');
        } else {
            cartIcon.classList.remove('has-items');
        }
    }
}

// Afficher/Masquer le panier
function toggleCart() {
    if (cartModal.style.right === '0px') {
        cartModal.style.right = '-100%';
        document.body.classList.remove('no-scroll');
    } else {
        cartModal.style.right = '0';
        document.body.classList.add('no-scroll');
        renderCartItems();
    }
}

// Afficher les articles du panier
function renderCartItems() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Votre panier est vide</p>';
        subtotal.textContent = '0 FCFA';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.dataset.id = item.id;
        
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <p class="cart-item-name">${item.name} × ${item.quantity}</p>
                <p class="cart-item-price">${itemTotal.toLocaleString()} FCFA</p>
            </div>
            <button class="remove-item" data-id="${item.id}">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    // Ajouter les écouteurs d'événements pour les boutons de suppression
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', removeFromCart);
    });
    
    // Mettre à jour le total
    subtotal.textContent = `${total.toLocaleString()} FCFA`;
}

// Supprimer un article du panier
function removeFromCart(e) {
    const dishId = parseInt(e.currentTarget.dataset.id);
    const index = cart.findIndex(item => item.id === dishId);
    
    if (index !== -1) {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else {
            cart.splice(index, 1);
        }
        
        updateCart();
    }
}

// Vider le panier
function clearCartItems() {
    if (cart.length === 0) return;
    
    // Afficher la notification de confirmation personnalisée
    showClearCartConfirmation();
}

// Afficher la notification de confirmation de vidage du panier
function showClearCartConfirmation() {
    const confirmation = document.getElementById('clearCartConfirmation');
    if (confirmation) {
        confirmation.classList.add('show');
    }
}

// Confirmer le vidage du panier
function confirmClearCart() {
    cart = [];
    updateCart();
    toggleCart();
    hideClearCartConfirmation();
}

// Annuler le vidage du panier
function cancelClearCart() {
    hideClearCartConfirmation();
}

// Masquer la notification de confirmation
function hideClearCartConfirmation() {
    const confirmation = document.getElementById('clearCartConfirmation');
    if (confirmation) {
        confirmation.classList.remove('show');
    }
}

// Passer à la commande
function proceedToCheckout() {
    if (cart.length === 0) return;
    
    let message = 'Bonjour, je souhaite passer une commande :\n\n';
    
    cart.forEach(item => {
        message += `- *${item.quantity} × ${item.name}* : ${(item.price * item.quantity).toLocaleString()} FCFA\n`;
    });
    
    // Ajouter la demande spéciale si elle existe
    const request = specialRequest.value.trim();
    if (request) {
        message += `\nSupplément / Demande spéciale : ${request}\n`;
    }
    
    // Ajouter le total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const requestFee = request ? 2000 : 0;
    const grandTotal = total + requestFee;
    
    message += `\nSous-total : ${total.toLocaleString()} FCFA`;
    if (requestFee > 0) {
        message += `\nPar Supplément Rajouté : ${requestFee.toLocaleString()} FCFA`;
    }
    message += `\nTotal : ${grandTotal.toLocaleString()} FCFA`;
    
    // Message de confirmation de commande
    message += '\n\nJe confirme ma commande et je paierai à la livraison.';
    
    // Rediriger vers WhatsApp
    const phoneNumber = '+2250708305100';
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    
    // Vider le panier après la commande
    cart = [];
    updateCart();
    toggleCart();
    specialRequest.value = '';
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    loadFavorites();
    updateCartCount();
    renderCartItems();
});

// Initialiser le carrousel
function initCarousel() {
    // Ajouter les images de catégories au carrousel
    carouselSlide.innerHTML = menuData.categories.map(category => `
        <img src="${category.image}" alt="${category.name}">
    `).join('');
    
    // Configurer le défilement automatique
    let currentIndex = 0;
    const slides = document.querySelectorAll('.carousel-slide img');
    const totalSlides = slides.length;
    
    function showSlide(index) {
        if (index >= totalSlides) currentIndex = 0;
        if (index < 0) currentIndex = totalSlides - 1;
        
        carouselSlide.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
    
    // Défilement automatique toutes les 5 secondes
    setInterval(() => {
        currentIndex++;
        showSlide(currentIndex);
    }, 5000);
}

// Navigation manuelle du carrousel
function navigateCarousel(direction) {
    const slides = document.querySelectorAll('.carousel-slide img');
    const totalSlides = slides.length;
    let currentIndex = parseInt(carouselSlide.style.transform?.replace('translateX(-', '').replace('%)', '')) / 100 || 0;
    
    currentIndex += direction;
    if (currentIndex >= totalSlides) currentIndex = 0;
    if (currentIndex < 0) currentIndex = totalSlides - 1;
    
    carouselSlide.style.transform = `translateX(-${currentIndex * 100}%)`;
}

// Fonction inutilisée
/*
function showOnlinePaymentOptions() {
    // ...
}
*/

// Ancien code de chargement externe (remplacé par chargement inline)
/*
function loadMenuData() {
    fetch('menu.json')
        .then(response => response.json())
        .then(data => {
            menuData = data;
            renderCategories();
            renderAllDishes();
            initCarousel();
        })
        .catch(error => console.error('Erreur de chargement du menu:', error));
}
*/