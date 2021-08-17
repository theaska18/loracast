<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Login</title>
	<link rel="icon" href="<?php echo base_url()?>vendor/images/icon_32.ico">
<?php
	$minify->press(array('vendor/system/skeleton.css'));
?>
	<style>
		body{
			background-image:url('vendor/images/bg.png');
		}
		.copyright{
		    font-size: 11px;
		    line-height: 13px;
		}
	</style>
</head>
<body>
<div class="container">
	<form id="form" class="form-signin panel panel-default" method="POST" autocomplete="off" >
		<div>
			<img src="<?php echo base_url(); ?>vendor/images/logo_302_80.png">
			<label for="username" class="sr-only">Username</label>
			<input type="text" id="inputUsername" name="username" class="form-control" placeholder="Username" required autofocus>
			<label for="password" class="sr-only">Password</label>
			<input type="password" id="inputPassword" name="password" class="form-control" placeholder="Password" required>
			<button id="btnSubmit" class="btn btn-lg btn-primary btn-block" type="button">Sign in</button>
		</div>
	 </form>
</div>
<div class="copyright">
	<div class="container">
		<div class="row">
			<div class="col-sm-12">
			Powered By <b><?php echo $prop->get('APP_POWERED'); ?> </b>
			</div>
		</div>
	</div>
</div>
<?php
	$minify->press(array('vendor/jquery-2.1.4.min.js'));
?>
<script>
	$(function(){
		window.history.pushState({canBeAnything:true},"",'<?php echo base_url()?>cpanel');
		$('#btnSubmit').click(function(){
			login();
		});
		$('#inputUsername,#inputPassword').keyup(function(e){
			if(e.keyCode==13){
				login();
			}
		});
		function login(){
			if($('#inputUsername').val() != '' && $('#inputPassword').val() !=''){
				$('#btnSubmit').html('Loading...');
				$.ajax({
					url:'<?php echo base_url(); ?>fn/login/login',
					data:$('#form').serialize(),
					type:'POST',
					dataType:'JSON',
					success:function(r){
						if(r.r=='S'){
							$('#btnSubmit').html('Redirect...');
							location.replace('<?php echo base_url(); ?>cpanel?session='+r.d);
						}else{
							$('#btnSubmit').html('Sign in');
							alert(r.m);
						}
					},
					error:function(jqXHR, exception){
						$('#btnSubmit').html('Sign in');
						alert('isi data dengan benar');
					}
				});
			}else{
				alert('isi data dengan benar');
			}
		}
	});
</script>
</body>
</html>