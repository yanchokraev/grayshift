/*!
* Grayshift v1.0.2 (https://grayshift.io)
* Copyright 2019-2021 Grayshift
* Licensed under MIT (https://opensource.org/licenses/mit-license.php)
*/
(function (global, factory) {
      typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
      typeof define === 'function' && define.amd ? define(factory) :
      (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.grayshift = factory());
}(this, (function () { 'use strict';

      // Global selectors
      const dataToggleString = 'data-gs-toggle',
            dataTargetString = 'data-gs-target',
            dataParentString = 'data-gs-parent',
            dataDismissString = 'data-gs-dismiss',
            fadeString = 'fade',
            showString = 'show',
            activeString = 'active',
            activeClass = `.${activeString}`;

      /**
      * --------------------------------------------------------------------------
      * Grayshift (v1.0.2): alert.js
      * Licensed under MIT (https://opensource.org/licenses/mit-license.php)
      * --------------------------------------------------------------------------
      */

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

      // Get the target of the controller element
      const getTarget = el => {
        // Check for the "data-gs-target" attribute
        let target = el.getAttribute(dataTargetString);

        // If there isn't one
        if(!target) {
          // Check for the "href" attribute
          target = el.getAttribute('href');
        }

        // If there's a match, return the target
        return target;
      };

      /**
      * --------------------------------------------------------------------------
      * Grayshift (v1.0.2): collapse.js
      * Licensed under MIT (https://opensource.org/licenses/mit-license.php)
      * --------------------------------------------------------------------------
      */

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

      /**
      * --------------------------------------------------------------------------
      * Grayshift (v1.0.2): dropdown.js
      * Licensed under MIT (https://opensource.org/licenses/mit-license.php)
      * --------------------------------------------------------------------------
      */

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

      /**
      * --------------------------------------------------------------------------
      * Grayshift (v1.0.2): modal.js
      * Licensed under MIT (https://opensource.org/licenses/mit-license.php)
      * --------------------------------------------------------------------------
      */

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

                // Remove the keyboard focus from the trigger
                document.activeElement.blur();
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

      /**
      * --------------------------------------------------------------------------
      * Grayshift (v1.0.2): dropdown.js
      * Licensed under MIT (https://opensource.org/licenses/mit-license.php)
      * --------------------------------------------------------------------------
      */

      // Tab
      const Tab = (() => {
        // Selectors
        const navClass = '.nav',
              tabToggleSelector = `[${dataToggleString}="tab"]`;

        // Variables
        const navs = document.querySelectorAll(navClass);

        // Check if there are any navs
        if(navs.length > 0) {
          // Loop through them
          navs.forEach(nav => {
            // Get the nav tabs
            const tabs = nav.querySelectorAll(tabToggleSelector);

            // Add a click event on each of them
            tabs.forEach(tab => {
              tab.addEventListener('click', e => {
                // Get the targeted tab pane
                const tabPane = document.querySelector(getTarget(tab));

                // Check for the "nav" class on the nav
                if(nav.matches(navClass)) {
                  // Clear all tabs
                  const clearTabs = () => {
                    // Loop through them
                    tabs.forEach(el => {
                      // Check if the tab should be cleared
                      if(el !== tab) {
                        // Remove the "active" class
                        el.classList.remove(activeString);

                        // Check for the "role" attribute
                        if(el.getAttribute('role') === 'tab') {
                          // Set the "aria-selected" attribute to "false"
                          el.setAttribute('aria-selected', false);
                        }
                      }
                    });
                  };

                  // Clear all active tabs
                  clearTabs();

                  // Add the "active" class
                  tab.classList.add(activeString);

                  // Check for the "role" attribute
                  if(tab.getAttribute('role') === 'tab') {
                    // Set the "aria-selected" attribute to "true"
                    tab.setAttribute('aria-selected', true);
                  }

                  // Check if there are any tab panes
                  if(tabPane) {
                    // Check for the "show" class on the tab pane
                    const tabPaneOpen = tabPane.classList.contains(showString),
                          // Get the tab content
                          tabContent = tabPane.parentElement;

                    if(tab.matches(tabToggleSelector) && tabContent) {
                      // Get the tab panes
                      const tabPanes = Array.from(tabContent.children),
                            // Get the active tab pane
                            tabPaneActive = tabContent.querySelector(`:scope > ${activeClass}`);

                      // Hide all tab panes
                      const hideTabPanes = () => {
                        // Loop through them
                        tabPanes.forEach(el => {
                          // Check if the tab pane should be hidden
                          if(el !== tabPane) {
                            // Remove the "show" class
                            el.classList.remove(showString);

                            // Check if the tab pane should be animated
                            if(el.classList.contains(fadeString) && tabPaneActive) {
                              // When the transition is complete, hide it
                              const complete = () => {
                                // Remove the "active" class
                                el.classList.remove(activeString);
                                // Remove event listener after it runs
                                tabPaneActive.removeEventListener('transitionend', complete);
                              };

                              tabPaneActive.addEventListener('transitionend', complete);
                            } else {
                              // Remove the "active" class
                              el.classList.remove(activeString);
                            }
                          }
                        });
                      };

                      // Hide all open tab panes
                      hideTabPanes();

                      // Check if the tab pane should be opened
                      if(!tabPaneOpen) {
                        // Check if the tab pane should be animated
                        if(tabPane.classList.contains(fadeString) && tabPaneActive) {
                          // When the transition is complete, show it
                          const complete = () => {
                            // Add the "active" class
                            tabPane.classList.add(activeString);
                            // Force reflow to enable transition
                            tabPane.offsetHeight;
                            // Add the "show" class
                            tabPane.classList.add(showString);
                            // Remove event listener after it runs
                            tabPaneActive.removeEventListener('transitionend', complete);
                          };

                          tabPaneActive.addEventListener('transitionend', complete);
                        } else {
                          // Add both the "active" and the "show" class
                          tabPane.classList.add(activeString, showString);
                        }
                      }
                    }
                  }
                }

                // Stop the default behaviour
                e.preventDefault();
              });
            });
          });
        }
      })();

      /**
      * --------------------------------------------------------------------------
      * Grayshift (v1.0.2): index.umd.js
      * Licensed under MIT (https://opensource.org/licenses/mit-license.php)
      * --------------------------------------------------------------------------
      */

      var index_umd = {
        Alert,
        Collapse,
        Dropdown,
        Modal,
        Tab
      };

      return index_umd;

})));
//# sourceMappingURL=grayshift.js.map
