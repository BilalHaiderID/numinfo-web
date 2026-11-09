const UPSTREAM_URL = "https://simcheckpk.com/search_data2.php?query=";

const OPERATORS = {
    "030": "Jazz",
    "031": "Zong",
    "032": "Warid / Jazz",
    "033": "Ufone",
    "034": "Telenor",
    "035": "SCOM"
};

function normalizeNumber(value) {
    let number = String(value || "").replace(/\D/g, "");

    if (number.startsWith("0092")) {
        number = "0" + number.slice(4);
    } else if (number.startsWith("92") && number.length === 12) {
        number = "0" + number.slice(2);
    }

    return number;
}

function getOperator(number) {
    return OPERATORS[number.slice(0, 3)] || "Unknown";
}

function getGender(cnic) {
    const digits = String(cnic || "").replace(/\D/g, "");

    if (digits.length !== 13) {
        return "Not available";
    }

    return Number(digits.at(-1)) % 2 === 0 ? "Female" : "Male";
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

    return data && typeof data === "object" ? [data] : [];
}

function toPublicRecord(record, requestedNumber) {
    const source = record || {};
    const number = normalizeNumber(
        source.nbr ?? source.Mobile ?? source.mobile ?? requestedNumber
    );
    const name = source.nam ?? source.Name ?? source.name ?? "Not available";
    const cnic = source.cni ?? source.CNIC ?? source.cnic;
    const operator =
        source.operator ?? source.Operator ?? getOperator(number);

    return {
        number,
        name: String(name),
        operator: String(operator),
        gender: getGender(cnic)
    };
}

export default async function handler(request, response) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.setHeader("Content-Type", "application/json; charset=utf-8");

    if (request.method === "OPTIONS") {
        response.status(204).end();
        return;
    }

    if (request.method !== "GET") {
        response.status(405).json({ error: "Method not allowed" });
        return;
    }

    const number = normalizeNumber(request.query?.number);

    if (!/^03\d{9}$/.test(number)) {
        response.status(400).json({
            error: "Enter a valid Pakistani mobile number."
        });
        return;
    }

    try {
        const upstreamResponse = await fetch(
            UPSTREAM_URL + encodeURIComponent(number),
            { headers: { Accept: "application/json" } }
        );

        if (!upstreamResponse.ok) {
            response.status(502).json({ error: "Upstream lookup failed." });
            return;
        }

        const data = await upstreamResponse.json();
        const records = extractRecords(data).map(record =>
            toPublicRecord(record, number)
        );

        response.status(200).json(records);
    } catch (error) {
        console.error("Number lookup failed:", error);
        response.status(502).json({
            error: "Unable to retrieve number information."
        });
    }
}
