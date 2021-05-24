/**
* --------------------------------------------------------------------------
* Grayshift (v1.0.0): collapse.js
* Licensed under MIT (https://opensource.org/licenses/mit-license.php)
* --------------------------------------------------------------------------
*/

import { dataToggleString, dataParentString, showString } from './dom/selectors';
import getTarget from './util/index';

// Collapse
const Collapse = (() => {
  // Selectors
  const collapseString = 'collapse',
        collapsingString = 'collapsing',
        collapseClass = `.${collapseString}`,
        collapseToggleSelector = `[${dataToggleString}="${collapseString}"]`;

  // Variables
  const collapseTriggers = document.querySelectorAll(collapseToggleSelector);

  // Check if there are any triggers
  if(collapseTriggers.length > 0) {
    // Add a click event on each of them
    collapseTriggers.forEach(el => {
      el.addEventListener('click', e => {
        // Get the targeted content
        const content = document.querySelector(getTarget(el));

        // Check if there is content to collapse
        if(content) {
          // Get the content parent
          const contentParent = content.getAttribute(dataParentString),
                // Get the parent of the collapse
                collapseParent = content.closest(contentParent),
                // Check for the "show" class on the content
                collapsed = content.classList.contains(showString);

          const clearOpen = () => {
            // Get the collapse parent
            const collapseParent = document.querySelector(contentParent);

            // Loop through all collapsed and clear them
            collapseParent.querySelectorAll(collapseClass).forEach(el => {
              // Check if there are any triggers
              if(el.previousElementSibling) {
                // Get the collapse trigger
                const collapseTrigger = el.previousElementSibling.closest(collapseToggleSelector) || el.previousElementSibling.querySelector(collapseToggleSelector),
                // Get the content parent
                contentParent = el.getAttribute(dataParentString);

                // Check if the content should be hidden
                if(el !== content && contentParent === `#${collapseParent.id}`) {
                  // Hide content
                  hide(el, collapseTrigger);
                }
              }
            });
          };

          const show = content => {
            // Get the natural height of the content
            const getHeight = () => {
              // Make it visible
              content.style.display = 'block';
              // Get it's height
              const height = content.scrollHeight + 'px';
              // Hide it again
              content.style.display = '';

              return height;
            };

            // Remove the "collapse" class
            content.classList.remove(collapseString);
            // Add the "collapsing" class
            content.classList.add(collapsingString);
            // Update the inline height
            content.style.height = getHeight();

            // Set the "aria-expanded" attribute to "true"
            el.setAttribute('aria-expanded', true);

            // When the transition is complete, show it
            const complete = () => {
              // Remove the "collapsing" class
              content.classList.remove(collapsingString);
              // Add both the "collapse" and the "show" class
              content.classList.add(collapseString, showString);
              // Remove the inline height
              content.style.height = '';
              // Remove event listener after it runs
              content.removeEventListener('transitionend', complete);
            };

            content.addEventListener('transitionend', complete);
          };

          const hide = (content, trigger = el) => {
            // Give the element a height to change from
            content.style.height = content.scrollHeight + 'px';

            // Add the "collapsing" class
            content.classList.add(collapsingString);
            // Remove both the "collapse" and the "show" class
            content.classList.remove(collapseString, showString);
            // Force reflow to enable transition
            content.offsetHeight;
            // Remove the inline height
            content.style.height = '';

            // Set the "aria-expanded" attribute to false
            trigger.setAttribute('aria-expanded', false);

            // When the transition is complete, hide it
            const complete = () => {
              // Remove the "collapsing" class
              content.classList.remove(collapsingString);
              // Add the "collapse" class
              content.classList.add(collapseString);
              // Remove event listener after it runs
              content.removeEventListener('transitionend', complete);
            };

            content.addEventListener('transitionend', complete);
          };

          // Check if there are any parents
          if(collapseParent) {
            // Clear all collapsed
            clearOpen();
          }

          // Check if the content should collapse
          if(!collapsed) {
            // If the content is hidden, show it
            show(content);
          } else {
            // Otherwise, hide it
            hide(content);
          }
        }

        // Stop the default behaviour
        e.preventDefault();
      });
    });
  }
})();

export default Collapse;
