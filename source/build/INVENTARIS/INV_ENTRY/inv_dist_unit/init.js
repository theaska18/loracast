shortcut.set({
	code:'main',
	list:[
		{
			key:'f5',
			fn:function(){
				Ext.getCmp('INV_DIST_UNIT.list').refresh();
			}
		},{
			key:'ctrl+f',
			fn:function(){
				Ext.getCmp('INV_DIST_UNIT.text').focus();
			}
		},{
			key:'ctrl+shift+f',
			fn:function(){
				_click('INV_DIST_UNIT.btnShowSearch');
			}
		},{
			key:'f6',
			fn:function(){
				_click('INV_DIST_UNIT.btnAdd');
			}
		}
	]
});