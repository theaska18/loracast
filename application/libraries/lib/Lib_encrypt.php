<?php
if(!defined('BASEPATH')) exit('No direct script access allowed');
class Lib_encrypt {
	function encode($sValue,$sSecretKey='1805199412345678'){
		return rtrim(
			base64_encode(
				mcrypt_encrypt(MCRYPT_RIJNDAEL_256,$sSecretKey, $sValue,MCRYPT_MODE_ECB,
					mcrypt_create_iv(mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256,MCRYPT_MODE_ECB),MCRYPT_RAND)
				)
			), "\0"
		);
	}
	function decode($sValue,$sSecretKey='1805199412345678'){
		return rtrim(
			mcrypt_decrypt(MCRYPT_RIJNDAEL_256,$sSecretKey,
				base64_decode($sValue),MCRYPT_MODE_ECB,mcrypt_create_iv(mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256,MCRYPT_MODE_ECB),MCRYPT_RAND)
			), "\0"
		);
	}
}
?>