document.addEventListener('DOMContentLoaded', () => {
    const questionTextElement = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const questionContainer = document.getElementById('question-container');
    const resultContainer = document.getElementById('result-container');
    const resultTitleElement = document.getElementById('result-title');
    const resultTextElement = document.getElementById('result-text');
    const resultLinksElement = document.getElementById('result-links');
    const restartButton = document.getElementById('restart-button');
    const resetResultButton = document.getElementById('reset-result-button');

    // Define the troubleshooting flow
    const flow = {
        'start': {
            question: "What type of job are you primarily looking for?",
            options: [
                { text: "Permanent jobs", next: "jobTypePermanent" },
                { text: "Contract/Temporary (less than 2 years)", next: "jobTypeContract" },
                { text: "Research opportunities outside the UK", next: "researchAbroad" },
                { text: "Common Problem: Securing interviews but no job offers", next: "interviewProblem" }
            ]
        },
        'jobTypePermanent': {
            question: "What is the advertised/expected salary?",
            options: [
                { text: "£38,700 or higher (or required threshold)", next: "salaryHigh" },
                { text: "Below £38,700 (usually the threshold)", next: "salaryLow" }
            ]
        },
        'jobTypeContract': {
            question: "What is the advertised/expected salary for the contract role?",
            options: [
                { text: "£38,700 or higher (or required threshold)", next: "salaryHigh" },
                { text: "Below £38,700 (usually the threshold)", next: "salaryLow" }
            ]
        },
        'salaryHigh': {
            question: "Is there an advertised/guaranteed salary increase to the relevant threshold within 4 years (if applicable)?",
            options: [
                { text: "Yes, there is.", next: "conclusionMeetsVisa" },
                { text: "No, or not applicable.", next: "conclusionLikelyMeetsVisa" } // Assuming this path is okay unless explicitly stated otherwise
            ]
        },
        'salaryLow': {
            question: "Is there an advertised/guaranteed salary increase to the required amount within 4 years?",
            options: [
                { text: "Yes, there is.", next: "conclusionMeetsVisa" },
                { text: "No, there isn't.", next: "conclusionDoesNotMeetVisa" }
            ]
        },
        'researchAbroad': {
            conclusion: {
                title: "Exploring International Research Opportunities",
                text: "For research opportunities outside the UK, visa requirements will depend on the specific country. It's crucial to research the immigration laws of the target country and any specific academic visa categories.",
                links: [
                    { text: "Contact your academic supervisor for guidance", url: "#" },
                    { text: "Research specific country visa regulations", url: "https://www.gov.uk/browse/visas-immigration/country-specific" } // Placeholder
                ]
            }
        },
        'interviewProblem': {
            conclusion: {
                title: "Common Problem: Securing Interviews but No Job Offers",
                text: "This suggests your CV/application is strong enough to get noticed, but there might be areas to improve in your interview technique, communication skills, or how you articulate your value. Consider practicing mock interviews and refining your answers.",
                links: [
                    { text: "Book a mock interview session", url: "https://mycareer.soton.ac.uk/leap/events.html" }, // Placeholder
                    { text: "Review interview tips on MyCareer", url: "https://mycareer.soton.ac.uk/leap/interview-tips.html" } // Placeholder
                ]
            }
        },
        'conclusionMeetsVisa': {
            conclusion: {
                title: "Great News! Your Situation Likely Meets Visa Sponsorship Criteria",
                text: "Based on your answers, your job offer or potential role appears to meet the salary and sponsorship criteria for your student visa route (e.g., Skilled Worker visa after graduation). Always double-check with official sources.",
                links: [
                    { text: "Consult the Visa Team Service", url: "https://www.southampton.ac.uk/uni-life/support-wellbeing/international-students/immigration/contact-the-visa-team.page" }, // Placeholder
                    { text: "Check UKCISA guidance on working after studies", url: "https://www.ukcisa.org.uk/information--advice/working/working-after-your-studies" }
                ]
            }
        },
        'conclusionLikelyMeetsVisa': {
            conclusion: {
                title: "Your Situation Likely Meets Visa Sponsorship Criteria",
                text: "While an explicit increase wasn't stated, your initial salary may be sufficient. Always double-check with official sources and clarify any terms with your employer.",
                links: [
                    { text: "Consult the Visa Team Service", url: "https://www.southampton.ac.uk/uni-life/support-wellbeing/international-students/immigration/contact-the-visa-team.page" }, // Placeholder
                    { text: "Check UKCISA guidance on working after studies", url: "https://www.ukcisa.org.uk/information--advice/working/working-after-your-studies" }
                ]
            }
        },
        'conclusionDoesNotMeetVisa': {
            conclusion: {
                title: "[Conclusion] Does Not Meet Salary Threshold for Visa Sponsorship",
                text: "Based on your current answers, the advertised salary or lack of guaranteed increase within the specified timeframe suggests this role might not meet the salary threshold for visa sponsorship (e.g., Skilled Worker visa). This could be why a visa application might be refused or rejected. You may need to seek roles that meet the minimum salary requirements, or explore other visa options if applicable.",
                links: [
                    { text: "Contact the University Visa Team for tailored advice", url: "https://www.southampton.ac.uk/uni-life/support-wellbeing/international-students/immigration/contact-the-visa-team.page" },
                    { text: "Explore other job search strategies", url: "https://mycareer.soton.ac.uk/leap/jobs.html" } // Placeholder
                ]
            }
        }
    };

    let currentStep = 'start';

    function displayQuestion(stepKey) {
        currentStep = stepKey;
        const currentFlow = flow[stepKey];

        // Hide result, show question
        resultContainer.style.display = 'none';
        questionContainer.style.display = 'block';
        restartButton.style.display = 'none'; // Hide restart until a path is chosen

        questionTextElement.textContent = currentFlow.question;
        optionsContainer.innerHTML = ''; // Clear previous options

        currentFlow.options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'option-button';
            button.textContent = option.text;
            button.dataset.next = option.next; // Store the next step key
            optionsContainer.appendChild(button);

            button.addEventListener('click', () => {
                // Remove 'selected' class from all options
                document.querySelectorAll('.option-button').forEach(btn => {
                    btn.classList.remove('selected');
                });
                // Add 'selected' class to the clicked option
                button.classList.add('selected');

                // Introduce a small delay for visual feedback before proceeding
                setTimeout(() => {
                    const nextStepKey = button.dataset.next;
                    if (flow[nextStepKey] && flow[nextStepKey].conclusion) {
                        displayResult(nextStepKey);
                    } else if (flow[nextStepKey]) {
                        displayQuestion(nextStepKey);
                    } else {
                        // Handle unexpected state or error
                        console.error('Undefined next step:', nextStepKey);
                        displayResult('unknownError'); // Fallback conclusion
                    }
                }, 300); // 300ms delay
            });
        });
    }

    function displayResult(resultKey) {
        const result = flow[resultKey].conclusion;

        // Hide question, show result
        questionContainer.style.display = 'none';
        resultContainer.style.display = 'block';

        resultTitleElement.textContent = result.title;
        resultTextElement.innerHTML = result.text; // Use innerHTML for potential bolding or breaks
        resultLinksElement.innerHTML = ''; // Clear previous links

        if (result.links && result.links.length > 0) {
            result.links.forEach(linkData => {
                const link = document.createElement('a');
                link.href = linkData.url;
                link.textContent = linkData.text;
                link.target = "_blank"; // Open in new tab
                resultLinksElement.appendChild(link);
            });
        }
        restartButton.style.display = 'inline-block'; // Show restart button
    }

    function resetToStart() {
        displayQuestion('start');
    }

    restartButton.addEventListener('click', resetToStart);
    resetResultButton.addEventListener('click', resetToStart);

    // Initial display
    displayQuestion('start');
});