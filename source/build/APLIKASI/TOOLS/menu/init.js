Ext.Ajax.request({
	url : url + 'cmd?m=MENU&f=getList',
	params:{
		group:Ext.getCmp('MENU.f1').getValue()
	},
	method : 'GET',
	before:function(){
		Ext.getCmp('main.tabMENU').setLoading(true);
	},
	success : function(response) {
		Ext.getCmp('main.tabMENU').setLoading(false);
		var r = ajaxSuccess(response);
		if (r.r == 'S') {
			Ext.getCmp('MENU.list').store.setRootNode([]);
			var c = Ext.getCmp('MENU.list').store.getRootNode();
			c.insertChild(1, r.d);
			Ext.getCmp('MENU.list').expandAll();
		}
	},
	failure : function(jqXHR, exception) {
		Ext.getCmp('main.tabMENU').setLoading(false);
		ajaxError(jqXHR, exception,true);
	}
});