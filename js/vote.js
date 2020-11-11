const api_url = "http://168.119.228.8:8080/"

let token = new URL(window.location.href).searchParams.get("token")
validateRequestAndEnable()

function validateRequestAndEnable() {
    if (token === null) {
        window.open("index.html?error=7", "_self")
        return
    }

    let submitButton = document.getElementById("submit")
    submitButton.disabled = true

    let xmlHttp = new XMLHttpRequest()
    xmlHttp.open("POST", api_url + "api/v1/validate")
    xmlHttp.setRequestHeader("token", token)
    xmlHttp.addEventListener("load", function () {
        if (xmlHttp.status === 200) {
            let validateType = JSON.parse(xmlHttp.responseText).status
            if (validateType === 0) {
                submitButton.disabled = false
            } else if (validateType === 1) {
                window.open("index.html?error=6", "_self")
            } else if (validateType === 2) {
                alert("Du hast bereits abgestimmt")
            }
        } else {
            window.open("index.html?error=10", "_self")
        }
    })
    // define timeout
    xmlHttp.timeout = 5000;
    xmlHttp.ontimeout = function () {
        window.open("index.html?error=10", "_self")
    }
    xmlHttp.send()
}

function handleSubmit() {
    let radios = document.getElementsByName("radio")
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            document.getElementById("submit").style.display = "block"
            handleCheckedRadio(radios[i])
            break
        }
    }
}

function handleCheckedRadio(radio) {
    let xmlHttp = new XMLHttpRequest()
    xmlHttp.open("POST", api_url + "api/v1/vote")
    xmlHttp.setRequestHeader("token", token)
    xmlHttp.setRequestHeader("votedTeam", radio.value)
    xmlHttp.addEventListener("load", function () {
        if (xmlHttp.status === 200) {
            let json = JSON.parse(xmlHttp.responseText)
            if (json.success) {
                alert("Du hast erfolgreich abgestimmt, vielen Dank")
            } else if (json.error === 2) {
                window.open("index.html?error=10", "_self")
            } else if (json.error === 1) {
                alert("Du hast bereits abgestimmt")
            } else if (json.error === 6) {
                window.open("index.html?error=" + json.error, "_self")
            }
        }
    })
    xmlHttp.send()
}
