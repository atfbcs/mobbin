(function () {
    // Function to unblur all images and remove blur overlay classes
    function unblurImages() {
        console.log("Unblur process started...");

        const groups = document.querySelectorAll('div.group.peer');

        if (groups.length === 0) {
            console.warn("No target groups found!");
            return;
        }

        groups.forEach((group, index) => {
            if (group.getAttribute("data-sentry-component") === "NavBarSearchBar") {
                return;
            }

            const blurOverlay = group.querySelector('div.relative.overflow-hidden.bg-background-secondary');

            if (blurOverlay) {
                // Remove blur-related styles
                blurOverlay.removeAttribute('class');
                blurOverlay.style.position = 'absolute';
                blurOverlay.style.inset = '0px';
                blurOverlay.style.borderRadius = '12px';
            }

            const img = group.querySelector("img");

            if (img) {
                const urlParts = img.src.split("?");
                const baseImageUrl = urlParts[0];

                const newImageUrl = `${baseImageUrl}?f=webp&w=1920&q=85&fit=shrink-cover&extend-bottom=120&image=%2Fwatermark%2F1.0%2F0bbcce0b-e114-4b81-92d5-4b6adab90661&gravity=bottom&v=1.0`;

                img.src = newImageUrl;

                console.log(`Updated image ${index + 1} to high resolution.`);

                addDownloadButton(img, newImageUrl, group);
            } else {
                console.warn(`Image not found in group ${index + 1}, skipping...`);
            }
        });

        console.log("Unblur process completed.");
    }

    function removeAside() {
        const aside = document.querySelector("aside.sticky.z-10.my-32.overflow-x-clip");
        if (aside) {
            aside.remove();
            console.log("Removed aside element.");
        }
    }

    function continuousUnblur() {
        removeAside();
        unblurImages();
        setInterval(() => {
            removeAside();
            unblurImages();
        }, 1000);
    }

    function addDownloadButton(img, imageUrl, container) {
        if (container.querySelector(".download-button")) return;

        const button = document.createElement("button");
        button.className = "download-button";
        button.style.position = "absolute";
        button.style.top = "10px";
        button.style.right = "10px";
        button.style.padding = "6px";
        button.style.background = "#000";
        button.style.border = "none";
        button.style.borderRadius = "50%";
        button.style.cursor = "pointer";
        button.style.zIndex = "1000";
        button.style.opacity = "0.7";
        button.style.transition = "opacity 0.3s";
        button.style.width = "32px";
        button.style.height = "32px";
        button.style.display = "flex";
        button.style.alignItems = "center";
        button.style.justifyContent = "center";
        button.style.pointerEvents = "auto";

        button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20" fill="white"><path d="M256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM127 297c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l71 71L232 120c0-13.3 10.7-24 24-24s24 10.7 24 24v214.1l71-71c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9L273 409c-9.4 9.4-24.6 9.4-33.9 0L127 297z"/></svg>`;

        button.addEventListener("mouseover", () => button.style.opacity = "1");
        button.addEventListener("mouseout", () => button.style.opacity = "0.7");

        button.addEventListener("click", function () {
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

        container.appendChild(button);
    }

    // Auto-run immediately after page load
    window.addEventListener("load", function () {
        console.log("Page fully loaded, auto-starting unblur...");
        continuousUnblur();
    });
})();
