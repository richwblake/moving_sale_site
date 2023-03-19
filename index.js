const formContainer = document.getElementById("form-container");
const form = document.getElementById("request-form");

const attachListenerToRequestBtns = () => {
    const btns = document.querySelectorAll(".request-btn");

    btns.forEach(btn => {
        btn.addEventListener("click", () => {
            fillFormWithRequestedItem(btn.parentElement.firstElementChild.textContent);
        });
    });
};

const fillFormWithRequestedItem = itemName => {
    formContainer.classList.remove("hidden");
    form.classList.remove("hidden");
    document.getElementById("form-item-name").value = itemName;
    scrollToForm();
};

const scrollToForm = () => {
    const offset = 50;
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
        };

        const config = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        };
        fetch("https://wills.fyi/api/sendmsg", config)
            .then(resp => resp.json())
            .then(json => console.log("success", json))
            .catch(console.error);

        form.reset();
        form.classList.add("hidden");
        flashModal();
    }); 
};

const flashModal = () => {
    const modal = document.getElementById("modal");
    modal.classList.remove("hidden");
    setTimeout(() => {
        modal.classList.add("hidden");
        formContainer.classList.add("hidden");
    }, 3000);
};

const init = () => {
    attachListenerToRequestBtns();
    attachSubmitEventListenerToForm();
};

init();
