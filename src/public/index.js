const socketClient = io()

const buttons = document.querySelectorAll('button[type="submit"]');


buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
        e.preventDefault();
        const product = {
            id: button.id
        };
        socketClient.emit("prodToCart", product)
    })
})

const div = document.getElementById("admin");
if (div) {
  div.setAttribute("style", "display: block;");
}