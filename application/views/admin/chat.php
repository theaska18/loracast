<html>
 <head>
      <title>chatting realtime</title>
      <script type="text/javascript" src="<?php echo base_url(); ?>vendor/jquery-2.1.4.min.js"></script>
      <style>
			body, html {
				height: 100%;
				margin:0px;
			}
			.txt-me{
				text-align:right;
			}
			.chat-me{
				float:right;
				background: #f5f5f5;
				padding: 10px 15px;
				border-radius: 20px;
				letter-spacing: 0.1px;
				color: #32465a;
				text-rendering: optimizeLegibility;
				text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.004);
				-webkit-font-smoothing: antialiased;
				font-family: "proxima-nova", "Source Sans Pro", sans-serif;
				clear:both;
				margin-bottom:10px;
				max-width: 300px;
				font-size: 100%;
				vertical-align: baseline;
				font-size: 12px;
			}
			.txt-time-me{
				margin-top: 3px;
				font-size: 10px;
				text-align:right;
				color:#7db1b1;
			}
			.txt-time-you{
				margin-top: 3px;
				font-size: 10px;
				text-align:left;
				color:#7db1b1;
			}
			.txt-you{
				text-align:left;
			}
			.chat-you{
				float:left;
				background: #435f7a;
				color: #f5f5f5;
				padding: 10px 15px;
				border-radius: 20px;
				letter-spacing: 0.1px;
				text-rendering: optimizeLegibility;
				text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.004);
				-webkit-font-smoothing: antialiased;
				font-family: "proxima-nova", "Source Sans Pro", sans-serif;
				clear:both;
				margin-bottom:10px;
				max-width: 300px;
				font-size: 100%;
				vertical-align: baseline;
				    font-size: 12px;
			}
      </style>
 </head>
 <body style="background:#E6EAEA;">
      <div class="container" id="container" style="overflow: auto;width:100%; height: 100%;">
           <div class="row">
                <div class="panel panel-default">
                 <div class="panel-body">
                     <div class="container" id="chat_data" style="padding: 10px;">
                     </div>
                 </div>
                </div>
           </div>
      </div>
    
<script type="text/javascript" src="<?php echo base_url(); ?>vendor/firebase.js"></script>
<script>
	var user_id=<?php echo $_GET['us']; ?>;
	var config = {
		apiKey: "AIzaSyAfupHi5lLyiuSVVS058JzS_OnIchmahRM",
		authDomain: "sikamal-40b79.firebaseapp.com",
		databaseURL: "https://sikamal-40b79.firebaseio.com",
		projectId: "sikamal-40b79",
		storageBucket: "sikamal-40b79.appspot.com",
		messagingSenderId: "650744576707"
	};
	firebase.initializeApp(config);
	var first=true;
	$(document).ready(function(){
		var rootchatref = firebase.database().ref('/');
		var chatref = firebase.database().ref('/Chat/'+"<?php echo $_GET['id']; ?>");
		chatref.limitToLast(20).on('child_added', function(snapshot) {
			var data = snapshot.val();
			console.log(snapshot);
			// console.log(snapshot.parent());
			var local=new Date(data.time).toLocaleString();
			var clsRead='Pending';
			if(data.read==true){
				clsRead='Ok';
			}
			if(user_id==data.user_id){
				$('#chat_data').append('<div class="chat-me" id="'+snapshot.key+'"><div class="txt-me"><b>Anda</b></div><div class="txt-me">'+data.msg+'</div><div class="txt-time-me">'+local.split(' ')[0]+' '+local.split(' ')[1]+' <span id="status-'+snapshot.key+'">'+clsRead+'</span></div></div>');
			}else{
				$('#chat_data').append('<div class="chat-you" id="'+snapshot.key+'"><div class="txt-you"><b>'+data.user_name+'</b></div><div class="txt-you">'+data.msg+'</div><div class="txt-time-you">'+local.split(' ')[0]+' '+local.split(' ')[1]+'</div></div>');
				if(data.read==false){
					// var t=new Audio("<?php echo base_url(); ?>vendor/sound/notif.mp3");t.play();
					chatref.child(snapshot.key).update({read:true});
				}
			}
			var objDiv = document.getElementById("container");
			objDiv.scrollTop = objDiv.scrollHeight;
		});
		chatref.limitToLast(20).on('child_changed', function(snapshot) {
			var data = snapshot.val();
			if(data.read==true){
				$('#status-'+snapshot.key).html('Ok');
			}
		});
	});
</script>
</body>
</html>  