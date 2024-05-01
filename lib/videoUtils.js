export function findNearestMedia(div) {
  // Function to create a result object for found media
  function createMediaResult(node) {
    if (!node) return null;
    return {
      element: node,
      type: node.tagName.toLowerCase(), // 'video' or 'img'
    };
  }

  // Check within the given div first
  let xpath = './/video | .//img';
  let result = document.evaluate(xpath, div, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  if (result.singleNodeValue) {
    return createMediaResult(result.singleNodeValue);
  }

  // If not found, check the following and preceding siblings, then ancestor siblings
  xpath = 'following-sibling::video | following-sibling::img | preceding-sibling::video | preceding-sibling::img | ancestor::video | ancestor::img';
  result = document.evaluate(xpath, div, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  if (result.singleNodeValue) {
    return createMediaResult(result.singleNodeValue);
  }

  // Broaden the search to include descendants of following
  // and preceding siblings of the ancestor nodes
  xpath = 'ancestor::node()/following-sibling::node()//video | ancestor::node()/following-sibling::node()//img'
        + '| ancestor::node()/preceding-sibling::node()//video | ancestor::node()/preceding-sibling::node()//img';
  result = document.evaluate(xpath, div, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

  return createMediaResult(result.singleNodeValue);
}
