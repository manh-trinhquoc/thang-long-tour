/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function toggleClassResponsive(id) {
    let element = document.getElementById(id);
    element.classList.toggle("responsive");
    event.stopPropagation()
}