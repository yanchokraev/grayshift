/**
* --------------------------------------------------------------------------
* Grayshift (v1.0.2): dropdown.js
* Licensed under MIT (https://opensource.org/licenses/mit-license.php)
* --------------------------------------------------------------------------
*/

import {
  dataToggleString,
  showString
} from './dom/selectors';

// Dropdown
const Dropdown = (() => {
  // Selectors
  const dropdownToggleSelector = `[${dataToggleString}="dropdown"]`;

  // Variables
  const dropdownTriggers = document.querySelectorAll(dropdownToggleSelector);

  // Check if there are any dropdown triggers
  if(dropdownTriggers.length > 0) {
    // Clear all dropdowns
    const clearMenus = () => {
      // Loop through them
      dropdownTriggers.forEach(el => {
        // Check for the dropdown toggle selector
        const dropdownTrigger = el.matches(dropdownToggleSelector),
              // Get the dropdown menu
              dropdownMenu = el.nextElementSibling;

        // Check if there are any dropdowns
        if(dropdownTrigger && dropdownMenu) {
          // Remove the "show" class on the dropdown menu
          dropdownMenu.classList.remove(showString);
          // Remove the "show" class on the trigger
          el.classList.remove(showString);
          // Set the "aria-expanded" attribute to "false"
          el.setAttribute('aria-expanded', false);
        }
      });
    };

    // Add a click event on each dropdown trigger
    dropdownTriggers.forEach(el => {
      el.addEventListener('click', e => {
        // Check for the dropdown toggle selector
        const dropdownTrigger = el.matches(dropdownToggleSelector),
              // Get the dropdown menu
              dropdownMenu = el.nextElementSibling;

        // Check if there are any dropdowns
        if(dropdownTrigger && dropdownMenu) {
          // Check for the "show" class on the menu
          const dropdownOpen = dropdownMenu.classList.contains(showString);

          // Clear all open dropdowns
          clearMenus();

          // Check if the clicked dropdown should be opened
          if(!dropdownOpen) {
            // Open the clicked dropdown
            dropdownMenu.classList.add(showString);
            // Add the "show" class on toggle
            el.classList.add(showString);
            // Set the "aria-expanded" attribute to "true"
            el.setAttribute('aria-expanded', true);
          }

          // Stop the bubbling of the current event
          e.stopPropagation();
        }

        // Stop the default behaviour
        e.preventDefault();
      });
    });

    // Clear dropdowns when clicked outside of dropdown
    document.addEventListener('click', () => clearMenus());

    document.addEventListener('keyup', e => {
      // Clear dropdowns on escape keyup
      if(e.key === 'Escape') {
        clearMenus();
      }
    });
  }
})();

export default Dropdown;
