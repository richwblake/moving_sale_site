const formContainer = document.getElementById("form-container");
const form = document.getElementById("request-form");
let items = [];
let currentFilter = "all";

const attachListenerToRequestBtns = () => {
    const btns = document.querySelectorAll(".request-btn");

    btns.forEach(btn => {
        btn.addEventListener("click", () => {
            fillFormWithRequestedItem(btn.parentElement.firstElementChild.textContent);
        });
    });
};

const attachListenersToRadioButtons = () => {
    const radios = document.querySelectorAll(".radio-btn");
    radios.forEach(r => r.addEventListener('click', handleFilterClick));
};

const handleFilterClick = e => {
    currentFilter = e.target.value;
    refreshAndAppendElements();
};

const attachListenerToFilterButton = () => {
    const btn = document.getElementById("toggle-filter");
    const filter = document.getElementById("filter");
    btn.addEventListener('click', () => {
        if (btn.textContent === "Show filters") {
            btn.textContent = "Hide filters";
            filter.classList.remove("hidden");
        } else {
            btn.textContent = "Show filters";
            filter.classList.add("hidden");
        }
    });
};

const fillFormWithRequestedItem = itemName => {
    formContainer.classList.remove("hidden");
    form.classList.remove("hidden");
    document.getElementById("form-item-name").value = itemName;
    scrollToForm();
};

const scrollToForm = (offset = 50) => {
    const formPosition = formContainer.getBoundingClientRect().top;
    const offsetPosition = formPosition + window.pageYOffset - offset;

    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
};

attachSubmitEventListenerToForm = ev => {
    form.addEventListener("submit", ev => {
        ev.preventDefault();

        const body = {
            item_name: ev.target["form-item-name"].value,
            return_addr: ev.target["form-item-email"].value,
            comment: ev.target["form-comments"].value,
            s_password: ev.target.s_password.value,
        };

        const config = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        };
        // PRODUCTION ENDPOINT
        fetch("https://wills.fyi/api/sendmsg", config)
            .then(resp => resp.json())
            .catch(console.error);

        // DEVELOPMENT ENDOPOINT
        // fetch("http://localhost:8080/sendmsg", config)
        //     .then(resp => resp.json())
        //     .then(json => console.log("success", json))
        //     .catch(console.error);
        form.reset();
        form.classList.add("hidden");
        flashModal();
        scrollToForm(150);
    }); 
};

const getItems = async () => {
    // Production
    const resp = await fetch("https://wills.fyi/api/items");
    // Development
    // const resp = await fetch("http:/localhost:8080/items");

    const items_json = await resp.json();
    items = items_json.items;
    refreshAndAppendElements();
};

const refreshAndAppendElements = () => {
    const itemContainer = document.getElementById("items-container");
    itemContainer.textContent = "";

    const filteredItems = items.filter(i => i.cat === currentFilter || currentFilter === "all");
    console.log(filteredItems);

    const dom_items = filteredItems.map(item => {
        return constructDOMElementFromItem(item);
    });

    dom_items.forEach(item => {
        itemContainer.append(item);
    });
    attachListenerToRequestBtns();
};

const constructDOMElementFromItem = item => {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item");

    const itemHeader = document.createElement("h1");
    itemHeader.classList.add("item-name");
    itemHeader.textContent = item.name;

    const itemImage = document.createElement("img");
    itemImage.classList.add("item-image");
    itemImage.src = "assets/" + item.images[0] + ".jpg";
    itemImage.alt = item.description;

    const imgBtnDiv = document.createElement("div");
    imgBtnDiv.classList.add("img-btns");
    imgBtnDiv.id = "img-btns";

    const numCont = document.createElement("div");
    numCont.classList.add("num-cont");

    const currentNum = document.createElement("span");
    currentNum.id = "cur-img";
    currentNum.classList.add("cur-img");
    currentNum.textContent = 1;
    const totalNum = document.createElement("span");
    totalNum.id = "num-imgs"
    totalNum.classList.add("num-imgs");
    totalNum.textContent = item.images.length;
    const divider = document.createElement("span");
    divider.textContent = " / ";

    // Assemble image counter element
    numCont.append(currentNum, divider, totalNum);

    const leftButton = document.createElement("button");
    leftButton.id = "left";
    leftButton.classList.add("img-btn");
    leftButton.textContent = "⇦";
    const rightButton = document.createElement("button");
    rightButton.id = "right";
    rightButton.classList.add("img-btn");
    rightButton.textContent = "⇨";

    // Assemble scroller buttons for image
    addListenersToNavBtns(leftButton, rightButton, item, itemImage, currentNum);
    imgBtnDiv.append(numCont, leftButton, rightButton);

    const itemDesc = document.createElement("p");
    itemDesc.classList.add("item-description");
    itemDesc.textContent = item.description;

    const itemPrice = document.createElement("p");
    itemPrice.innerText = `Price: ${item.price}`;
    itemPrice.style.fontWeight = "bold";


    const requestBtn = document.createElement("button");
    requestBtn.classList.add("request-btn");
    requestBtn.textContent = "Request Item!";

    // Assemble DOM element
    itemDiv.append(itemHeader, itemImage, imgBtnDiv, itemDesc, itemPrice, requestBtn);

    return itemDiv;
};

const addListenersToNavBtns = (left, right, item, img, currentNum) => {
    let currIndex = 0;
    left.addEventListener('click', () => {
        if (currIndex <= 0) {
            currIndex = item.images.length - 1;
        } else {
            currIndex -= 1;
        }
        currentNum.textContent = currIndex + 1;
        img.src = "assets/" + item.images[currIndex] + ".jpg"; 
    });


    right.addEventListener('click', () => {
        if (currIndex >= item.images.length - 1) {
            currIndex = 0;
        } else {
            currIndex += 1;
        }
        currentNum.textContent = currIndex + 1;
        img.src = "assets/" + item.images[currIndex] + ".jpg"; 
    });
};

const createImagesForItem = (url, desc) => {
    const img = document.createElement("img");
    img.src = `assets/${url}`;
    img.alt = desc;
    img.classList.add("item-image");

    return img;
};

const flashModal = () => {
    const modal = document.getElementById("modal");
    modal.classList.remove("hidden");
    setTimeout(() => {
        modal.classList.add("hidden");
        formContainer.classList.add("hidden");
    }, 8000);
};

const printDevMessage = () => {
    console.log("Built in a few days by @richwblake(github)");
    console.log("%cPlease reach out using the request form if you need any web job done correctly and quickly.", 'color: blue; text-decoration: underline;');
};

const init = () => {
    printDevMessage();
    attachSubmitEventListenerToForm();
    attachListenerToFilterButton();
    attachListenersToRadioButtons();
    getItems();
};

init();
