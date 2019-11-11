menuItems = document.getElementsByClassName("menu-item");

console.log(menuItems)

for (const menuItem of Object.values(menuItems)) {
	var text = document.createTextNode("5 stars");
	menuItem.appendChild(text);
}