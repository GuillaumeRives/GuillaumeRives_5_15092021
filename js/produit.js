//Création de l'objet Connector pour requêter l'API
const APIConn = new Connector();

//Création de l'objet panier pour manipuler le panier
const Cart = new cart();
const CartItem = new cartItem();

//Récupération du loader
const loader = document.getElementById("loader");

//Récupère et affiche le nombre d'articles dans le panier
const nbArticles = document.getElementById("nbArticles");
Cart.displayNbArticles(nbArticles);

//Récupère les paramètres d'URL
const URLParams = new URLSearchParams(window.location.search);
const ProdID = URLParams.get("id");

//Création d'une requete de récupération d'un appareil par son ID
const requestedCam = APIConn.getCamById(ProdID);

requestedCam.then(response => {
    loader.remove();
    if (response._id) {
        //Récupération des éléments de la page à peupler
        const card = document.getElementById("cardContent");
        const backImage = document.getElementById("backImage");
        const descImage = document.getElementById("descImage");
        const prodTitle = document.getElementById("prodTitle");
        const prodDesc = document.getElementById("prodDesc");
        const prodPrice = document.getElementById("prodPrice");
        const prodOptions = document.getElementById("prodOptions");
        backImage.src = response.imageUrl;
        descImage.src = response.imageUrl;
        prodTitle.textContent = response.name;
        prodDesc.textContent = response.description;
        prodPrice.textContent = new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(response.price / 100);
        let optionIndex = 1;
        response.lenses.forEach(option => {
            const optionTag = document.createElement("option");
            optionTag.value = optionIndex;
            optionTag.textContent = option;
            prodOptions.appendChild(optionTag);
            optionIndex++;
        });
        card.classList = "card p-2 shadow";
        //Création du toast relatif au produit
        let toastTitle = document.getElementById("toastTitle");
        let toastImg = document.getElementById("toastImg");
        let toastMessage = document.getElementById("toastMessage");
        toastTitle.textContent = response.name;
        toastImg.src = response.imageUrl;
        toastImg.alt = response.name;
        toastMessage.innerHTML = "<a href='panier.html'>Votre panier</a> a été mis à jour !";
        //Création d'un élément à rajouter au panier
        CartItem.set(response._id, 1);
    }
}).catch((error) => {
    loader.remove();
    console.error(error);
    //Sinon, on inscrit le code erreur dans la console et sur la page
    let errMessage = new Alert("Oups, une erreur est survenue", "Le produit n'existe peut-être plus ou nous rencontrons un problème...");
    const card = document.getElementById("cardContent");
    card.classList = "card p-2 shadow d-none";
    errMessage.appendTo("camInfo", 1);
});

//Ajout dans le panier
const addButton = document.getElementById("addButton");
const quantity = document.getElementById("prodQuantity");
addButton.addEventListener("click", function () {
    CartItem.quantity = parseInt(quantity.value, 10);
    Cart.addItem(CartItem);
    Cart.displayNbArticles(nbArticles);

    let toastContainer = document.getElementById("productToast");
    let toast = new bootstrap.Toast(toastContainer);
    toast.show();
});