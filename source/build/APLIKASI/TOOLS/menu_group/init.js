shortcut.set({
	code:'main',
	list:[
		{
			key:'f5',
			fn:function(){
				Ext.getCmp('MENU_GROUP.list').refresh();
			}
		},{
			key:'ctrl+f',
			fn:function(){
				Ext.getCmp('MENU_GROUP.text').focus();
			}
		},{
			key:'ctrl+shift+f',
			fn:function(){
				_click('MENU_GROUP.btnShowSearch');
			}
		},{
			key:'f6',
			fn:function(){
				_click('MENU_GROUP.btnAdd');
			}
		}
	]
});
Ext.getCmp('MENU_GROUP.list').refresh();