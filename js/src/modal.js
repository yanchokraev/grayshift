/**
* --------------------------------------------------------------------------
* Grayshift (v1.0.0): modal.js
* Licensed under MIT (https://opensource.org/licenses/mit-license.php)
* --------------------------------------------------------------------------
*/

import { dataToggleString, dataDismissString, fadeString, showString } from './dom/selectors';
import getTarget from './util/index';

// Modal
const Modal = (() => {
  // Selectors
  const modalString = 'modal',
        modalBackdropString = 'modal-backdrop',
        modalBackdropClass = `.${modalBackdropString}`,
        modalToggleSelector = `[${dataToggleString}="${modalString}"]`,
        modalDismissSelector = `[${dataDismissString}="${modalString}"]`;

  // Variables
  const modalTriggers = document.querySelectorAll(modalToggleSelector);

  // Check if there are any triggers
  if(modalTriggers.length > 0) {
    // Add a click event on each of them
    modalTriggers.forEach(el => {
      el.addEventListener('click', e => {
        // Get the targeted modal
        const modal = document.querySelector(getTarget(el));

        // Check if the modal should be opened
        if(modal) {
          // Check for the "fade" class on the modal
          const modalHasAnimation = modal.classList.contains(fadeString);

          // Add "overflow: hidden" on the body
          document.body.style.overflow = 'hidden';
          // Create a new div element
          const modalBackdrop = document.createElement('div');
          // Add the "modal-backdrop" class to it
          modalBackdrop.className = modalBackdropString;
          // Append it to the body
          document.body.appendChild(modalBackdrop);
          // Show modal
          modal.style.display = 'block';
          // Remove the "aria-hidden" attribute
          modal.removeAttribute('aria-hidden');
          // Set the "aria-modal" attribute to "true"
          modal.setAttribute('aria-modal', true);
          // Set the "role" attribute to "dialog"
          modal.setAttribute('role', 'dialog');

          // Check if the modal should be animated
          if(modalHasAnimation) {
            // Add the "fade" class on the modal backdrop
            modalBackdrop.classList.add(fadeString);
            // Force reflow to enable transition
            modalBackdrop.offsetHeight;
          }

          // Add the "show" class on the modal backdrop
          modalBackdrop.classList.add(showString);

          const complete = () => {
            // Add the "show" class on the modal
            modal.classList.add(showString);
            // Remove event listener after it runs
            modalBackdrop.removeEventListener('transitionend', complete);
          };

          modalBackdrop.addEventListener('transitionend', complete);
        }

        // Stop the default behaviour
        e.preventDefault();
      });
    });

    const hideModal = () => {
      modalTriggers.forEach(el => {
        // Get the targeted modal
        const modal = document.querySelector(getTarget(el)),
              // Get the modal backdrop
              modalBackdrop = document.querySelector(modalBackdropClass);

        // Check if the modal should be hidden
        if(modal) {
          // Check for the "fade" class on the modal
          const modalHasAnimation = modal.classList.contains(fadeString);

          // Remove the "show" class on the modal
          modal.classList.remove(showString);
          // Set the "aria-hidden" attribute to "true"
          modal.setAttribute('aria-hidden', true);
          // Remove the "aria-modal" attribute
          modal.removeAttribute('aria-modal');
          // Remove the "role" attribute
          modal.removeAttribute('role');
          // Remove "overflow: hidden" from the body
          document.body.style.overflow = '';

          // Check if the modal should be animated
          if(modalHasAnimation) {
            const modalComplete = () => {
              // Remove the "show" class from the modal backdrop
              modalBackdrop.classList.remove(showString);
              // Remove event listener after it runs
              modal.removeEventListener('transitionend', modalComplete);
            };

            modal.addEventListener('transitionend', modalComplete);

            const modalBackdropComplete = () => {
              // Hide modal
              modal.style.display = 'none';
              // Remove the modal backdrop
              modalBackdrop.remove();
              // Remove event listener after it runs
              modalBackdrop.removeEventListener('transitionend', modalBackdropComplete);
            };

            modalBackdrop.addEventListener('transitionend', modalBackdropComplete);
          } else {
            // Hide modal
            modal.style.display = 'none';
            // Remove the modal backdrop
            modalBackdrop.remove();
          }
        }
      });
    };

    document.addEventListener('click', e => {
      modalTriggers.forEach(el => {
        // Get the targeted modal
        const modal = document.querySelector(getTarget(el));

        // Hide modal when clicked outside of the modal
        if(e.target === modal) {
          hideModal();
        }
      });

      // Hide modal when clicked on the close button
      if(e.target.closest(modalDismissSelector)) {
        hideModal();
      }
    });

    document.addEventListener('keyup', e => {
      // Hide modal on escape keyup
      if(e.key === 'Escape') {
        hideModal();
      }
    });
  }
})();

export default Modal;
