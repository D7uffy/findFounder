document.addEventListener('DOMContentLoaded', function() {
  /**
   * Adds behaviors to toggle facets.
   */
  const checkboxes = document.querySelectorAll('.amount_facet');

  checkboxes.forEach(function(checkbox) {
    checkbox.addEventListener('change', function(event) {
      const value = this.getAttribute('data-value');
      const oldValue = document.getElementById('amount').value;

      if (this.checked) {
        document.getElementById('amount').value = value;
      } else {
        document.getElementById('amount').value = '';
      }

      // Finally, submit the form.
      document.getElementById('search_form').submit();
    });
  });
});
