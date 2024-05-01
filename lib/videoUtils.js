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

export function findNearestMedia(div) {
  // XPath to find a video or image element that is a descendant of the specified div
  let xpath = './/video | .//img';

  // Evaluate XPath from the context of the div element
  let result = document.evaluate(xpath, div, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

  console.log(result, 'res')

  if (result.singleNodeValue) {
    // Media found within the div, determine its type
    return {
      element: result.singleNodeValue,
      type: result.singleNodeValue.tagName.toLowerCase() // 'video' or 'img'
    };
  }

  // No media found within the div, search in ancestors or siblings
  xpath = 'following-sibling::video | following-sibling::img | preceding-sibling::video | preceding-sibling::img | ancestor::node()/following-sibling::node()//video | ancestor::node()/following-sibling::node()//img | ancestor::node()/preceding-sibling::node()//video | ancestor::node()/preceding-sibling::node()//img';
  result = document.evaluate(xpath, div, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

  if (result.singleNodeValue) {
    return {
      element: result.singleNodeValue,
      type: result.singleNodeValue.tagName.toLowerCase() // 'video' or 'img'
    };
  }

  // No media found at all
  return null;
}

