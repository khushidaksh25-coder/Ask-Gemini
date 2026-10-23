
const generateBtn = document.getElementById("generate-btn");
const factElement = document.getElementById("fact");
const statusElement = document.getElementById("status");

async function generateFact() {
    generateBtn.disabled = true;
    factElement.textContent = "Your next fun fact is on its way...";
    statusElement.textContent = "Connecting to Gemini AI...";

    try {
        const response = await fetch("/fun-fact");

        if (!response.ok) {
            throw new Error("Failed to fetch a fun fact.");
        }

        const data = await response.json();

        if (!data.fact) {
            throw new Error("No fact was returned.");
        }

        factElement.textContent = data.fact;
        statusElement.textContent = "Here's something amazing! ✨";
    } catch (error) {
        console.error("Error:", error);

        factElement.textContent =
            "Oops! We couldn't get a fun fact right now.";

        statusElement.textContent =
            "Please check that your server is running and try again.";
    } finally {
        generateBtn.disabled = false;
    }
}

generateBtn.addEventListener("click", generateFact);
