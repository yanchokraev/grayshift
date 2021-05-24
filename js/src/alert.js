/**
* --------------------------------------------------------------------------
* Grayshift (v1.0.0): alert.js
* Licensed under MIT (https://opensource.org/licenses/mit-license.php)
* --------------------------------------------------------------------------
*/

import { dataDismissString, fadeString, showString } from './dom/selectors';

// Alert
const Alert = (() => {
  // Selectors
  const alertString = 'alert',
        alertClass = `.${alertString}`,
        alertDismissSelector = `[${dataDismissString}="${alertString}"]`;

  // Variables
  const alertDismiss = document.querySelectorAll(alertDismissSelector);

  // Check if there are any triggers
  if(alertDismiss.length > 0) {
    // Add a click event on each of them
    alertDismiss.forEach(el => {
      el.addEventListener('click', e => {
        // Get the "alert" class
        const alert = el.closest(alertClass),
              // Check for the alert dismiss selector
              alertDismiss = el.matches(alertDismissSelector);

        // Check if the alert should be cleared
        if(alert && alertDismiss) {
          // Check for both the "fade" and the "show" class on the alert
          const alertHasAnimation = alert.classList.contains(fadeString, showString);

          // Check if the alert dismiss should be animated
          if(alertHasAnimation) {
            // Remove the "show" class from the alert
            alert.classList.remove(showString);

            const complete = () => {
              // Remove the "fade" class from the alert
              alert.classList.remove(fadeString);
              // Remove the alert
              alert.remove();
              // Remove event listener after it runs
              alert.removeEventListener('transitionend', complete);
            };

            alert.addEventListener('transitionend', complete);
          } else {
            // Remove the alert
            alert.remove();
          }
        }

        // Stop the default behaviour
        e.preventDefault();
      });
    });
  }
})();

export default Alert;
