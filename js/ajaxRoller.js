var skatewheelId = getParams()["id"]
ajaxGetData("http://localhost:8080/rollers/" + skatewheelId, fillData);

function ajaxGetData(url, callback) {
    var xmlhttp = new XMLHttpRequest()
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            try {
                var data = JSON.parse(xmlhttp.responseText);
            } catch (err) {
                console.log(err.message + " in " + xmlhttp.responseText);
                return;
            }
            callback(data)
        }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function fillData(data) {
    document.getElementById("productTitle").innerHTML = data["name"];
    document.getElementById("imgHref").attributes.
    getNamedItem("href").value = "../.."+data["imgLink"];
    document.getElementById("imgLink").attributes.
    getNamedItem("src").value = "../.."+data["imgLink"];
    document.getElementById("productName").innerHTML = data["name"];
    document.getElementById("shortDesc").innerHTML = data["shortDesc"];
    document.getElementById("fullDesc").innerHTML = data["fullDesc"];
    document.getElementById("wheelSize").innerHTML = "Размер колёс: " + data["wheelSize"];
    document.getElementById("size").innerHTML = "Размер обуви: " + data["size"];
    document.getElementById("wheelNum").innerHTML = "Количество колёс: " + data["wheelNum"];
    document.getElementById("age").innerHTML = "Возраст: " + data["age"];
    document.getElementById("sex").innerHTML = "Пол: " + data["sex"];
    document.getElementById("color").innerHTML = "Цвет: " + data["color"];
}

function getParams() {
    let params = window
        .location
        .search
        .replace('?','')
        .split('&')
        .reduce(
            function(p,e){
                var a = e.split('=');
                p[ decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
                return p;
            },
            {}
        )
    return params;
}


