function drag_start (event) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData ("text/plain", event.target.getAttribute("id") + "," + event.offsetX + "," + event.offsetY);
    return true;
}

function drag_enter(event) {
    event.preventDefault();
    return false;
}

function drag_drop (event) {
    parts = event.dataTransfer.getData("text/plain").split(",");
    id = parts[0];
    inner_x = parseInt(parts[1]);
    inner_y = parseInt(parts[2]);
    popin = document.getElementById(id);
    popin.style.position = "absolute";
    popin.style.left = (event.pageX - inner_x) + "px";
    popin.style.top = (event.pageY - inner_y) + "px";
    return false;
}

function drag_over (event) {
    event.preventDefault();
    return false;
}

function hide_popin (popin) {
    popin.style.opacity = 0;
    if (typeof(popin.popin_children) != "undefined") {
	for (c in popin.popin_children) {
	    popin.popin_children[c].style.opacity = 0;
	}
    }
}

function show_popin (popin, event) {
    popin_y_shift = 25;

    popin.style.display = "block"; // Trying to fix that weird bug
    popin.style.opacity = 1.0;
    popin.style.left = event.pageX + "px";
    popin.style.top = (event.pageY + popin_y_shift) + "px";

    current = popin;
    for (current = event.currentTarget.parentElement; current.parentElement != null; current = current.parentElement) {
	if (current.classList.contains("popin")) {
	    if (typeof(current.popin_children) == "undefined") {
		current.popin_children = [];
	    }
	    current.popin_children.push (popin);
	}
    }
}

function toggle_popin (event) {
    popin = document.getElementById(this.getAttribute("for"));

    if (popin.style.opacity > 0) {
	hide_popin(popin);
    } else {
	show_popin(popin, event);
    }
}

function make_draggables () {
    body = document.getElementsByTagName("body")[0];
    body.addEventListener ("dragenter", drag_enter);
    body.addEventListener ("dragover", drag_over);
    body.addEventListener ("drop", drag_drop); 
    draggables = document.getElementsByClassName("popin");
    for (d in draggables) {
	if (isNaN(d)) {
	    continue;
	}
	draggables[d].innerHTML = "<button onclick='hide_popin(this.parentElement)'>X</button>" + draggables[d].innerHTML;
	draggables[d].style.backgroundColor = "#ccc";
	draggables[d].setAttribute("draggable", true);
	draggables[d].addEventListener ("dragstart", drag_start, false);
    }

    links = document.getElementsByClassName("poplink");
    for (l in links) {
	if (isNaN(l)) {
	    continue;
	}
	links[l].addEventListener ("click", toggle_popin);
    }
}

window.addEventListener ("load", make_draggables);
