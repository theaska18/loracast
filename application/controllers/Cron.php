<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Cron extends CI_Controller {
	public function index(){
		$path = './cache/';
		if ($handle = opendir($path)) {
			while (false !== ($file = readdir($handle))) {
				if(file_exists($path.$file) && $file !=='.'  && $file !=='..'){
					if ((time()-filectime($path.$file)) > 86400) {  
						unlink($path.$file);
					}
				}
			}
		}
		$path = './application/cache/';
		if ($handle = opendir($path)) {
			while (false !== ($file = readdir($handle))) {
				if(file_exists($path.$file) && $file !=='.'  && $file !=='..'){
					if ((time()-filectime($path.$file)) > 86400) {  
						//unlink($path.$file);
					}
				}
			}
		}
		$path = './temp/';
		if ($handle = opendir($path)) {
			while (false !== ($file = readdir($handle))) {
				if(file_exists($path.$file) && $file !=='.'  && $file !=='..'){
					if ((time()-filectime($path.$file)) > 86400) {  
						unlink($path.$file);
					}
				}
			}
		}
	}
	public function removeAll(){
		$path = './cache/';
		if ($handle = opendir($path)) {
			while (false !== ($file = readdir($handle))) {
				if(file_exists($path.$file) && $file !=='.'  && $file !=='..'){ 
					unlink($path.$file);
				}
			}
		}
		$path = './application/cache/';
		if ($handle = opendir($path)) {
			while (false !== ($file = readdir($handle))) {
				if(file_exists($path.$file) && $file !=='.'  && $file !=='..'){
					unlink($path.$file);
				}
			}
		}
	}
}