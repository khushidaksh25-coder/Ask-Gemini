
const moodSelect = document.getElementById("mood");
const generateBtn = document.getElementById("generateBtn");
const result = document.getElementById("result");

generateBtn.addEventListener("click", async () => {
  const mood = moodSelect.value;

  generateBtn.disabled = true;
  generateBtn.textContent = "Generating your prompt...";
  result.textContent = "Please wait, Gemini is thinking ✨";

  try {
    const response = await fetch(
      "http://localhost:4000/journal-prompt",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ mood: mood })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong.");
    }

    result.textContent = data.prompt;

  } catch (error) {
    console.error("Error:", error.message);
    result.textContent =
      "Sorry, we couldn't generate your prompt. Please try again.";

  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = "Generate Journal Prompt";
  }
});
