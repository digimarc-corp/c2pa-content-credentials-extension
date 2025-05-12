export function displayProcessStatus(message, duration = 5000) {
  // Inject gradient animation keyframes into the document
  const style = document.createElement('style');
  style.textContent = `
    @keyframes gradientBorder {
      0% {
        border-bottom-color: black;
      }
      25% {
        border-bottom-color: #555;
      }
      50% {
        border-bottom-color: gray;
      }
      75% {
        border-bottom-color: #555;
      }
      100% {
        border-bottom-color: black;
      }
    }
  `;
  document.head.appendChild(style);

  // Create a div for the status indicator
  const statusDiv = document.createElement('div');
  statusDiv.innerText = `${message}`;

  // Add styles to make it appear at the bottom right corner
  Object.assign(statusDiv.style, {
    position: 'fixed', // Fixed position
    bottom: '10px', // 10px from the bottom
    right: '10px', // 10px from the right
    backgroundColor: 'white', // White background
    borderBottom: '7px solid black', // Default black border
    color: 'black',
    padding: '10px', // Padding around the text
    zIndex: '2147483647', // Ensure it's on top
    maxWidth: '500px', // Maximum width
    overflow: 'hidden', // Handle long error messages
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.25)',
    opacity: '0', // Start fully transparent
    transition: 'opacity 1s ease-in-out', // Smooth transition for opacity change
    fontFamily: 'Roboto, Arial, sans-serif', // Adding font family, fallback to sans-serif
  });

  // Append the statusDiv to body
  document.body.appendChild(statusDiv);

  // Trigger the fade-in effect
  setTimeout(() => {
    statusDiv.style.opacity = '1';

    // Apply gradient animation if the borderBottom is black
    if (statusDiv.style.borderBottom === '7px solid black') {
      statusDiv.style.borderBottom = '7px solid'; // Reset the solid color
      statusDiv.style.animation = 'gradientBorder 2s infinite';
    }
  }, 0); // Start the fade-in immediately

  // Function to update the statusDiv for completion
  const markAsComplete = (isError = false, completionMessage = 'Process Complete!') => {
    statusDiv.innerText = completionMessage;
    statusDiv.style.animation = ''; // Remove the gradient animation

    if (isError) {
      statusDiv.style.borderBottom = '7px solid red'; // Red border for errors
    } else {
      statusDiv.style.borderBottom = '7px solid #47CAD1'; // Green border for success
    }

    // Fade out and remove after the process completes
    setTimeout(() => {
      statusDiv.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(statusDiv)) {
          document.body.removeChild(statusDiv);
        }
      }, 1000); // Fade-out animation duration
    }, duration);
  };

  // Return a function to allow marking the process as complete
  return markAsComplete;
}