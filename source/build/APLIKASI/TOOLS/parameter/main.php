<?php
function delete(){
	$me=_this();
	$pid=_post('i');
	$res=$me->query->row("SELECT system_flag FROM app_parameter WHERE parameter_code='".$pid."'");
	if($res){
		if($res->system_flag==false){
			$me->query->set("DELETE FROM app_parameter WHERE parameter_code='".$pid."'");
			_message_delete('Parameter Code',$pid)->end();
		}else
			_result()->warning()->setMessage('Deleting in Block, Because Data is System.');
	}else
		_not_found();
}
function get_allow(){
	$param=_get('param');
	_load('lib/lib_parameter');
	_data(_this()->lib_parameter->get($param))->end();
}
