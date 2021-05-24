import { dataTargetString } from '../dom/selectors';

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

export default getTarget;
