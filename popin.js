/**
 * This library allows the creation of small floating windows within
 * the page. They can be closed by clicking on the same text that
 * opened them, or on the small 'X' button in their right-hand
 * corners.
 *
 * Most of the machinery is generated procedurally. Links are inserted
 * as elements which are members of the class specified by
 * POPIN_LINK_CLASS, with a for= attribute set to the id of the
 * element to display. The element itself should be of the class
 * POPIN_CLASS. style.css contains sample styles for both of these.
 * The X button is added dynamically.
 *
 * Finally, closing a window will also close all of its children. If
 * this is unwanted, alter hide_popin() to not iterate over the
 * child elements.
 */

var POPIN_CLASS = "popin";
var POPIN_LINK_CLASS = "poplink";

/**
 * Handler for the dragstart event. Encodes the element ID and the
 * position of the mouse inside it as the Drag-and-Drop data.
 */
function drag_start (event) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData ("text/plain", event.target.getAttribute("id") + "," + event.offsetX + "," + event.offsetY);
    return true;
}

/**
 * This is just part of the incantation to ensure Drag-and-Drop
 * works. This one is fired when first entering a drag-receiving
 * element.
 */
function drag_enter(event) {
    event.preventDefault();
    return false;
}

/**
 * The handler for the drop event, where the ID and inner coordinates
 * are extracted (see drag_start()) and the element's location is set
 * (in absolute coordinates) to where it was dropped.
 *
 * The handler is set for the <body> element so it works over the
 * entire document.
 */
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

/**
 * See comment for drag_enter
 */
function drag_over (event) {
    event.preventDefault();
    return false;
}

/**
 * Hide the small window, and any of its children.
 */
function hide_popin (popin) {
    popin.style.opacity = 0;
    if (typeof(popin.popin_children) != "undefined") {
	for (c in popin.popin_children) {
	    hide_popin (popin.popin_children[c]);
	}
    }
}

/**
 * Show the small window, and make it a child of another window
 * if the poplink element was in a popin itself.
 */
function show_popin (popin, event) {
    popin_y_shift = 25;

    popin.style.opacity = 1.0;
    popin.style.left = event.pageX + "px";
    popin.style.top = (event.pageY + popin_y_shift) + "px";

    current = popin;
    for (current = event.currentTarget.parentElement; current.parentElement != null; current = current.parentElement) {
	if (current.classList.contains(POPIN_CLASS)) {
	    if (typeof(current.popin_children) == "undefined") {
		current.popin_children = [];
	    }
	    current.popin_children.push (popin);
	}
    }
}

/**
 * Handler for the poplink elements being clicked.
 */
function toggle_popin (event) {
    popin = document.getElementById(this.getAttribute("for"));

    if (popin.style.opacity > 0) {
	hide_popin(popin);
    } else {
	show_popin(popin, event);
    }
}

/**
 * This initializes the whole system. It sets some CSS that does not
 * seem to work staticaally, enables the events, and alters the
 * elements as necessary.
 */
function make_draggables () {
    body = document.getElementsByTagName("body")[0];
    body.addEventListener ("dragenter", drag_enter);
    body.addEventListener ("dragover", drag_over);
    body.addEventListener ("drop", drag_drop); 
    draggables = document.getElementsByClassName(POPIN_CLASS);
    for (d in draggables) {
	if (isNaN(d)) {
	    continue;
	}
	draggables[d].innerHTML = "<button onclick='hide_popin(this.parentElement)'>X</button>" + draggables[d].innerHTML;
	draggables[d].style.backgroundColor = "#ccc";
	draggables[d].setAttribute("draggable", true);
	draggables[d].addEventListener ("dragstart", drag_start, false);
    }

    links = document.getElementsByClassName(POPIN_LINK_CLASS);
    for (l in links) {
	if (isNaN(l)) {
	    continue;
	}
	links[l].addEventListener ("click", toggle_popin);
    }
}

window.addEventListener ("load", make_draggables);
