// background.js

// window.addEventListener('message', function (event) {
//     console.log(`[background] Window message received`);
//     console.log(event);
//     //    event.source.postMessage({ hello: 'from sandboxjs' }, event.origin)
// });

// // iframe is defined by background.html
// var iframe = document.getElementById('extension-iframe')

// // Send message to script living inside iframe
// sender.postMessage(message, '*');

// // Listen to messages sent by script living inside iframe
// window.addEventListener('message', function (event) {
//   console.log('backgroundjs')
//   // Reply to content.js
//   sendResponse(event.data)
// }, { once: true })

// chrome.runtime.onMessage.addListener(function (message, sender, senderResponse) {

//     console.log(`[background] onMessage invoked!`);
//     console.log(message);

//     // if (message.type === 'replace-images') {
//     //     console.log(`[background] onMessage event fired ${message.type} for image ${message.imageIndex}`);
//     //     let response = {
//     //         link: 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/pokemon-blue-version/8/89/Pikachu.jpg'
//     //     }
//     //     senderResponse({ data: response, index: message.imageIndex });
//     //     return true;
//     // }
// });

// Insert the CSS file when the user turns the extension on
// await chrome.scripting.insertCSS({
//     files: ["focus-mode.css"],
//     target: { tabId: tab.id },
// });

// const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
// const response = await chrome.tabs.sendMessage(tab.id, { type: "replace-images" });

// const response = await chrome.tabs.sendMessage(tab.id, {type: "c2pa-validation"});
// console.log(`c2pa-validation response: ${JSON.stringify(response)}`);

// const response = await chrome.tabs.sendMessage(tab.id, { type: "inject-c2pa-indicator" });
// console.log(`[background] inject-c2pa-indicator response: ${JSON.stringify(response)}`);

// let sandboxUrl = chrome.runtime.getURL("sandbox.html");
// let response = await chrome.tabs.sendMessage(tab.id, { type:"inject-sandboxed-iframe", url:sandboxUrl})
// console.log(`inject-sandboxed-iframe response: ${JSON.stringify(response)}`);

// response = await chrome.tabs.sendMessage(tab.id, {type: "add-c2pa-icon"});
// console.log(`add-c2pa-icon response: ${JSON.stringify(response)}`);

// chrome.tabs.create({
//     url: 'sandbox.html'
//   });

// content.js

// if (message.type === "c2pa-validation") {
//   console.log(`onMessage event fired!: ${message.type}`);
//   window.removeEventListener('scroll', delayedScroll);
//   deleteFrames();
//   enableImgs();
//   scroll();
//   window.addEventListener('scroll', delayedScroll);
//   senderResponse({ isConfirmed: true });
// }

// if (message.type === "inject-sandboxed-iframe") {
//   console.log(`onMessage event fired!: ${message.type}`);
//   // Inject the sandboxed iframe into the page.
//   const sandboxedIframe = document.createElement("iframe");
//   sandboxedIframe.src = message.url;
//   sandboxedIframe.sandbox = "allow-scripts";
//   sandboxedIframe.style.display = "none";

//   document.body.appendChild(sandboxedIframe);
// }

// if (message.type === "add-c2pa-icon") {
//   console.log(`[content] onMessage event fired!: ${message.type}`);

//   // Get all images on the page.
//   const images = document.querySelectorAll("img");

//   // Wrap each image in a div.
//   for (const image of images) {

//     const thumbnail = new Thumbnail();
//     thumbnail.src = image.src;
//     thumbnail.badge = "info";
//     thumbnail.badgeHelpText = "This image has attribution and history data.";

//     // //    htmlElement.innerHTML = `<cai-popover interactive style="position: absolute; top: 10px; right: 10px">
//     // //    <cai-indicator slot="trigger"></cai-indicator>
//     // //    <cai-manifest-summary slot="content"></cai-manifest-summary>
//     // //  </cai-popover>`;

//     image.parentNode.appendChild(thumbnail);
//   }

// }

// document.onreadystatechange = () => {
//   // // Need this or we scroll repeatedly
//   // let doscroll;
//   // function delayedScroll() {
//   //   clearTimeout(doscroll);
//   //   doscroll = setTimeout(scroll, 500);
//   // }

//   // chrome.runtime.onMessage.addListener((message, sender, senderResponse) => {

//   //   if (message.type === "replace-images") {
//   //     console.log(`onMessage event fired!: ${message.type}`);
//   //     replaceImages();
//   //     return true;
//   //   }

//   //   if (message.type === "inject-c2pa-indicator") {
//   //     // Get all image elements on the page.
//   //     const imageElements = document.querySelectorAll("img");

//   //     // Iterate over the image elements and wrap each image in a div element.
//   //     for (const imageElement of imageElements) {
//   //       // Create a new div element.
//   //       const divElement = document.createElement("div");

//   //       // Set the style attribute of the div element.
//   //       divElement.style.border = "1px solid black";
//   //       divElement.style.position = "relative";

//   //       const caiPopover = document.createElement("cai-popover");
//   //       caiPopover.interactive = true;
//   //       caiPopover.style.position = "absolute";
//   //       caiPopover.style.top = "10px";
//   //       caiPopover.style.right = "10px";

//   //       // <cai-indicator slot="trigger"></cai-indicator>
//   //       // <cai-manifest-summary slot="content"></cai-manifest-summary>
//   //       divElement.appendChild(caiPopover);

//   //       // Append the image element to the div element.
//   //       divElement.appendChild(imageElement);

//   //       // Replace the image element with the div element.
//   //       imageElement.parentNode.replaceChild(divElement, imageElement);
//   //     }
//   //   }

//   //   if (message.type === "c2pa-validation") {
//   //     console.log(`onMessage event fired!: ${message.type}`);
//   //     window.removeEventListener('scroll', delayedScroll);
//   //     deleteFrames();
//   //     enableImgs();
//   //     scroll();
//   //     window.addEventListener('scroll', delayedScroll);
//   //     senderResponse({ isConfirmed: true });
//   //   }

//   //   if (message.type === "inject-sandboxed-iframe") {
//   //     console.log(`onMessage event fired!: ${message.type}`);
//   //     // Inject the sandboxed iframe into the page.
//   //     const sandboxedIframe = document.createElement("iframe");
//   //     sandboxedIframe.src = message.url;
//   //     sandboxedIframe.sandbox = "allow-scripts";
//   //     sandboxedIframe.style.display = "none";

//   //     document.body.appendChild(sandboxedIframe);
//   //   }

//   //   if (message.type === "add-c2pa-icon") {
//   //     console.log(`[content] onMessage event fired!: ${message.type}`);

//   //     // Get all images on the page.
//   //     const images = document.querySelectorAll("img");

//   //     // Wrap each image in a div.
//   //     for (const image of images) {

//   //       const thumbnail = new Thumbnail();
//   //       thumbnail.src = image.src;
//   //       thumbnail.badge = "info";
//   //       thumbnail.badgeHelpText = "This image has attribution and history data.";

//   //       // //    htmlElement.innerHTML = `<cai-popover interactive style="position: absolute; top: 10px; right: 10px">
//   //       // //    <cai-indicator slot="trigger"></cai-indicator>
//   //       // //    <cai-manifest-summary slot="content"></cai-manifest-summary>
//   //       // //  </cai-popover>`;

//   //       image.parentNode.appendChild(thumbnail);
//   //     }

//   //   }

//   // });

//   // chrome.runtime.onMessage.addListener(
//   //   function (request, sender, sendResponse) {
//   //     console.log(sender.tab ?
//   //       "from a content script:" + sender.tab.url :
//   //       "from the extension");
//   //     if (request.message === "run-c2pa-validation") {
//   //       console.log('Remove frames and stop generating...');
//   //       // window.removeEventListener('scroll', delayedScroll);
//   //       deleteFrames();
//   //       enableImgs();
//   //       console.log('Generating psychedelic...');
//   //       scroll();
//   //       // window.addEventListener('scroll', delayedScroll);
//   //       sendResponse({ isConfirmed: true, trip: 'waves' });
//   //     }
//   //   }
//   // );
// }

// sandbox

// const canvas = document.getElementById('canvas');
// const ctx = canvas.getContext('2d');
// const c2paImage = document.getElementById("c2pa-image");

// window.addEventListener("c2pa-manifest",
// 	async function (e) {
// 	console.log(`[sandbox] Message in Sandbox`);
// 	console.log(`${e}`);

// 	if (e.data.type === "blob") {
// 		console.log(`[sandbox] Blob Received`);
// 		var c2paImage = new Image();
// 		c2paImage.src = e.data.blob;
// 		c2paImage.id = "c2pa-image";
// 		c2paImage.onload = function () {
// 			ctx.drawImage(c2paImage, 0, 0, canvas.width, canvas.height);
// 		};
// 		await validateC2pa();
// 	}

// 	// const blobImageData = new Blob([// blob image data], {type: "image/jpeg"});

// 	// // Create an objectURL from the blob image data.
// 	// const objectURL = URL.createObjectURL(blobImageData);

// 	// // Set the src attribute of the img element to the objectURL.
// 	// const img = document.querySelector("img");
// 	// img.src = objectURL;

// 	// // Once the image has loaded, you can remove the objectURL.
// 	// img.onload = function () {
// 	// 	URL.revokeObjectURL(objectURL);
// 	// };

// 	//var image = new Image();
// 	//image.src = e.data.blob;
// 	//image.src = "https://raw.githubusercontent.com/contentauth/c2pa-js/main/tools/testing/fixtures/images/CAICAI.jpg";
// 	//image.onload = function () {
// 	//		ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
// 	//	};

// 	// Get the active manifest
// 	// const activeManifest = manifestStore?.activeManifest;

// },
// false);
