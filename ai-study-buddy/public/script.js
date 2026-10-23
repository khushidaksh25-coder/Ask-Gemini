
const topicInput = document.getElementById("topic");
const studyBtn = document.getElementById("studyBtn");
const actionButtons = document.querySelectorAll(".action-btn");
const resultSection = document.getElementById("resultSection");
const resultTitle = document.getElementById("resultTitle");
const result = document.getElementById("result");
const status = document.getElementById("status");
const copyBtn = document.getElementById("copyBtn");

let selectedTask = "explain";

const taskTitles = {
    explain: "Topic Explanation",
    quiz: "Practice Quiz",
    notes: "Quick Revision Notes"
};

actionButtons.forEach((button) => {
    button.addEventListener("click", () => {
        selectedTask = button.dataset.task;

        actionButtons.forEach((item) => {
            item.classList.toggle("active", item === button);
        });
    });
});

studyBtn.addEventListener("click", async () => {
    const topic = topicInput.value.trim();

    if (!topic) {
        status.textContent = "Please enter a topic first.";
        result.textContent = "";
        resultSection.classList.remove("hidden");
        topicInput.focus();
        return;
    }

    studyBtn.disabled = true;
    studyBtn.textContent = "Generating your study guide...";
    resultSection.classList.remove("hidden");
    resultTitle.textContent = taskTitles[selectedTask];
    status.textContent = "AI is preparing your answer. Please wait...";
    result.textContent = "";

    try {
        const response = await fetch("/api/study", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                topic: topic,
                task: selectedTask
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Something went wrong.");
        }

        result.textContent = data.result;
        status.textContent = "Your study guide is ready!";
    } catch (error) {
        status.textContent = "Could not generate the answer.";
        result.textContent = error.message;
    } finally {
        studyBtn.disabled = false;
        studyBtn.innerHTML = '✦ Start Learning <span>→</span>';
    }
});

copyBtn.addEventListener("click", async () => {
    const answer = result.textContent.trim();

    if (!answer) {
        status.textContent = "There is no result to copy yet.";
        return;
    }

    try {
        await navigator.clipboard.writeText(answer);
        status.textContent = "Result copied successfully!";
    } catch {
        status.textContent = "Copy failed. Please select and copy the text manually.";
    }
});
