const form = document.getElementById("form-container");

const attachListenerToRequestBtns = () => {
    const btns = document.querySelectorAll(".request-btn");

    btns.forEach(btn => {
        btn.addEventListener("click", () => {
            fillFormWithRequestedItem(btn.parentElement.firstElementChild.textContent);
        });
    });
};

const fillFormWithRequestedItem = itemName => {
    form.classList.remove("hidden");
    document.getElementById("form-item-name").value = itemName;
    scrollToForm();
};

const scrollToForm = () => {
    const offset = 50;
    const formPosition = form.getBoundingClientRect().top;
    const offsetPosition = formPosition + window.pageYOffset - offset;

    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
};

const init = () => {
    attachListenerToRequestBtns();
};

init();
