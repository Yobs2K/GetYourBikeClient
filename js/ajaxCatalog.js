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

var bicycleStyles;
ajaxGetData('http://localhost:8080/bicycles/styles', saveSubCatalogNamesAndStartAjax);

function saveSubCatalogNamesAndStartAjax(data) {
    bicycleStyles = data;
    makeSubCatalogs(bicycleStyles, "bicycle_catalog");
    for (i = 0; i < bicycleStyles.length; ++i) {
        ajaxGetData("http://localhost:8080/bicycles?style=" + bicycleStyles[i], replaceBicycleSubCatalog);
    }
    ajaxGetData("http://localhost:8080/rollers", replaceRollerSubCatalog);
    ajaxGetData("http://localhost:8080/skateboards", replaceSkateboardSubCatalog);
    ajaxGetData("http://localhost:8080/skatewheels", replaceSkatewheelSubCatalog);
}


function replaceBicycleSubCatalog(data) {
    var subCatalogName = data[0]["style"];
    replaceSubCatalog(subCatalogName, "bicycle_catalog", data, "bicycle");
}

function replaceRollerSubCatalog(data) {
    replaceSubCatalog("sub_catalog", "roller_catalog", data, "roller")
}

function replaceSkateboardSubCatalog(data) {
    replaceSubCatalog("sub_catalog", "skateboard_catalog", data, "skateboard")
}

function replaceSkatewheelSubCatalog(data) {
    replaceSubCatalog("sub_catalog", "skatewheel_catalog", data, "skatewheel")
}

function makeSubCatalogs(subCatalogNames, catalogName) {
    var catalog = document.getElementById(catalogName);
    for (i = 0; i < subCatalogNames.length; ++i) {
        catalog.innerHTML += "<h5>" + subCatalogNames[i] + "</h5>";
        var subCatalogElement = catalog.children.namedItem("sub_catalog");
        var subCatalogElementClone = subCatalogElement.cloneNode(true);
        var subCatalogElementCloneIdAttr = subCatalogElementClone.attributes.getNamedItem("id");
        subCatalogElementCloneIdAttr.value = subCatalogNames[i];
        catalog.insertAdjacentElement("beforeend", subCatalogElementClone);
    }
    catalog.removeChild(
        catalog.children.namedItem("sub_catalog")
    );
    catalog.removeChild(
        catalog.children.namedItem("sub_catalog_title")
    );
}

function replaceSubCatalog(subCatalogName, catalogName, data, productType) {
    var catalog = document.getElementById(catalogName);
    var subCatalogElement = catalog.children.namedItem(subCatalogName);
    var replaceable_product = subCatalogElement.
    children.namedItem("replaceable_product");
    for (i = 0; i < data.length; ++i) {
        var new_div = makeDiv(replaceable_product, data[i], productType)
        subCatalogElement.insertAdjacentElement("beforeend", new_div);
    }
    subCatalogElement.removeChild(
        subCatalogElement.children.namedItem("replaceable_product")
    );
}

function makeDiv(replaceable_product, data_element, productType) {
    var replacing_product = replaceable_product.cloneNode(true);
    replacing_product.removeAttribute("id");
    var link = replacing_product.firstElementChild;
    var hrefAttr = link.attributes.getNamedItem("href");
    var hrefValue = productType + "/?id=" + data_element["id"];
    hrefAttr.value = hrefValue;
    var imgThumb = link.children.namedItem("replaceable_img-thumb");
    var imgThumbSrcAttr = imgThumb.attributes.getNamedItem("src");
    var srcValue = data_element["imgLink"];
    imgThumbSrcAttr.value = srcValue;
    var paragraph = link.children.namedItem("replaceable_text");
    paragraph.innerHTML = data_element["name"];
    return replacing_product;
}