document.addEventListener('DOMContentLoaded', function() {
    'use strict'; //

    let visitedCities = localStorage.getItem("visited");
    visitedCities = visitedCities ? JSON.parse(visitedCities) : [];

    function sortingCities(arr, type) {
        if (type === "asc") {
            arr.sort(function(a, b) {
                return a.population - b.population;
            });
        } else if (type === "decs") {
            arr.sort(function(a, b) {
                return b.population - a.population;
            });
        } else {
            return arr
        }
    }

    (async() => {
        let responseL = await fetch('land.json');
        let countries = await responseL.json();
        let responseS = await fetch('stad.json');
        let cities = await responseS.json();

        sortingCities(cities, "decs");

        let x = '';
        for (let i = 0; i < countries.length; i++) {
            x += "<div class='country'><h3>" + countries[i].countryname + ' - ' + countries[i].id + "</h3>";
            x += "<ul class='country-cities'>";
            for (let j = 0; j < cities.length; j++) {
                if (countries[i].id === cities[j].countryid) {
                    x += '<li>' + cities[j].stadname;
                    x += ' - <button>visited</button>';
                    x += '<ul class="city-info" data-id="' + cities[j].id + '">';
                    x += '<li>' + cities[j].population + "</li>";
                    x += '<li>' + cities[j].countryid + " - " + countries[i].countryname + "</li>";
                    x += '<li>' + cities[j].id + "</li>";
                    x += '</ul>';
                    x += '</li>';
                }
            }
            x += "</ul></div>";
        }

        document.getElementById("app").innerHTML = x;

        let country = document.getElementsByClassName('country');
        let cityInfo = document.getElementsByClassName('city-info');
        for (let i = 0; i < cityInfo.length; i++) {
            cityInfo[i].style.display = "none";
            cityInfo[i].parentElement.addEventListener('click', function(e) {
                if (e.target === this.children[0]) {
                    let id = parseInt(this.children[1].getAttribute('data-id'));
                    visitedCities.push(id);
                    localStorage.setItem("visited", JSON.stringify(visitedCities));
                    return false;
                } else {
                    this.children[1].style.display = this.children[1].style.display === 'none' ? '' : 'none';
                }
            });
        };
        for (let i = 0; i < country.length; i++) {
            country[i].children[1].style.display = "none";
            country[i].addEventListener('click', function(e) {
                if (e.target !== this.children[0]) {
                    return false;
                } else {
                    if (this.children[1].style.display === "block") {
                        this.children[1].style.display = "none";
                    } else {
                        this.children[1].style.display = "block";
                    }
                }
            });
        };

        document.getElementById("app").insertAdjacentHTML('beforeend', '<a href="visited.html">visited cities</a>');

    })();

});