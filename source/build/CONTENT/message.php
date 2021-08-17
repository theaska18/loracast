<?php
	function chat(){
		_load('mobile_detect');
		_this()->load->view('admin/chat',array('mobile'=>_this()->mobile_detect));
		exit;
	}