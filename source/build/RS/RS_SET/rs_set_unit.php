<?php
function delete(){
	$pid= _post('i');
	$res= _this()->query->row("SELECT unit_code FROM rs_unit WHERE unit_id=".$pid);
	if ($res != null) {
		$code=$res->unit_code;
		_this()->query->set("DELETE FROM rs_unit WHERE unit_id=".$pid);
		_message_delete('Kode Unit', $code );
	}else
		_not_found();
}