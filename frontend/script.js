document.getElementById("predictBtn").addEventListener("click", async () => {

    const city = document.getElementById("city").value.trim();

    if (city === "") {
        alert("Please enter a city name.");
        return;
    }

    document.getElementById("result").innerHTML = "🌍 Fetching live pollution data...";
    document.getElementById("category").innerHTML = "";
    document.getElementById("recommendation").innerHTML = "";

    const response = await fetch("https://airguard-ai-backend.onrender.com/predict-city", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            city: city
        })

    });

    if (!response.ok) {

    document.getElementById("result").innerHTML =
        "❌ Unable to fetch AQI.";

    return;
    }

    const data = await response.json();

    const pollutantDiv = document.getElementById("pollutants");

    pollutantDiv.style.display = "none";

    pollutantDiv.innerHTML = "";

    const pollutants = data["Pollutants"];

    let html = "<h3>Live Air Pollution Data</h3>";

    for (const key in pollutants) {

                    html += `
            <div class="pollutant-card">
                <div class="pollutant-name">${key}</div>
                <div class="pollutant-value">${pollutants[key]}</div>
            </div>
            `;

    }

    pollutantDiv.innerHTML = html;

    if (data.error) {
        document.getElementById("result").innerHTML = data.error;
        document.getElementById("category").innerHTML = "";
        document.getElementById("recommendation").innerHTML = "";
        return;
    }

    const aqi = data["Predicted AQI"];

    document.getElementById("result").innerHTML =
    `<div style="font-size:18px;">Air Quality Index</div>
     <div class="aqi-number">${Math.round(aqi)}</div>`;

    let category = "";
    let recommendation = "";

    if (aqi <= 50) {
        category = "Good";
        recommendation = "🌳 Air quality is good.<br>✅ Enjoy outdoor activities.";
    }
    else if (aqi <= 100) {
        category = "Satisfactory";
        recommendation = recommendation = "🙂 Air quality is acceptable for most people.";
    }
    else if (aqi <= 200) {
        category = "Moderate";
        recommendation = recommendation = "⚠️ Sensitive individuals should reduce prolonged outdoor activity.";
    }
    else if (aqi <= 300) {
        category = "Poor";
        recommendation = recommendation = "😷 Limit outdoor activities.<br>🩺 Consider wearing an N95 mask.";
    }
    else if (aqi <= 400) {
        category = "Very Poor";
        recommendation = recommendation = "🚨 Avoid prolonged outdoor exposure.<br>😷 Wear an N95 mask.";
    }
    else {
        category = "Severe";
        recommendation = recommendation = "☠️ Stay indoors.<br>🚫 Avoid strenuous outdoor activities.";
    }

    const resultCard = document.getElementById("resultCard");
    const categoryElement = document.getElementById("category");

    categoryElement.innerHTML = category;

    if (category === "Good"){
        categoryElement.style.background = "#2ecc71";
        resultCard.style.borderLeft = "8px solid #2ecc71";
    }

    else if (category === "Satisfactory"){
        categoryElement.style.background = "#27ae60";
        resultCard.style.borderLeft = "8px solid #27ae60";
    }

    else if (category === "Moderate"){
        categoryElement.style.background = "#f39c12";
        resultCard.style.borderLeft = "8px solid #f39c12";
    }
    else if (category === "Poor"){
        categoryElement.style.background = "#e67e22";
        resultCard.style.borderLeft = "8px solid #e67e22";
    }

    else if (category === "Very Poor"){
        categoryElement.style.background = "#e74c3c";
        resultCard.style.borderLeft = "8px solid #e74c3c";
    }

    else{
        categoryElement.style.background = "#8e44ad";
        resultCard.style.borderLeft = "8px solid #8e44ad";
    }

    document.getElementById("recommendation").innerHTML =
        recommendation;

});
document.getElementById("toggleData").addEventListener("click", () => {

    const div = document.getElementById("pollutants");

    const button = document.getElementById("toggleData");

    if (div.style.display === "none") {

        div.style.display = "block";

        button.innerHTML = "Hide Live Data ▲";

    } else {

        div.style.display = "none";

        button.innerHTML = "Show Live Data ▼";

    }

});

document.getElementById("locationBtn").addEventListener("click", async () => {

    navigator.geolocation.getCurrentPosition(async (position) => {

        document.getElementById("result").innerHTML =
            "🌍 Fetching live pollution data...";

        document.getElementById("category").innerHTML = "";
        document.getElementById("recommendation").innerHTML = "";

        const response = await fetch("https://airguard-ai-backend.onrender.com/predict-location", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            })

        });

        if (!response.ok) {

            document.getElementById("result").innerHTML =
                "❌ Unable to fetch AQI.";

            return;
        }

        const data = await response.json();

        const pollutantDiv = document.getElementById("pollutants");

        pollutantDiv.style.display = "none";
        pollutantDiv.innerHTML = "";

        const pollutants = data["Pollutants"];

        let html = "<h3>Live Air Pollution Data</h3>";

        for (const key in pollutants) {
            html += `<p><strong>${key}</strong>: ${pollutants[key]}</p>`;
        }

        pollutantDiv.innerHTML = html;

        const aqi = data["Predicted AQI"];

        document.getElementById("city").value = "Current Location";

        document.getElementById("result").innerHTML =
            `<div style="font-size:18px;">Air Quality Index</div>
             <div class="aqi-number">${Math.round(aqi)}</div>`;

        let category = "";
        let recommendation = "";

        if (aqi <= 50) {
            category = "Good";
            recommendation = "🌳 Air quality is good.<br>✅ Enjoy outdoor activities.";
        }
        else if (aqi <= 100) {
            category = "Satisfactory";
            recommendation = "🙂 Air quality is acceptable for most people.";
        }
        else if (aqi <= 200) {
            category = "Moderate";
            recommendation = "⚠️ Sensitive individuals should reduce prolonged outdoor activity.";
        }
        else if (aqi <= 300) {
            category = "Poor";
            recommendation = "😷 Limit outdoor activities.<br>🩺 Consider wearing an N95 mask.";
        }
        else if (aqi <= 400) {
            category = "Very Poor";
            recommendation = "🚨 Avoid prolonged outdoor exposure.<br>😷 Wear an N95 mask.";
        }
        else {
            category = "Severe";
            recommendation = "☠️ Stay indoors.<br>🚫 Avoid strenuous outdoor activities.";
        }

        const resultCard = document.getElementById("resultCard");
        const categoryElement = document.getElementById("category");

        categoryElement.innerHTML = category;

        if (category === "Good") {
            categoryElement.style.background = "#2ecc71";
            resultCard.style.borderLeft = "8px solid #2ecc71";
        }
        else if (category === "Satisfactory") {
            categoryElement.style.background = "#27ae60";
            resultCard.style.borderLeft = "8px solid #27ae60";
        }
        else if (category === "Moderate") {
            categoryElement.style.background = "#f39c12";
            resultCard.style.borderLeft = "8px solid #f39c12";
        }
        else if (category === "Poor") {
            categoryElement.style.background = "#e67e22";
            resultCard.style.borderLeft = "8px solid #e67e22";
        }
        else if (category === "Very Poor") {
            categoryElement.style.background = "#e74c3c";
            resultCard.style.borderLeft = "8px solid #e74c3c";
        }
        else {
            categoryElement.style.background = "#8e44ad";
            resultCard.style.borderLeft = "8px solid #8e44ad";
        }

        document.getElementById("recommendation").innerHTML = recommendation;

    });

});