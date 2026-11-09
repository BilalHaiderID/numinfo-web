
// GitHub Pages cannot execute api/index.js. Set this to the deployed
// serverless API origin when the frontend is hosted on GitHub Pages.
const API_ORIGIN = "";
const API_URL = API_ORIGIN + "/api/?number=";

const input = document.getElementById("numberInput");
const searchBtn = document.getElementById("searchBtn");
const statusBox = document.getElementById("status");
const resultsSection = document.getElementById("resultsSection");
const resultsContainer = document.getElementById("results");
const resultCount = document.getElementById("resultCount");
const rawSection = document.getElementById("rawSection");
const rawOutput = document.getElementById("rawOutput");
const copyBtn = document.getElementById("copyBtn");

function normalizeNumber(value) {
    let number = String(value).replace(/\D/g, "");

    if (number.startsWith("0092")) {
        number = "0" + number.slice(4);
    } else if (number.startsWith("92") && number.length === 12) {
        number = "0" + number.slice(2);
    }

    return number;
}

function getOperator(number) {
    const prefix = number.slice(0, 4);

    const operators = {
        "0300": "Jazz",
        "0301": "Jazz",
        "0302": "Jazz",
        "0303": "Jazz",
        "0304": "Jazz",
        "0305": "Jazz",
        "0306": "Jazz",
        "0307": "Jazz",
        "0308": "Jazz",
        "0309": "Jazz",

        "0310": "Zong",
        "0311": "Zong",
        "0312": "Zong",
        "0313": "Zong",
        "0314": "Zong",
        "0315": "Zong",
        "0316": "Zong",
        "0317": "Zong",
        "0318": "Zong",
        "0319": "Zong",

        "0320": "Warid / Jazz",
        "0321": "Warid / Jazz",
        "0322": "Warid / Jazz",
        "0323": "Warid / Jazz",
        "0324": "Warid / Jazz",
        "0325": "Warid / Jazz",

        "0330": "Ufone",
        "0331": "Ufone",
        "0332": "Ufone",
        "0333": "Ufone",
        "0334": "Ufone",
        "0335": "Ufone",
        "0336": "Ufone",
        "0337": "Ufone",
        "0338": "Ufone",
        "0339": "Ufone",

        "0340": "Telenor",
        "0341": "Telenor",
        "0342": "Telenor",
        "0343": "Telenor",
        "0344": "Telenor",
        "0345": "Telenor",
        "0346": "Telenor",
        "0347": "Telenor",
        "0348": "Telenor",
        "0349": "Telenor",

        "0355": "SCOM"
    };

    return operators[prefix] || "Unknown";
}

function expandRange(value) {
    const match = value.trim().match(/^(\d{10,12})-(\d{1,4})$/);

    if (!match) {
        return [normalizeNumber(value)];
    }

    const base = normalizeNumber(match[1]);
    const suffix = match[2];

    const start = Number(base);
    const end = Number(
        base.slice(0, base.length - suffix.length) + suffix
    );

    if (!Number.isSafeInteger(start) ||
        !Number.isSafeInteger(end) ||
        end < start ||
        end - start > 100) {
        throw new Error("Invalid range. Maximum range size is 100.");
    }

    const numbers = [];

    for (let n = start; n <= end; n++) {
        numbers.push(String(n).padStart(base.length, "0"));
    }

    return numbers;
}

function setStatus(message, type = "") {
    statusBox.textContent = message;
    statusBox.className = "status " + type;
}

function getField(record, ...keys) {
    for (const key of keys) {
        if (record && record[key] !== undefined && record[key] !== null) {
            return String(record[key]);
        }
    }

    return "Not available";
}

function createField(label, value) {
    const wrapper = document.createElement("div");
    wrapper.className = "field";

    const title = document.createElement("span");
    title.className = "field-label";
    title.textContent = label;

    const content = document.createElement("div");
    content.className = "field-value";
    content.textContent = value;

    wrapper.append(title, content);
    return wrapper;
}

function createResultCard(record) {
    const card = document.createElement("article");
    card.className = "result-card";

    const top = document.createElement("div");
    top.className = "result-top";

    const headingGroup = document.createElement("div");
    headingGroup.className = "heading-group";

    const heading = document.createElement("h3");
    heading.textContent = getField(record, "Name", "name", "nam");

    const mobile = getField(record, "Mobile", "mobile", "number", "nbr");
    const normalizedMobile = normalizeNumber(mobile);
    const numberLabel = document.createElement("span");
    numberLabel.className = "number-label";
    numberLabel.textContent = normalizedMobile || mobile;
    headingGroup.append(heading, numberLabel);

    const operator = document.createElement("span");
    operator.className = "operator";

    operator.textContent =
        getField(record, "Operator", "operator") !== "Not available"
            ? getField(record, "Operator", "operator")
            : getOperator(normalizedMobile);

    top.append(headingGroup, operator);

    card.append(
        top,
        createField("Mobile Number", mobile),
        createField("Operator", operator.textContent),
        createField("Gender", getField(record, "Gender", "gender"))
    );

    return card;
}

async function searchNumber(number) {
    const url = API_URL + encodeURIComponent(number);

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    });

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error(
                "The API is not deployed for this website. Deploy the /api function on Vercel and set API_ORIGIN in script.js."
            );
        }

        throw new Error("API returned HTTP " + response.status);
    }

    const data = await response.json();
    return data;
}

function extractRecords(data) {
    if (Array.isArray(data)) {
        return data;
    }

    if (data && Array.isArray(data.data)) {
        return data.data;
    }

    if (data && Array.isArray(data.results)) {
        return data.results;
    }

    if (data && typeof data === "object") {
        return [data];
    }

    return [];
}

async function performSearch() {
    const query = input.value.trim();

    if (!query) {
        setStatus("Please enter a mobile number.", "error");
        return;
    }

    let numbers;

    try {
        numbers = expandRange(query);
    } catch (error) {
        setStatus(error.message, "error");
        return;
    }

    if (numbers.some(number => !/^03\d{9}$/.test(number))) {
        setStatus("Enter a valid Pakistani mobile number.", "error");
        return;
    }

    searchBtn.disabled = true;
    searchBtn.textContent = "Searching...";

    resultsContainer.replaceChildren();
    resultsSection.hidden = true;
    rawSection.hidden = true;

    const allResponses = [];
    const allRecords = [];

    try {
        for (const number of numbers) {
            setStatus("Searching " + number + "...");

            const response = await searchNumber(number);
            allResponses.push({
                query: number,
                response
            });

            const records = extractRecords(response);

            for (const record of records) {
                allRecords.push(record);
            }
        }

        const uniqueRecords = [];
        const seen = new Set();

        for (const record of allRecords) {
            const mobile = getField(record, "Mobile", "mobile", "number", "nbr");
            const key = mobile === "Not available"
                ? JSON.stringify(record)
                : mobile;

            if (!seen.has(key)) {
                seen.add(key);
                uniqueRecords.push(record);
            }
        }

        for (const record of uniqueRecords) {
            resultsContainer.appendChild(createResultCard(record));
        }

        resultsSection.hidden = false;
        resultCount.textContent =
            uniqueRecords.length + " result(s)";

        rawOutput.textContent =
            JSON.stringify(allResponses, null, 2);

        rawSection.hidden = false;

        setStatus(
            "Search completed. " + uniqueRecords.length + " record(s) returned.",
            "success"
        );

    } catch (error) {
        setStatus(
            "Request failed: " + error.message,
            "error"
        );
    } finally {
        searchBtn.disabled = false;
        searchBtn.innerHTML = 'Search <span>→</span>';
    }
}

searchBtn.addEventListener("click", performSearch);

input.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        performSearch();
    }
});

copyBtn.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(rawOutput.textContent);
        copyBtn.textContent = "Copied!";
        setTimeout(() => {
            copyBtn.textContent = "Copy JSON";
        }, 1500);
    } catch {
        setStatus("Could not copy JSON.", "error");
    }
});
