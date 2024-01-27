const svg = d3.select("#map");
const projection = d3.geoMercator();
const pathGenerator = d3.geoPath().projection(projection);

const tooltip = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

const width = 1000;
const height = 700;

let clusters = {};  // Global variable to store the clusters

const mockMetricsData = [
    {
        distrito: "AVEIRO",
        clusterType: "ILP",
        population: "14.59%",
        compactness: 775646
    },
    {
        distrito: "AVEIRO",
        clusterType: "ILP",
        population:  "14.88%",
        compactness: 689988
    },
    {
        distrito: "AVEIRO",
        clusterType: "SA antigo",
        population:  "14.41%",
        compactness: 453194
    },
    {
        distrito: "AVEIRO",
        clusterType: "SA antigo",
        population: "14.59%",
        compactness: 775646
    },
    
    {
        distrito: "BRAGA",
        clusterType: "SA_antigo",
        someMetric: 456
    },
    // ... more data points
];


function getClusterFilePath(clusterType) {
    const clusterFiles = {
        "ILP": "ILP_only.txt",
        "SA_novo_ILP": "SA_ILP.txt",
        "SA_novo": "SA_novo.txt",
        // Add other mappings as required
    };

    return clusterFiles[clusterType];
}

function loadClustersFile(clusterType) {
    clusters = {};  // Reset clusters

    const filePath = getClusterFilePath(clusterType);

    d3.text(filePath).then(function(data) {
        const lines = data.split('\n');
        lines.forEach(line => {
            const [clusterNumber, units] = line.split(':');
            clusters[clusterNumber] = units.split(',').filter(u => u);
        });

        // Update the map with the new clusters data
        const distrito = document.getElementById('districts-select').value;
        updateMap(distrito);
    });
}



function colorBasedOnDicofre(dicofreValue) {
    for (let clusterNumber in clusters) {
        if (clusters[clusterNumber].includes(dicofreValue.toString())) {
            return colorForCluster(clusterNumber);
        }
    }
    return "#ffffff";  // Default color if not found in any cluster
}

function colorForCluster(clusterNumber) {
    const colors = [
        "#e6194B", // red
        "#3cb44b", // green
        "#ffe119", // yellow
        "#0082c8", // blue
        "#f58231", // orange
        "#911eb4", // purple
        "#46f0f0", // cyan
        "#f032e6", // magenta
        "#d2f53c", // lime
        "#fabebe", // pink
        "#008080", // teal
        "#334b20", // dark green
        "#e6beff", // lavender
        "#aa6e28", // brown
        "#800000", // maroon
        "#aaffc3", // pastel green
        "#808000", // olive
        "#FFD700", // gold
        "#000080", // navy
        "#808080", // grey
        "#0FF500", // black
        "#FF69B4", // hot pink
        "#4B0082", // indigo
        "#A52A2A",  // sienna
        "#e6194B", // red
        "#3cb44b", // green
        "#ffe119", // yellow
        "#0082c8", // blue
        "#f58231", // orange
        "#911eb4", // purple
        "#46f0f0", // cyan
        "#f032e6", // magenta
        "#d2f53c", // lime
        "#fabebe", // pink
        "#008080", // teal
        "#334b20", // dark green
        "#e6beff", // lavender
        "#aa6e28", // brown
        "#800000", // maroon
        "#aaffc3", // pastel green
        "#808000", // olive
        "#FFD700", // gold
        "#000080", // navy
        "#808080", // grey
        "#0EF500", // black
        "#FF69B4", // hot pink
        "#4B0082", // indigo
        "#A52A2A",  // sienna
        "#e6194B", // red
        "#3cb44b", // green
        "#ffe119", // yellow
        "#0082c8", // blue
        "#f58231", // orange
        "#911eb4", // purple
        "#46f0f0", // cyan
        "#f032e6", // magenta
        "#d2f53c", // lime
        "#fabebe", // pink
        "#008080", // teal
        "#334b20", // dark green
        "#e6beff", // lavender
        "#aa6e28", // brown
        "#800000", // maroon
        "#aaffc3", // pastel green
        "#808000", // olive
        "#FFD700", // gold
        "#000080", // navy
        "#808080", // grey
        "#04A500", // black
        "#FF69B4", // hot pink
        "#4B0082", // indigo
        "#A52A2A"  // sienna
        
    ]
    
    
    return colors[clusterNumber];
}

// Your updateMap function with a slight modification:
function updateMap(distrito) {
    d3.json("path_to_your_output_geojson_file.geojson").then(function(data) {
        let filteredGeojson = {
            type: "FeatureCollection",
            features: data.features.filter(feature => feature.properties.Distrito === distrito)
        };

        const centroid = d3.geoCentroid(filteredGeojson);
        projection.center(centroid).fitSize([width, height], filteredGeojson);

        const clusterType = document.getElementById('cluster-type').value;
    populateTable(distrito, clusterType);
        
        svg.selectAll("path")
        .data(filteredGeojson.features)
        .enter().append("path")
        .attr("fill", d => colorBasedOnDicofre(d.properties.Dicofre))
        .attr("stroke", "#000000")
        .attr("stroke-width", 0.5)
        .attr("d", pathGenerator)
        .on("mouseover", function(d) {
            tooltip.transition().duration(200).style("opacity", 0.9);
            tooltip.html("District: " + d.properties.Distrito +
                         "<br>Dicofre: " + d.properties.Dicofre)  // Update this line
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition().duration(500).style("opacity", 0);
        });
    }).catch(function(error) {
        console.error("Error loading the GeoJSON data:", error);
    });
}
function populateTable(distrito, clusterType) {
    const tbody = document.getElementById('results-table').querySelector('tbody');
    tbody.innerHTML = '';  // Clear existing rows

    mockMetricsData.forEach(metric => {
        const row = tbody.insertRow();

        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);
        cell1.textContent = metric.distrito;
        cell2.textContent = metric.clusterType;
        cell3.textContent = metric.population;
        cell4.textContent = metric.compactness;

        // Highlight the row if it matches the selected district and cluster type
        if (metric.distrito === distrito && metric.clusterType === clusterType) {
            row.style.backgroundColor = '#e0e0e0';  // Light grey highlight
        }
    });
}

function createLegend() {
    const colors = [
        "#e6194B", "#3cb44b", "#ffe119", "#0082c8",
        // ... other colors
    ];
    const legendSvg = d3.select("#legend");
    legendSvg.selectAll("*").remove(); // Clear existing legend items

    colors.forEach((color, i) => {
        legendSvg.append("rect")
            .attr("x", 10)
            .attr("y", i * 20)
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", color);

        legendSvg.append("text")
            .attr("x", 30)
            .attr("y", i * 20 + 9)
            .text(`Cluster ${i}`)
            .style("font-size", "12px");
    });
}

createLegend(); // Call this function to create the legend

function updateClusterInfo(clusterNumber) {
    const infoDiv = document.getElementById('cluster-info');
    // Replace with actual information about the cluster
    infoDiv.innerHTML = `
        <p>Cluster Number: ${clusterNumber}</p>
        <p>Other Information...</p>
    `;
}

// Call this function whenever you need to update the cluster info, e.g.
updateClusterInfo(5);


document.getElementById('districts-select').addEventListener('change', function() {
    const distrito = this.value;
    console.log(distrito);
    updateMap(distrito);
});

updateMap("PORTO");


document.getElementById('cluster-type').addEventListener('change', function() {
    const clusterType = this.value;
    loadClustersFile(clusterType);
});

loadClustersFile("SA_novo");



