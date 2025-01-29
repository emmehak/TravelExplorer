document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-bar');
    const searchForm = document.querySelector('.search-form');
    const resetBtn = document.querySelector('.reset-btn');

    // Store the API data
    let travelData = {
        countries: [],
        temples: [],
        beaches: []
    };

    // Fetch the API data
    async function fetchTravelData() {
        try {
            const response = await fetch('api.json');
            travelData = await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

// Function to search through data (countries, cities, temples, and beaches)
function searchInData(dataArray, type, searchTerm) {
    return dataArray.reduce((results, item) => {
        // Check if the main item (country or temple) matches the search term
        if (item.name.toLowerCase().includes(searchTerm)) {
            results.push({
                type,
                name: item.name,
                description: item.description || `Country with cities like ${item.cities?.map(city => city.name.split(',')[0]).join(', ')}`,
                imageUrl: item.imageUrl
            });
        }

        // Check if any city within a country matches the search term
        if (item.cities) {
            item.cities.forEach(city => {
                if (city.name.toLowerCase().includes(searchTerm)) {
                    results.push({
                        type: 'city',
                        name: city.name,
                        description: city.description,
                        imageUrl: city.imageUrl
                    });
                }
            });
        }

        return results;
    }, []);
}

    // Perform search
    function performSearch(searchTerm) {
        searchTerm = searchTerm.toLowerCase();
        let results = [];

        // Search in each section
        results = [
            ...results,
            ...searchInData(travelData.countries, 'country', searchTerm),
            ...searchInData(travelData.temples, 'temple', searchTerm),
            ...searchInData(travelData.beaches, 'beach', searchTerm)
        ];

        displayResults(results);
    }

    // Function to display results as dropdown
    function displayResults(results) {
        const existingResults = document.querySelector('.search-results');
        if (existingResults) {
            existingResults.remove();
        }

        if (results.length === 0) {
            return;
        }

        // Create results container
        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'search-results';

        // Populate results container
        results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            resultItem.innerHTML = `
                <h3>${result.name}</h3>
                <p class="result-type">${result.type}</p>
                <p>${result.description}</p>
                ${result.imageUrl ? `<img src="${result.imageUrl}" alt="${result.name}" class="result-image" />` : ''}
            `;
            resultsContainer.appendChild(resultItem);
        });

        searchForm.appendChild(resultsContainer);

        resultsContainer.style.position = 'absolute'; 
        resultsContainer.style.top = '100%'; 
        resultsContainer.style.left = '0'; 
        resultsContainer.style.width = '100%'; 
        resultsContainer.style.backgroundColor = ' #005f73;'; 
        resultsContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)'; 
    }

    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        performSearch(searchInput.value);
    });

    searchInput.addEventListener('input', function() {
        if (this.value.length >= 2) {
            performSearch(this.value);
        } else {
            const existingResults = document.querySelector('.search-results');
            if (existingResults) {
                existingResults.remove();
            }
        }
    });

    resetBtn.addEventListener('click', function() {
        searchInput.value = '';
        const existingResults = document.querySelector('.search-results');
        if (existingResults) {
            existingResults.remove();
        }
    });

    fetchTravelData();
});
