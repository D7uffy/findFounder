document.addEventListener('DOMContentLoaded', function() {
  const checkboxes = document.querySelectorAll('.types_facet');

  checkboxes.forEach(function(checkbox) {
    checkbox.addEventListener('change', function(event) {
      event.preventDefault();
      const value = this.getAttribute('data-value');
      const oldValue = document.getElementById('types').value;

      if (this.checked) {
        document.getElementById('types').value = value;
      } else {
        document.getElementById('types').value = '';
      }

      // Submit the form after updating the value.
      document.getElementById('search_form').submit();
    });
  });
});
