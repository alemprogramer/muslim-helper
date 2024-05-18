const currentDate = new Date();

let date = localStorage.getItem('date');
let data = localStorage.getItem('times');
let address = localStorage.getItem('address');


const convertTo12HourFormat = (time,key) => {
    const [hours, minutes] = time.split(':');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const twelveHourFormat = (hours % 12 || 12) + ':' + minutes + ' ' + ampm;
    return twelveHourFormat;
};

if(data && address && date == currentDate.getDate() + '~' + currentDate.getDay()){
    console.log('have');
    data = JSON.parse(data);
    document.getElementById('address').innerHTML = `<i class="fa-solid fa-location-dot"></i> &nbsp;${address}` ;
    for(key in data){
        document.getElementById(key).innerText = convertTo12HourFormat(data[key],key);
    }
   
}else{
    console.log('not have');
     getCityName();
}


// Get current date


// Format the date as "dd-mm-yyyy"
const formattedDate = ('0' + currentDate.getDate()).slice(-2) + '-' + ('0' + (currentDate.getMonth() + 1)).slice(-2) + '-' + currentDate.getFullYear();

//get city name
// Get user's city using Geolocation API
function getCityName() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            // Fetching city name using latitude and longitude
            const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
            const data = await response.json();

            const city = data.locality;
            const country = data.countryName;

            localStorage.setItem('address',`${city}, ${country}` );
            localStorage.setItem('date', currentDate.getDate() + '~' + currentDate.getDay());

            document.getElementById('address').innerText = `${city}, ${country}`;
            prayerTime(city)
        });
    } else {
        prayerTime(Dhaka);
        console.error("Geolocation is not supported by this browser.");
    }
}



// Fetching data from API
function prayerTime(address) {
    fetch(`https://api.aladhan.com/v1/timingsByAddress/${formattedDate}?address=${address}`)
        .then(response => response.json())
        .then(data => {
            const timings = data.data.timings;
            localStorage.setItem('times', JSON.stringify(timings))
            for(key in timings){
                document.getElementById(key).innerText = convertTo12HourFormat(timings[key],key);
            }
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