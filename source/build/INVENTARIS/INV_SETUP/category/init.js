Ext.Ajax.request({
	url : url + 'cmd?m=CATEGORY&f=getList',
	method : 'GET',
	before:function(){
		Ext.getCmp('main.tabCATEGORY').setLoading(true);
	},
	success : function(response) {
		Ext.getCmp('main.tabCATEGORY').setLoading(false);
		var r = ajaxSuccess(response);
		if (r.r == 'S') {
			Ext.getCmp('CATEGORY.list').store.setRootNode([]);
			var c = Ext.getCmp('CATEGORY.list').store.getRootNode();
			c.insertChild(1, r.d);
			Ext.getCmp('CATEGORY.list').expandAll();
		}
	},
	failure : function(jqXHR, exception) {
		Ext.getCmp('main.tabCATEGORY').setLoading(false);
		ajaxError(jqXHR, exception,true);
	}
});