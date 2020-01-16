function expandNavbar(aNavbar) {
    let x = document.getElementById(aNavbar);
    if (x.className === "navbar") {
        x.className += " responsive";
    }
    else {
        x.className = "navbar";
    }
}