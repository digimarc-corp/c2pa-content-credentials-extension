import Logger from './logger.js';

// Object to manage timelines
const TimelineLogger = (() => {
  const timelines = new Map(); // A map to store multiple timelines

  /**
     * Starts a new timeline.
     * @param {string} timelineName - The name of the timeline.
     */
  const startTimeline = (timelineName) => {
    if (timelines.has(timelineName)) {
      // eslint-disable-next-line no-console
      console.warn(`Timeline "${timelineName}" already exists.`);
      return;
    }
    timelines.set(timelineName, {
      messages: [],
      startTime: new Date(),
      lastMessageTime: new Date(),
    });
  };

  /**
     * Adds a message to the specified timeline.
     * @param {string} timelineName - The name of the timeline.
     * @param {string} message - The message to log.
     * @param {...any} optionalParams - Optional additional parameters.
     */
  const addToTimeline = (timelineName, message, ...optionalParams) => {
    const timeline = timelines.get(timelineName);
    if (!timeline) {
      // eslint-disable-next-line no-console
      console.error(`Timeline "${timelineName}" does not exist.`);
      return;
    }
    const now = new Date();
    const timeSinceLastMessage = (now - timeline.lastMessageTime) / 1000;
    timeline.lastMessageTime = now;

    const formattedMessage = optionalParams.length
      ? `${message} - ${optionalParams.join(', ')}`
      : message;

    timeline.messages.push({
      message: formattedMessage,
      timeSinceLastMessage,
    });
  };

  /**
     * Closes the specified timeline and prints its messages and duration.
     * @param {string} timelineName - The name of the timeline.
     */
  const closeTimeline = (timelineName) => {
    const timeline = timelines.get(timelineName);
    if (!timeline) {
      Logger.debug(`Timeline "${timelineName}" does not exist.`);
      return;
    }

    const endTime = new Date();
    const durationInSeconds = Math.round((endTime - timeline.startTime) / 1000);

    Logger.debug(`Timeline "${timelineName}" closed.`);
    Logger.debug('Messages:');
    timeline.messages.forEach((entry, index) => {
      Logger.debug(
        `${index + 1}. ${entry.message} (Time since last message: ${entry.timeSinceLastMessage} seconds)`,
      );
    });
    Logger.debug(`Total Duration: ${durationInSeconds} seconds`);

    // Remove the timeline from the map
    timelines.delete(timelineName);
  };

  // Expose the public API
  return {
    startTimeline,
    addToTimeline,
    closeTimeline,
  };
})();

export default TimelineLogger;
