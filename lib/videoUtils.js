export function findNearestVideo(div) {
  // XPath to find a video element that is a descendant of the specified div
  let xpath = './/video';

  // Evaluate XPath from the context of the div element
  let result = document.evaluate(xpath, div, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

  if (result.singleNodeValue) {
    return result.singleNodeValue; // Video found within the div
  }
  // No video found within the div, search in ancestors or siblings
  xpath = 'following-sibling::video | preceding-sibling::video | ancestor::node()/following-sibling::node()//video | ancestor::node()/preceding-sibling::node()//video';
  result = document.evaluate(xpath, div, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  return result.singleNodeValue; // Nearest video in siblings or ancestor's siblings
}
