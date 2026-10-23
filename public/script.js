const form = document.getElementById("form");
const questionInput = document.getElementById("textarea");
const answerElement = document.getElementById("answerText");
const submitBtn = document.getElementById("submitBtn");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const question = questionInput.value.trim();

  if (question === "") {
    answerElement.textContent = "Please enter a question.";
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Thinking...";
  answerElement.textContent = "Getting your answer...";

  try {
    const response = await fetch("/api/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong.");
    }

    answerElement.innerHTML = DOMPurify.sanitize(
      marked.parse(data.answer || "No answer received."),
    );
  } catch (error) {
    console.error("Request error:", error);
    answerElement.textContent = `Error: ${error.message}. Please try again.`;
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Ask Gemini";
  }
});
