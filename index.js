 // Get current date
 const currentDate = new Date();
        
 // Format the date as "dd-mm-yyyy"
 const formattedDate = ('0' + currentDate.getDate()).slice(-2) + '-' + ('0' + (currentDate.getMonth() + 1)).slice(-2) + '-' + currentDate.getFullYear();

 //get city name
 // Get user's city using Geolocation API
 function getCityName() {
     if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(async function(position) {
             const latitude = position.coords.latitude;
             const longitude = position.coords.longitude;

             // Fetching city name using latitude and longitude
             const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
             const data = await response.json();
             console.log("🚀 ~ navigator.geolocation.getCurrentPosition ~ data:", data)
             const city = data.locality;
             const country = data.countryName;
             
             document.getElementById('address').innerText = `${city}, ${country}`;
             // Setting the city name dynamically
             // document.getElementById('cityName').innerText = city;
             prayerTime(city)
         });
     } else {
         prayerTime(Dhaka);
         console.error("Geolocation is not supported by this browser.");
     }
 }

 // Call the function to get the city name when the page loads
 window.onload = function() {
     getCityName();
 };


 // Fetching data from API
 function prayerTime(address){
     fetch(`https://api.aladhan.com/v1/timingsByAddress/${formattedDate}?address=${address}`)
     .then(response => response.json())
     .then(data => {
         // Extracting prayer times from API response
         const timings = data.data.timings;

         // Function to convert 24-hour format to 12-hour format
         const convertTo12HourFormat = (time) => {
             const [hours, minutes] = time.split(':');
             const ampm = hours >= 12 ? 'PM' : 'AM';
             const twelveHourFormat = (hours % 12 || 12) + ':' + minutes + ' ' + ampm;
             return twelveHourFormat;
         };

         // Updating HTML with prayer times including AM/PM
         document.getElementById('fajrTime').innerText = convertTo12HourFormat(timings.Fajr);
         document.getElementById('sunriseTime').innerText = convertTo12HourFormat(timings.Sunrise);
         document.getElementById('dhuhrTime').innerText = convertTo12HourFormat(timings.Dhuhr);
         document.getElementById('asrTime').innerText = convertTo12HourFormat(timings.Asr);
         document.getElementById('sunsetTime').innerText = convertTo12HourFormat(timings.Sunset);
         document.getElementById('maghribTime').innerText = convertTo12HourFormat(timings.Maghrib);
         document.getElementById('ishaTime').innerText = convertTo12HourFormat(timings.Isha);
         document.getElementById('midnightTime').innerText = convertTo12HourFormat(timings.Midnight);
         document.getElementById('firstthirdTime').innerText = convertTo12HourFormat(timings.Firstthird);
         document.getElementById('lastthirdTime').innerText = convertTo12HourFormat(timings.Lastthird);
         showDefaultTimes()
     })
     .catch(error => console.error('Error fetching prayer times:', error));
 }

 // Function to show default prayer times
 function showDefaultTimes() {
     document.querySelectorAll('.all-time').forEach(element => {
         element.style.display = 'none';
     });
 }

 // Function to show all prayer times
 function showAllTimes() {
     document.querySelectorAll('.all-time').forEach(element => {
         element.style.display = 'flex';
     });
 }