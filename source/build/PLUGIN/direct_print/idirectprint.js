/*
	setting DIRECT_PRINT.IP_SERVER
	setting DIRECT_PRINT.PORT_SERVER
*/
_var.DIRECT_PRINT_socket={
	storage:{},
	set:function(fn,mod){var $this=this;$this.storage[iif(mod != undefined,$this.getModule(),mod)]=fn;},
	send:function(id,code,data){
		data=iif((typeof data=='array' || typeof data=='object'),JSON.stringify(data),data);
		var obj={ID:id,CODE:code,DATA:data,DATE:new Date().toString(),SESSION:_session_id};
		if(ws.readyState!= undefined && ws.readyState==ws.OPEN){
			_var.DIRECT_PRINT_ws.send(JSON.stringify(obj));
		}else{
			Ext.MessageBox.alert('Error', "Socket Printer Not Connect.");
		}
	},
	onmessage:function(msg){
		var $this=_var.DIRECT_PRINT_socket,data=JSON.parse(msg);
		for (var key in $this.storage){if(Ext.getCmp(key) != undefined){$this.storage[key](data);}}
	},
	getModule:function(){
		return Ext.getCmp('main.body').getActiveTab().id;
	}
};
function DIRECT_PRINT_initSocket(){
	_var.DIRECT_PRINT_ws = new WebSocket("ws://"+getSetting('DIRECT_PRINT','IP_SERVER')+":"+getSetting('DIRECT_PRINT','PORT_SERVER')+"/");
	_var.DIRECT_PRINT_ws.onopen = function() {
		console.log('Socket Print Opened.');
	};
	_var.DIRECT_PRINT_ws.onmessage = function (evt) {
		_var.DIRECT_PRINT_socket.onmessage(evt.data);
	};
	_var.DIRECT_PRINT_ws.onclose = function() {
		setTimeout(function(){DIRECT_PRINT_initSocket();},5000);
	};
	_var.DIRECT_PRINT_ws.onerror = function(err) {
	};
}
DIRECT_PRINT_initSocket();