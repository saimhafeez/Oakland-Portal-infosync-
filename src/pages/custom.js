function disableRadios(clickedId) {
  // Enable all radio buttons
  var radios = document.querySelectorAll('input[type="radio"]');
  for (var i = 0; i < radios.length; i++) {
    radios[i].disabled = false;
  }

  // Disable the clicked radio button
  document.getElementById(clickedId).disabled = true;
}

export default disableRadios