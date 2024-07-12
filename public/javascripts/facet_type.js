const Checkboxes = document.getElementsByClassName('type_facet');
for (let i = 0; i < Checkboxes.length; i += 1) {
  Checkboxes[i].addEventListener(
    'change',
    function(event) {
      const checkbox = event.target;
      const value = checkbox.getAttribute('data-value');
      
      // Update hidden field with facet value or clear it based on checkbox state.
      const oldValue = document.getElementById('type').value;
      if (checkbox.checked) {
        document.getElementById('type').value = value;
      } else {
        document.getElementById('type').value = '';
      }
      
      // Submit the form after updating the value.
      document.getElementById('search_form').submit();
    },
    false
  );
}
