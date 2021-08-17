this.approval_next=function(id,ayah,callback,callbackError){
	Ext.Ajax.request({
		url : url + 'cmd?m=APPROVAL_FLOW&f=initAllow&a=t',
		method : 'POST',
		params : {
			i : id
		},
		before:function(){
			ayah.setLoading(true);
		},
		success : function(response) {
			ayah.setLoading(false);
			var r = ajaxSuccess(response);
			if (r.r == 'S'){
				if(callback!= undefined){
					callback(r.d);
				}
			}else{
				if(callbackError!= undefined){
					callbackError(r.d);
				}
			}
		},
		failure : function(jqXHR, exception) {
			ayah.setLoading(false);
			ajaxError(jqXHR, exception,true);
			if(callbackError!= undefined){
				callbackError(r.d);
			}
		}
	});
}