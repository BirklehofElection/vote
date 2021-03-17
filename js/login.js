const api_url = "https://api.derklaro.me/"

let error = new URL(window.location.href).searchParams.get("error")
if (error !== null) {
    let box = document.getElementById("box")
    if (error === "4") {
        box.innerText = "Die E-Mail wurde bereits versendet."
        resetBoxContent()
    } else if (error === "5") {
        box.innerText = "Bitte gib deine korrekte E-Mail an!"
        resetBoxContent()
    } else if (error === "6") {
        alert("Der genutzte Token ist ungültig.")
    } else if (error === "7") {
        alert("Bitte nutze den in der E-Mail angegebenen Link, um diese Seite aufzurufen.")
    } else if (error === "3" || error === "10") {
        box.innerText = "Ein Serverfehler ist aufgetreten."
        resetBoxContent()
    }
}

$(document).ready(function () {
    $('#main').submit(event => {
        event.preventDefault()

        let email = document.getElementById("mail").value
        if (email.length === 0) {
            alert("Bitte gib einen Benutzernamen und ein Passwort an.")
            return
        }

        let xmlHttp = new XMLHttpRequest()
        xmlHttp.open("POST", api_url + "api/v1/requestToken")
        xmlHttp.setRequestHeader("email", email)
        xmlHttp.addEventListener("load", function () {
            if (xmlHttp.status === 200) {
                let json = JSON.parse(xmlHttp.responseText);
                if (json.success) {
                    document.getElementById("box").innerText = "Die E-Mail wurde gesendet!"
                } else {
                    window.open("?error=" + json.error, "_self")
                }
            } else {
                window.open("?error=10", "_self")
            }
        })
        xmlHttp.send()
    })
})

function resetBoxContent() {
    setTimeout(function () {
        document.getElementById("box").innerText = "Bitte Schul-E-Mail benutzen!"
    }, 5000)
}
