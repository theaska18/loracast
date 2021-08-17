Ext.Ajax.request({
	url : url + 'cmd?m=ORG_STRUCTURE&f=getList',
	method : 'GET',
	before:function(){
		Ext.getCmp('main.tabORG_STRUCTURE').setLoading(true);
	},
	success : function(response) {
		Ext.getCmp('main.tabORG_STRUCTURE').setLoading(false);
		var r = ajaxSuccess(response);
		if (r.r == 'S') {
			Ext.getCmp('ORG_STRUCTURE.list').store.setRootNode([]);
			var c = Ext.getCmp('ORG_STRUCTURE.list').store.getRootNode();
			if(r.d.length>0){
				c.insertChild(1, r.d);
			}
			Ext.getCmp('ORG_STRUCTURE.list').expandAll();
		}
	},
	failure : function(jqXHR, exception) {
		Ext.getCmp('main.tabORG_STRUCTURE').setLoading(false);
		ajaxError(jqXHR, exception,true);
	}
});