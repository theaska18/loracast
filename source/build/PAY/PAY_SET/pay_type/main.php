<?php
function delete(){
	$pid= _post('i');
	$res= _this()->query->row("SELECT payment_type_code FROM payment_type WHERE payment_type_id=".$pid);
	if ($res != null) {
		$code=$res->payment_type_code;
		_this()->query->set("DELETE FROM payment_type WHERE payment_type_id=".$pid);
		_message_delete('Kode Jenis', $code );
	}else
		_not_found();
}