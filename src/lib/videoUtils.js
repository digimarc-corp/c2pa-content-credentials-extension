export function findNearestMedia(div) {
  // Function to create a result object for found media
  function createMediaResult(node) {
    if (!node) return null;
    return {
      element: node,
      type: node.tagName.toLowerCase(), // 'video', 'img', or 'audio'
    };
  }

  // Check within the given div and its children first
  let xpath = './/video | .//img | .//audio';
  let result = document.evaluate(xpath, div, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  if (result.singleNodeValue) {
    return createMediaResult(result.singleNodeValue);
  }

  // If not found in the div or its children, check the immediate parent and its children
  if (div.parentNode) {
    xpath = './video | ./img | ./audio | ./child::node()/video | ./child::node()/img | ./child::node()/audio';
    result = document
      .evaluate(xpath, div.parentNode, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    return createMediaResult(result.singleNodeValue);
  }

  // Return null if no media is found
  return null;
}
