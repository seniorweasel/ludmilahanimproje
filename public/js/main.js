$(document).ready(function () {
  // Function to read a JSON file and display the data count
  function displayDataCount(filename, countElement) {
    return $.getJSON(`json/${filename}`)
      .then(function (data) {
        console.log("Data fetched:", data); // Add this line for debugging
        const count = data.centers.length; // Access the length of the 'centers' array
        console.log("Count:", count); // Add this line for debugging
        countElement.text(count);
        return count; // Return the count for Promise.all()
      })
      .catch(function (error) {
        console.error(error);
        countElement.text("ERR");
        return 0; // Return 0 to handle the error in Promise.all()
      });
  }
  displayDataCount("konsolosluklar.json", $("#counter1")),
    displayDataCount("okullar.json", $("#counter3")),
    displayDataCount("universiteler.json", $("#counter4")),
    // Call the displayDataCount function for each JSON file
    Promise.all([

      displayDataCount("dernekler.json", $("#counter2")),
      displayDataCount("kulturmerkezleri.json", $("#counter2")),

    ])
      .then(counts => {
        console.log("Counts:", counts);
        const combinedCount = counts.reduce((acc, count) => acc + count, 0);
        console.log("Combined Count:", combinedCount);
        $("#counter2").text(combinedCount);
      })
      .catch(error => {
        console.error(error);
        $("#counter1").text("Error combining counts");
      });
});


$(document).ready(function () {
  function populateTableWithJSONData(fileURL) {
    $.getJSON(fileURL, function (data) {
      var tableData = '';
      $.each(data.centers, function (index, obj) {
        tableData += '<tr>';
        tableData += '<td>' + obj.plaka_kodu + '</td>';
        tableData += '<td>' + obj.name + '</td>'; // Access the "name" property

        tableData += '<td>' + obj.phone + '</td>'; // Access the "phone" property
        tableData += '<td>' + obj.email + '</td>'; // Access the "email" property
        tableData += '<td>' + ' <button type="button" class="btn btn-danger">Remove</button>' + '</td>';

        // Access the "plaka_kodu" property
        tableData += '</tr>';
      });
      $('#data-table tbody').html(tableData);
    }).fail(function () {
      console.error('Error fetching data from the server');
    });
  }
  var jsonFiles = [
    { url: "/ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb" },
    { url: "/3e23e8160039594a33894f6564e1b1348bbd7a0088d42c4acb73eeaed59c009d" },
    { url: "/2e7d2c03a9507ae265ecf5b5356885a53393a2029d241394997265a1a25aefc6" },
    { url: "/18ac3e7343f016890c510e93f935261169d9e3f565436429830faf0934f4f8e4" },
    { url: "/3f79bb7b435b05321651daefd374cdc681dc06faa65e374e38337b88ca046dea" }
  ];
  // Call the function to populate the table with data from each JSON file
  jsonFiles.forEach(function (file) {
    populateTableWithJSONData(file.url);
  });
});
  
 


function filterResults() {
  var selectedService = $("#hizmet-select").val();
  var selectedCity = $("#il-select").val();

  var jsonFileName = "";

  if (selectedService === "1") {
    jsonFileName = "/ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb";
  } else if (selectedService === "2") {
    jsonFileName = "/3e23e8160039594a33894f6564e1b1348bbd7a0088d42c4acb73eeaed59c009d";
  } else if (selectedService === "3") {
    jsonFileName = "/2e7d2c03a9507ae265ecf5b5356885a53393a2029d241394997265a1a25aefc6";
  } else if (selectedService === "4") {
    jsonFileName = "/18ac3e7343f016890c510e93f935261169d9e3f565436429830faf0934f4f8e4";
  } else if (selectedService === "5") {
    jsonFileName = "/3f79bb7b435b05321651daefd374cdc681dc06faa65e374e38337b88ca046dea";
  }


}

$(document).ready(function () {
  var jsonFiles = [
    { url: "/ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb", searchField: "name" },
    { url: "/3e23e8160039594a33894f6564e1b1348bbd7a0088d42c4acb73eeaed59c009d", searchField: "name" },
    { url: "/2e7d2c03a9507ae265ecf5b5356885a53393a2029d241394997265a1a25aefc6", searchField: "name" },
    { url: "/18ac3e7343f016890c510e93f935261169d9e3f565436429830faf0934f4f8e4", searchField: "name" },
    { url: "/3f79bb7b435b05321651daefd374cdc681dc06faa65e374e38337b88ca046dea", searchField: "name" }
  ];

  $("#search-button").click(function () {
    var araVeri = $("#search-input")
      .val()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
      .toLowerCase();
    if (araVeri !== "") {
      $("#results-list").empty();
      searchInJsonFiles(araVeri);
    }
  });

  function searchInJsonFiles(searchTerm) {
    var results = [];

    $.each(jsonFiles, function (index, jsonFile) {
      $.getJSON(jsonFile.url, function (jsonData) {
        if (jsonData) {
          var eslesenSonuclar = jsonData.centers.filter(function (center) {
            var barVerisi = center[jsonFile.searchField].toLowerCase();
            return barVerisi.includes(searchTerm.toLowerCase());
          });

          results = results.concat(eslesenSonuclar);

          if (index === jsonFiles.length - 1) {
            results.sort(function () {
              return 0.5 - Math.random();
            });

            displayResults(results);
            hohogo(results);
          }
        }
      }).fail(function (hataatis) {
        console.log("JSON dosyası alınamadı. Hata: " + hataatis);
      });
    });
  }

  function displayResults(results) {
    var sidebar = $("#results-list");
    sidebar.empty();

    if (results.length === 0) {
      sidebar.append("<li>Arama sonucu bulunamadı.</li>");
    } else {
      $.each(results, function (index, result) {
        var listItem = $("<li>")
          .addClass("list-group-item list-group-item-action py-3 lh-sm")
          .attr("aria-current", "true");

        var contentContainer = $("<div>")
          .addClass("d-flex w-100 align-items-center justify-content-between")
          .appendTo(listItem);

        var name = $("<strong>")
          .addClass("mb-1")
          .text(result.name)
          .appendTo(contentContainer);

        var city = $("<small>").text(result.il_adi).appendTo(contentContainer);

        var details = $("<div>")
          .addClass("col-10 mb-1 small")
          .appendTo(listItem);

        $("<p style='font-size:14px;'>")
          .html(
            "<br><strong>Adres:</strong> " +
            result.address +
            "<br><br><strong>Telefon:</strong> " +
            result.phone +
            "<br><strong>Email:</strong> " +
            result.email
          )
          .appendTo(details);

        listItem.appendTo(sidebar);

        $(`.city[id='${result.plaka_kodu}']`).addClass("selected");
      });
    }
  }


  /*function hohogo(results) {
    var sidebar = $("#results-list");
    sidebar.empty();
  
    if (results.length === 0) {
      sidebar.append("<li>Arama sonucu bulunamadı.</li>");
    } else {
      $.each(results, function (index, result) {
        var listItem = $("<li>")
          .addClass("list-group-item list-group-item-action py-3 lh-sm")
          .attr("aria-current", "true");
  
        var contentContainer = $("<div>")
          .addClass("d-flex w-100 align-items-center justify-content-between")
          .appendTo(listItem);
  
        var name = $("<strong>")
          .addClass("mb-1")
          .text(result.name)
          .appendTo(contentContainer);
  
        var city = $("<small>").text(result.il_adi).appendTo(contentContainer);
  
        var details = $("<div>")
          .addClass("col-10 mb-1 small")
          .appendTo(listItem);
  
        $("<p style='font-size:14px;'>")
          .html(
            "<br><strong>Adres:</strong> " +
            result.address +
            "<br><br><strong>Telefon:</strong> " +
            result.phone +
            "<br><strong>Email:</strong> " +
            result.email +
            "<br><button class=\"btn btn-danger\" id=\"jsonDataRemove\">Veriyi yok et!</button>"
            
          )
          .appendTo(details);
  
        listItem.appendTo(sidebar);
  
        $(`.city[id='${result.plaka_kodu}']`).addClass("selected");
      });
    }
    }
  
    */

});


function resetSelected() {
  $(".city").removeClass("selected");
}

function showSidebar() {
  $(".yoa382").css("visibility", "visible");
}
function filterAdminDataRemoval() {
  $(".yoa382").css("display", "block");
}
function hideSidebar() {
  $(".yoa382").css("visibility", "hidden");
}

var svgTurkeyMap = document
  .getElementById("svg-turkey-map")
  .getElementsByTagName("path");
var cityName = document.getElementById("city-name");

for (i = 0; i < svgTurkeyMap.length; i++) {
  svgTurkeyMap[i].addEventListener("mousemove", function () {
    cityName.classList.add("show-city-name--active");
    cityName.style.left = event.clientX + 10 + "px";
    cityName.style.top = event.clientY + 10 + "px";
    cityName.innerHTML = this.getAttribute("title");
  });

  svgTurkeyMap[i].addEventListener("mouseleave", function () {
    cityName.classList.remove("show-city-name--active");
  });

  /*
  svgTurkeyMap[i].addEventListener("click", function() {
    window.location.href = this.getAttribute("#");        
  });
  */
}

$(function () {
  const ilSelect = $("#il-select");

  $.getJSON("/citydata", function (data) {
    const iller = data.iller;
    const combolistSecenekleri = iller.map((il) => {
      return { value: il.plaka_kodu, textContent: il.il_adi };
    });

    combolistSecenekleri.forEach((secenek) => {
      const option = $("<option>").val(secenek.value).text(secenek.textContent);
      ilSelect.append(option);
    });
  }).fail(function () {
    console.error("JSON verisi alınamadı.");
  });
});

function selectCity() {
  var ilID = this.getAttribute("id");
  var ilSelect = document.getElementById("il-select");
  ilSelect.value = ilID;
  ilSelect.dispatchEvent(new Event("change"));

  var selectedCity = document.querySelector(".city.selected");

  if (selectedCity) {
    selectedCity.classList.remove("selected");
  }

  this.classList.add("selected");
}

var ilSelect = document.getElementById("il-select");
ilSelect.addEventListener("change", function () {
  var selectedCity = document.querySelector(".city.selected");

  if (selectedCity) {
    selectedCity.classList.remove("selected");
  }

  var selectedOption = this.options[this.selectedIndex];
  var selectedCityID = selectedOption.value;

  if (selectedCityID) {
    var selectedCitySVG = document.querySelector(
      'path[id="' + selectedCityID + '"]'
    );

    if (selectedCitySVG) {
      selectedCitySVG.classList.add("selected");
    }
  }
});

var ilElements = document.querySelectorAll(".city");
ilElements.forEach(function (ilElement) {
  ilElement.addEventListener("click", selectCity);
});

