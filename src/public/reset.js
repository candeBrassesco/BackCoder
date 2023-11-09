const sendButton = document.getElementById("send")
const emailInput = document.getElementById("email")

sendButton.addEventListener("click", async () => {
    const email = emailInput.value;
  
    const response = await fetch("/api/session/resetPass", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
  
    if (response.status === 200) {
      Swal.fire("Check your email! We've sent you a link to reset your password");
    } else {
      Swal.fire("Sorry! An error ocurred, please check the entered email");
    }
  });
