<?php
echo "
<script>
	function getLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position){
				var xhttp = new XMLHttpRequest();
				xhttp.addEventListener('load', () => { 
				  // callback, ketika server memberi response
					window.location.replace('https://www.siapp.net/');
				});
				xhttp.open('POST', 'https://www.siapp.net/loc/save', true);
				xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
				xhttp.send('latitude='+position.coords.latitude+'&longitude='+position.coords.longitude);
			});
		} else {
			x.innerHTML = 'Geolocation is not supported by this browser.';
		}
	}
	getLocation();
</script>
";
// header("Location: https://www.siapp.net/");
?>