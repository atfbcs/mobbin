(function () {
    const STORAGE_KEY = "unblurActivated";

    // Function to unblur all images and update their sources
    function unblurImages() {
        console.log("Unblur process started...");

        // Select all instances of the target container
        const targetGroups = document.querySelectorAll(".group.relative");

        if (targetGroups.length === 0) {
            console.warn("No target groups found!");
            return;
        }

        targetGroups.forEach((targetGroup, index) => {
        	// Skip the NavBarSearchBar instance
            if (targetGroup.getAttribute("data-sentry-component") === "NavBarSearchBar") {
                return;
            }
            
            // Find the blurred wrapper div
            const blurredDiv = targetGroup.querySelector(
                ".relative.overflow-hidden.bg-bg-secondary"
            );

            if (blurredDiv) {
                // Create a clone of the div with modified classes
                const newDiv = document.createElement("div");
                newDiv.className =
                    "relative overflow-hidden bg-bg-secondary after:absolute after:inset-0 after:rounded-[--border-radius] after:shadow-image-inset blur-0 after:backdrop-blur-[0px] group-focus-visible:ring-4 group-focus-visible:ring-blue-200/50 outline-0 outline-transparent outline outline-offset-2 transition-[outline] ease-out";
                newDiv.style.position = "absolute";
                newDiv.style.inset = "0px";
                newDiv.style.borderRadius = "12px";

                // Move all children of the old div into the new one
                while (blurredDiv.firstChild) {
                    newDiv.appendChild(blurredDiv.firstChild);
                }

                // Replace the old div with the new one
                blurredDiv.replaceWith(newDiv);
            }

            // Find the image inside the group
            const img = targetGroup.querySelector("img");

            if (img) {
                // Extract base image URL before query parameters
                const urlParts = img.src.split("?");
                const baseImageUrl = urlParts[0];

                // Set the new high-resolution image URL
                img.src = `${baseImageUrl}?f=webp&w=1920&q=85&fit=shrink-cover&extend-bottom=120&image=%2Fwatermark%2F1.0%2F0bbcce0b-e114-4b81-92d5-4b6adab90661&gravity=bottom&v=1.0`;

                console.log(`Updated image ${index + 1} to high resolution.`);

                // Add download button
                addDownloadButton(img, baseImageUrl, targetGroup);
            } else {
                console.warn(`Image not found in group ${index + 1}, skipping...`);
            }
        });

        console.log("Unblur process completed for all instances.");
    }

    // Function to remove the aside element
    function removeAside() {
        const asideElement = document.querySelector(
            "aside.sticky.z-10.my-32.overflow-x-clip"
        );
        if (asideElement) {
            asideElement.remove();
            console.log("Removed aside element.");
        }
    }

    // Function to continuously check for new content
    function continuousUnblur() {
        removeAside(); // Ensure the aside is removed first
        unblurImages(); // Unblur images immediately

        // Start checking for new content every second
        setInterval(() => {
            unblurImages();
            removeAside();
        }, 1000);
    }

    // Function to create the floating "Activate Auto Unblur" button
    function createUnblurButton() {
        if (document.querySelector("#unblur-button")) return;

        const button = document.createElement("button");
		button.id = "unblur-button";
		button.style.position = "fixed";
		button.style.bottom = "20px";
		button.style.left = "20px";
		button.style.padding = "10px";
		button.style.background = "#ff3b30"; // Red button
		button.style.color = "#fff";
		button.style.border = "none";
		button.style.borderRadius = "50%";
		button.style.cursor = "pointer";
		button.style.zIndex = "9999";
		button.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
		button.style.transition = "opacity 0.3s ease-in-out";
		button.style.width = "40px";
		button.style.height = "40px";
		button.style.display = "flex";
		button.style.alignItems = "center";
		button.style.justifyContent = "center";
		
		button.innerHTML = `
		    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="26" height="26" fill="white">
		        <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"/>
		    </svg>
		`;

        // Add hover effect
        button.addEventListener("mouseover", () => {
            button.style.opacity = "0.8";
        });
        button.addEventListener("mouseout", () => {
            button.style.opacity = "1";
        });

        // Add click event to activate persistent unblur
        button.addEventListener("click", function () {
            console.log("Auto-unblur activated!");
            localStorage.setItem(STORAGE_KEY, "true");
            button.innerHTML = `
			    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#ffffff" d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/>
			    </svg>
			`;
			button.style.background = "#2f9c4c"; // Green background to indicate activation
			button.style.display = "flex";
			button.style.alignItems = "center";
			button.style.justifyContent = "center";
            button.disabled = true;
            continuousUnblur();
        });

        document.body.appendChild(button);

        if (localStorage.getItem(STORAGE_KEY) === "true") {
            console.log("Auto-unblur was previously activated, resuming...");
            button.innerHTML = `
			    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#ffffff" d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/>
			    </svg>
			`;
			button.style.background = "#2f9c4c"; // Green background to indicate activation
			button.style.display = "flex";
			button.style.alignItems = "center";
			button.style.justifyContent = "center";
            button.disabled = true;
            continuousUnblur();
        }
    }

    // Function to add a "Download" button to the top-right of an image's parent div
    function addDownloadButton(img, imageUrl, targetGroup) {
        if (targetGroup.querySelector(".download-button")) return;

        const downloadButton = document.createElement("button");
		downloadButton.className = "download-button";
		downloadButton.style.position = "absolute";
		downloadButton.style.top = "10px";
		downloadButton.style.right = "10px";
		downloadButton.style.padding = "6px";
		downloadButton.style.background = "#000";
		downloadButton.style.border = "none";
		downloadButton.style.borderRadius = "50%";
		downloadButton.style.cursor = "pointer";
		downloadButton.style.zIndex = "1000";
		downloadButton.style.opacity = "0.7";
		downloadButton.style.transition = "opacity 0.3s";
		downloadButton.style.width = "32px";
		downloadButton.style.height = "32px";
		downloadButton.style.display = "flex";
		downloadButton.style.alignItems = "center";
		downloadButton.style.justifyContent = "center";
		
		downloadButton.innerHTML = `
		    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20" fill="white">
		        <path d="M256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM127 297c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l71 71L232 120c0-13.3 10.7-24 24-24s24 10.7 24 24l0 214.1 71-71c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9L273 409c-9.4 9.4-24.6 9.4-33.9 0L127 297z"/>
		    </svg>
		`;

        downloadButton.addEventListener("mouseover", () => {
            downloadButton.style.opacity = "1";
        });
        downloadButton.addEventListener("mouseout", () => {
            downloadButton.style.opacity = "0.7";
        });

        // **Download the image directly instead of opening in a new tab**
        downloadButton.addEventListener("click", function () {
            fetch(imageUrl)
                .then(response => response.blob())
                .then(blob => {
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = imageUrl.split("/").pop().split("?")[0] || "image.webp";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(link.href);
                })
                .catch(error => console.error("Download failed:", error));
        });

        targetGroup.appendChild(downloadButton);
    }

    // Wait for the entire page to load
    window.addEventListener("load", function () {
        console.log("Page fully loaded, adding unblur button...");
        createUnblurButton();
    });
})();
