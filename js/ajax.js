function ajax_get(url, callback) {
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

ajax_get('http://localhost:8080/bicycles?style=BMX', replaceBmxCatalog);

function replaceBmxCatalog(data) {
    var subCatalogName = "BMX_catalog";
    replaceSubCatalog(subCatalogName, data);
}

function replaceSubCatalog(subCatalogName, data) {
    var subCatalogElement = document.getElementById(subCatalogName);
    var replaceable_product = subCatalogElement.
    children.namedItem("replaceable_product");
    for (i = 0; i < data.length; ++i) {
        var new_div = makeDiv(replaceable_product, data[i])
        subCatalogElement.insertAdjacentElement("beforeend", new_div);
    }
    subCatalogElement.removeChild(
        subCatalogElement.children.namedItem("replaceable_product")
    );
}

function makeDiv(replaceable_product, data_element) {
    var replacing_product = replaceable_product.cloneNode(true);
    replacing_product.removeAttribute("id");

    var link = replacing_product.firstElementChild;
    var hrefAttr = link.attributes.getNamedItem("href");
    var hrefValue = "http://localhost:8080/bicycles/" + data_element["id"];
    hrefAttr.value = hrefValue;

    var imgThumb = link.children.namedItem("replaceable_img-thumb");
    var imgThumbSrcAttr = imgThumb.attributes.getNamedItem("src");
    var srcValue = data_element["imgLink"];
    imgThumbSrcAttr.value = srcValue;

    var paragraph = link.children.namedItem("replaceable_text");
    paragraph.innerHTML = data_element["name"];
    return replacing_product;
}