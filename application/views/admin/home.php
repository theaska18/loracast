<?php
defined('BASEPATH') OR exit('No direct script access allowed');
$session=$this->pagesession->get();
$common=$this->common;
$row=$common->queryRow("SELECT first_name,last_name,id_number,email_address,birth_date,birth_place,phone_number1,foto FROM app_employee WHERE employee_id=".$session->employee_id);
$user=$common->queryRow("SELECT A.role_name FROM app_user M INNER JOIN app_role A ON M.role_id=A.role_id WHERE user_id=".$session->user_id);
?><!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>Welcome | <?php echo $session->user_name; ?></title>
	<meta name="viewport" content="initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,width=device-width,height=device-height,target-densitydpi=device-dpi,user-scalable=yes" />
	<style>
	html, body{
		padding: 0px;
		margin: 0px;
	}
	.circular {
		width: 150px;
		height: 150px;
		border-radius: 100px;
		-webkit-border-radius: 100px;
		-moz-border-radius: 100px;
		background: url(../../upload/<?php echo $common->getImage($row->foto); ?>) no-repeat;
		background-size: cover;
		box-shadow: 0 0 8px rgba(0, 0, 0, .8);
		-webkit-box-shadow: 0 0 8px rgba(0, 0, 0, .8);
		-moz-box-shadow: 0 0 8px rgba(0, 0, 0, .8);
		float:left;
		border: 4px solid white;
	}
	@font-face {
	  font-family: led;
	  src: url(../../vendor/led.ttf);
	  font-weight: bold;
	}
	</style>
</head>
<body style="">
<div style="padding: 10px;height: 160px;">
	<div class="circular"></div>
	<div style="float:left;margin-left: 20px;font-size: 12px;">
		<div style="font-style: italic;">Name :</div>
		<div style="font-family: led;color:#054059;font-size: 30px;font-weight: bold;">
			<?php echo $row->first_name.' '.$row->last_name; ?> - <?php echo $row->id_number; ?> - <?php echo $user->role_name; ?>
		</div>
		<div style="font-style: italic;">Email :</div>
		<div style="margin-left: 100px;font-family: led;font-size: 15px;">
			<?php echo $row->email_address; ?>
		</div>
		<div style="font-style: italic;">Birth Place/Date :</div>
		<div style="margin-left: 100px;font-family: led;font-size: 15px;">
			<?php 
				$birth_date=new DateTime($row->birth_date);
				echo $row->birth_place.', '.$birth_date->format('d M Y'); 
			?>
		</div>
		<div style="font-style: italic;">Phone Number :</div>
		<div style="margin-left: 100px;font-family: led;font-size: 15px;">
			<?php echo $row->phone_number1; ?>
		</div>
	</div>
</div>
</body>
</html>