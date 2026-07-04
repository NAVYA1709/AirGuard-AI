document.getElementById("predictBtn").addEventListener("click", async () => {

    const today = new Date();

    const input = {

        PM2_5: Number(document.getElementById("pm25").value),

        PM10: Number(document.getElementById("pm10").value),

        NO: Number(document.getElementById("no").value),

        NO2: Number(document.getElementById("no2").value),

        NOx: Number(document.getElementById("nox").value),

        NH3: Number(document.getElementById("nh3").value),

        CO: Number(document.getElementById("co").value),

        SO2: Number(document.getElementById("so2").value),

        O3: Number(document.getElementById("o3").value),

        Benzene: Number(document.getElementById("benzene").value),

        Toluene: Number(document.getElementById("toluene").value),

        Year: today.getFullYear(),

        Month: today.getMonth() + 1,

        Day: today.getDate(),

        DayOfWeek: today.getDay(),

        City: document.getElementById("city").value,

        Season: document.getElementById("season").value

    };

    const response = await fetch("http://127.0.0.1:8000/predict", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(input)

    });

    const data = await response.json();

    document.getElementById("result").innerHTML =
        "Predicted AQI : " + data["Predicted AQI"];

});