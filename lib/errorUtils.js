export function displayError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.innerText = `${message}`;

  // Add styles to make it appear at the bottom right corner
  Object.assign(errorDiv.style, {
    position: 'fixed', // Fixed position
    bottom: '10px', // 10px from the bottom
    right: '10px', // 10px from the right
    backgroundColor: 'white', // Red background or choose a less intense color
    borderBottom: '7px solid red',
    color: 'black',
    padding: '10px', // Padding around the text
    zIndex: '1000', // Ensure it's on top
    maxWidth: '500px', // Maximum width
    overflow: 'hidden', // Handle long error messages
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.25)',
    opacity: '0', // start fully transparent
    transition: 'opacity 1s ease-in-out', // smooth transition for opacity change
    fontFamily: 'Roboto, Arial, sans-serif', // Adding font family, fallback to sans-serif

  });

  // Append the errorDiv to body
  document.body.appendChild(errorDiv);

  // Trigger the fade-in effect
  setTimeout(() => {
    errorDiv.style.opacity = '1';
  }, 0); // start the fade in immediately

  // Set a timer to fade out the errorDiv after 9 seconds (to complete in 10 seconds)
  setTimeout(() => {
    errorDiv.style.opacity = '0';
    // Remove the errorDiv after the fade out transition is complete
    setTimeout(() => {
      if (document.body.contains(errorDiv)) {
        document.body.removeChild(errorDiv);
      }
    }, 1000); // wait for the transition to complete (1 second)
  }, 4000);
}
